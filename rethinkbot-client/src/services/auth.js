import api from './api';

export async function login(email, password) {
  // por ahora solo se usa email
  const response = await api.post('/api/auth/login', { email });
  return response.data; // incluye token
}

export async function register(email, name) {
  const response = await api.post('/api/auth/register', { email, name });
  return response.data;
}
