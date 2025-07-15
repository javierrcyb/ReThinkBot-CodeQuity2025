import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="name" placeholder="Nombre" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default RegisterPage;
