const express = require('express');
const router = express.Router();
const { PrismaClient, SenderType } = require('@prisma/client');
const prisma = new PrismaClient();

// 🟢 Crear nueva conversación
router.post('/', async (req, res) => {
  let { userId, mode, firstMessage } = req.body;

  console.log('📨 Nueva conversación:', { userId, mode });

  try {
    // Si es anonId (UUID v4 = 36 chars), obtener o crear usuario
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
            },
            {
              sender: SenderType.BOT,
              content: generateBotResponse(mode, firstMessage),
            },
          ],
        },
      },
      include: { messages: true },
    });

    res.json(conversation);
  } catch (error) {
    console.error('❌ Error creando conversación:', error);
    res.status(500).json({ error: 'Error al crear conversación' });
  }

  function generateBotResponse(mode, userInput) {
    if (mode === 'SOCRATIC') return "¿Cómo defines eso?";
    if (mode === 'DEBATE') return "¿Qué tal si pensamos desde el otro lado?";
    if (mode === 'EVIDENCE') return "¿Tienes evidencia para esa afirmación?";
    if (mode === 'SPEECH') return "¿Qué marco ideológico hay detrás?";
    return "Interesante, cuéntame más.";
  }
});

// 🟡 Obtener conversación por ID
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

// 🟣 Listar todas las conversaciones de un usuario
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Falta el userId' });
  }

  try {
    let realUserId = userId;

    // Si es anonId, buscar ID real
    if (userId.length === 36) {
      const anon = await prisma.user.findUnique({ where: { anonId: userId } });
      if (!anon) return res.json([]); // sin conversaciones
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
          take: 1, // preview del primer mensaje
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
  const { userId, text } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation) {
      console.error('❌ Conversación no encontrada:', id);
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Guardar mensaje del usuario
    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.USER,
        content: text,
      }
    });

    // Generar respuesta simple del bot (puedes integrar GPT o lógica real aquí)
    const botResponse = generateBotResponse(conversation.mode, text);

    // Guardar respuesta del bot
    await prisma.message.create({
      data: {
        conversationId: id,
        sender: SenderType.BOT,
        content: botResponse,
      }
    });

    res.json({ botReply: botResponse });
  } catch (err) {
    console.error('❌ Error enviando mensaje:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }

  function generateBotResponse(mode, userInput) {
    if (mode === 'SOCRATIC') return "¿Qué implicaciones tiene eso?";
    if (mode === 'DEBATE') return "¿Y si el argumento contrario fuera cierto?";
    if (mode === 'EVIDENCE') return "¿Cuál sería una fuente confiable para eso?";
    if (mode === 'SPEECH') return "¿Qué intención puede haber detrás de ese discurso?";
    return "Entiendo. ¿Puedes profundizar?";
  }
});


module.exports = router;
