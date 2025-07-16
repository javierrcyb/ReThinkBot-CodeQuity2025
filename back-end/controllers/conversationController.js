const { PrismaClient, SenderType } = require('@prisma/client');
const openai = require('../lib/geminiClient');
const prisma = new PrismaClient();

// Prompt personalizado por modo
function getSystemPrompt(mode) {
  switch (mode) {
    case 'SOCRATIC':
      return `Eres un tutor socrático que responde con preguntas que hacen reflexionar. No das respuestas directas.`;
    case 'DEBATE':
      return `Eres un oponente amistoso que ofrece contraargumentos racionales y bien estructurados.`;
    case 'EVIDENCE':
      return `Eres un mentor que exige justificación y evidencia clara para cada afirmación.`;
    case 'SPEECH':
      return `Eres un crítico del discurso que analiza los supuestos ideológicos y políticos de lo que dice el usuario.`;
    default:
      return `Eres un tutor que guía al usuario a pensar críticamente sobre lo que dice.`;
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
    console.error('Error creando conversación:', error);
    res.status(500).json({ error: 'Error creando conversación' });
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
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('❌ Error obteniendo conversación:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.listConversationsByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'Falta el userId' });

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
    console.error('❌ Error obteniendo conversaciones:', error);
    res.status(500).json({ error: 'Error del servidor' });
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

    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });

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

    const botText = result.text || '[Respuesta no disponible]';

    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.BOT,
        content: botText,
      }
    });

    res.json({ botReply: botText });
  } catch (err) {
    console.error('❌ Error enviando mensaje:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.message.deleteMany({ where: { conversationId: id } });
    await prisma.conversation.delete({ where: { id } });

    res.json({ success: true, message: 'Conversación eliminada' });
  } catch (error) {
    console.error('❌ Error eliminando conversación:', error);
    res.status(500).json({ error: 'No se pudo eliminar la conversación' });
  }
};
