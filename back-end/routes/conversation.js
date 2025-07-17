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

// Obtener lista de conversaciones de un usuario
router.get('/', listConversationsByUser);

// Obtener conversación por ID
router.get('/:id', getConversationById);


// Enviar mensaje a una conversación existente
router.post('/:id/messages', sendMessage);

// Eliminar conversación
router.delete('/:id', deleteConversation);

module.exports = router;
