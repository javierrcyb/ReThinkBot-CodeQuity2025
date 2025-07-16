const express = require('express');
const router = express.Router();
const { PrismaClient, SenderType } = require('@prisma/client');
const prisma = new PrismaClient();
const openai = require('../lib/geminiClient.js');

// 🟢 Crear nueva conversación
router.post('/', async (req, res) => {
  let { userId, mode, firstMessage } = req.body;
  console.log('📨 Nueva conversación:', { userId, mode });

  try {
    // 🔍 Si es anonId (UUID v4), obtener o crear usuario
    if (userId && userId.length === 36) {
      let anonUser = await prisma.user.findUnique({ where: { anonId: userId } });
      if (!anonUser) {
        const newAnon = await prisma.user.create({ data: { anonId: userId } });
        userId = newAnon.id;
      } else {
        userId = anonUser.id;
      }
    }

    // Crear conversación
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

    // Preparar input para Gemini
    const prompt = [
      { role: 'user', parts: [{ text: getSystemPrompt(mode) }] },
      { role: 'user', parts: [{ text: firstMessage }] }
    ];

    // Llamar a Gemini para obtener respuesta
    const result = await openai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const botText = result.text || '[Respuesta no disponible]';

    // Guardar respuesta del bot
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: SenderType.BOT,
        content: botText,
      }
    });

    // Retornar la conversación con ambos mensajes
    const updated = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: { messages: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error creando conversación:', error);
    res.status(500).json({ error: 'Error al crear conversación' });
  }
});

// 🟣 Obtener conversación por ID
router.get('/:id', async (req, res) => {
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
});

// 🟡 Listar conversaciones por usuario
router.get('/', async (req, res) => {
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
});

// 🔵 Enviar mensaje en conversación existente
router.post('/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });

    // Guardar mensaje del usuario
    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.USER,
        content: text,
      }
    });

    // Crear historial completo
    const history = conversation.messages.map(msg => ({
      role: msg.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Añadir prompt del sistema + nuevo mensaje del usuario
    history.unshift({ role: 'user', parts: [{ text: getSystemPrompt(conversation.mode) }] });
    history.push({ role: 'user', parts: [{ text }] });

    const result = await openai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
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
});

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

module.exports = router;
