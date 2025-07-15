import api from './api';

export async function login(email, password) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

export async function register(email, name) {
  const response = await api.post('/api/auth/register', { email, name });
  return response.data;
}
