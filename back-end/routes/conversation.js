const express = require('express');
const router = express.Router();
const { PrismaClient, SenderType } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { userId, modeId, firstMessage } = req.body;

  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        modeId,
        messages: {
          create: [
            {
              sender: SenderType.USER,
              content: firstMessage,
            },
            {
              sender: SenderType.BOT,
              content: generateBotResponse(modeId, firstMessage), // función personalizada
            },
          ],
        },
      },
      include: { messages: true },
    });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear conversación' });
  }
});

function generateBotResponse(modeId, userInput) {
  if (modeId === 1) return "¿Cómo defines eso?";
  if (modeId === 2) return "¿Qué tal si pensamos desde el otro lado?";
  if (modeId === 3) return "¿Tienes evidencia para esa afirmación?";
  if (modeId === 4) return "¿Qué marco ideológico hay detrás?";
  return "Interesante, cuéntame más.";
}

module.exports = router;
