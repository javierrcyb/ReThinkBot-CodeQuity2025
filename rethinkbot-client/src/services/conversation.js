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