import api from './api';

export async function createConversation(userOrAnonId, mode, text) {
  const response = await api.post('/api/conversations', {
    userId: userOrAnonId,
    mode,
    firstMessage: text,
  });
  return response.data;
}

export async function getConversationById(id) {
  const res = await api.get(`/api/conversations/${id}`);
  return res.data;
}

export async function getConversations(userId) {
  const res = await api.get(`/api/conversations`, {
    params: { userId },
  });
  return res.data;
}

export async function sendMessage(conversationId, userId, text) {
  try {
    const res = await api.post(`/api/conversations/${conversationId}/messages`, {
      userId,
      text
    });
    return res.data;
  } catch (err) {
    console.error('Backend respondió con error:', err.response?.data || err.message);
    throw new Error('Error al enviar mensaje');
  }
}

export async function deleteConversation(conversationId) {
  const res = await api.delete(`/api/conversations/${conversationId}`);
  return res.data;
}