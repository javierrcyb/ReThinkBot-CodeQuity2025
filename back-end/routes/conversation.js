const express = require('express');
const router = express.Router();
const { PrismaClient, SenderType } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  let { userId, mode, firstMessage } = req.body;

  console.log('body:', req.body);
  console.log('Mode recibido:', mode);


  try {
    // Si userId no existe (usuario no registrado), tratamos como anonId
    if (userId && userId.length === 36) { // UUID v4 = 36 chars
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
    console.error(error);
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
    console.error('Error al obtener conversación:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


module.exports = router;
