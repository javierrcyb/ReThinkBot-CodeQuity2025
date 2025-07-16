import './LoginPage.css';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response) {
        const res = err.response;

        if (res.data.errors) {
          setErrors(res.data.errors.map(e => e.msg));
        } else if (res.data.error) {
          setErrors([res.data.error]); // <-- Aquí aparecerán "User does not exist", etc.
        } else {
          setErrors(['Unexpected error. Please try again.']);
        }
      } else {
        setErrors(['No connection to server.']);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Enter</button>

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

export default LoginPage;
