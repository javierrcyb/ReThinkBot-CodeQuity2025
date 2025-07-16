const { PrismaClient, SenderType } = require('@prisma/client');
const openai = require('../lib/geminiClient');
const prisma = new PrismaClient();

// Prompt personalizado por modo
function getSystemPrompt(mode) {
  switch (mode) {
    case 'SOCRATIC':
      return `You are a Socratic tutor who responds with questions that make people think. Do not give direct answers.`;
    case 'DEBATE':
      return `You are a friendly opponent who offers rational and well-structured counterarguments.`;
    case 'EVIDENCE':
      return `You are a mentor who demands justification and clear evidence for every statement.`;
    case 'SPEECH':
      return `You are a discourse critic who analyzes the ideological and political assumptions behind what the user says.`;
    default:
      return `You are a tutor who guides the user to think critically about what they say.`;
  }
}

exports.createConversation = async (req, res) => {
  let { userId, mode, firstMessage } = req.body;

  try {
    // Si es anonId (UUID v4), buscar o crear
    if (userId && userId.length === 36) {
      let anonUser = await prisma.user.findUnique({ where: { anonId: userId } });
      if (!anonUser) {
        const newAnon = await prisma.user.create({ data: { anonId: userId } });
        userId = newAnon.id;
      } else {
        userId = anonUser.id;
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        mode,
        messages: {
          create: [
            {
              sender: SenderType.USER,
              content: firstMessage,
            }
          ]
        },
      },
      include: { messages: true },
    });

    const prompt = [
      { role: 'user', parts: [{ text: getSystemPrompt(mode) }] },
      { role: 'user', parts: [{ text: firstMessage }] }
    ];

    const result = await openai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const botText = result.text || '[Answer not available]';

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: SenderType.BOT,
        content: botText,
      }
    });

    const updated = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: { messages: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Error creating conversation' });
  }
};

exports.getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error obtaining conversation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listConversationsByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'The userId is missing.' });

  try {
    let realUserId = userId;

    if (userId.length === 36) {
      const anon = await prisma.user.findUnique({ where: { anonId: userId } });
      if (!anon) return res.json([]);
      realUserId = anon.id;
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: realUserId },
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        startedAt: true,
        mode: true,
        messages: {
          take: 1,
          orderBy: { timestamp: 'asc' },
          select: { content: true }
        }
      }
    });

    res.json(conversations);
  } catch (error) {
    console.error('Error retrieving conversations:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.USER,
        content: text,
      }
    });

    const history = conversation.messages.map(msg => ({
      role: msg.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    history.unshift({ role: 'user', parts: [{ text: getSystemPrompt(conversation.mode) }] });
    history.push({ role: 'user', parts: [{ text }] });

    const result = await openai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
    });

    const botText = result.text || '[Answer not available]';

    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.BOT,
        content: botText,
      }
    });

    res.json({ botReply: botText });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.message.deleteMany({ where: { conversationId: id } });
    await prisma.conversation.delete({ where: { id } });

    res.json({ success: true, message: 'Deleted conversation' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'The conversation could not be deleted.' });
  }
};
