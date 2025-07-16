import './RegisterPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await api.post('/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      if (err.response) {
        const res = err.response;

        // 1. Errores de express-validator
        if (res.data.errors) {
          setErrors(res.data.errors.map(e => e.msg));
        }

        // 2. Errores personalizados del controlador
        else if (res.data.error) {
          setErrors([res.data.error]);
        }

        // 3. Error inesperado
        else {
          setErrors(['Unexpected error. Please try again.']);
        }
      } else {
        setErrors(['No connection to server.']);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="name" placeholder="Nombre" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Sign up</button>

      {/* Mostrar errores */}
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((err, idx) => (
            <li key={idx} className="error-item">{err}</li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default RegisterPage;
