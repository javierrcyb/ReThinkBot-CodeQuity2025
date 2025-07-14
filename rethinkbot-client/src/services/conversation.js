import api from './api';

export async function createConversation(userId, modeId, text) {
  const response = await api.post('/api/conversations', {
    userId,
    modeId,
    firstMessage: text,
  });
  return response.data;
}
