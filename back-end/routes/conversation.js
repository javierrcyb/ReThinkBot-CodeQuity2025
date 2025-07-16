const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversationById,
  listConversationsByUser,
  sendMessage,
  deleteConversation
} = require('../controllers/conversationController');

// Crear conversación
router.post('/', createConversation);

// Obtener conversación por ID
router.get('/:id', getConversationById);

// Obtener lista de conversaciones de un usuario
router.get('/', listConversationsByUser);

// Enviar mensaje a una conversación existente
router.post('/:id/messages', sendMessage);

// Eliminar conversación
router.delete('/:id', deleteConversation);

module.exports = router;
