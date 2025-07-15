import './App.css';
import ChatsNavBar from './components/ChatsNavbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AppRoutes from './Router.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // 2. Inicializar

  const handleNewChat = () => {
    navigate('/'); // 3. Redirigir a la ruta deseada
  };

  const handleLogIn = () => {
    navigate('/login');
  }

  const handleSignIn = () => {
    navigate('/register')
  }

  return (
    <div className='whole-page'>
      <div className='sidebar'>
        <button className='new-chat' onClick={handleNewChat}>New chat</button>
        <ChatsNavBar />
        <div className='foot-sidebar'>

          {user ? (
            <>
              <p>🔓 Sesión activa</p>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button onClick={handleLogIn}>Iniciar sesion</button>
              <button onClick={handleSignIn}>Registrarse</button>
              <p>🔒 No has iniciado sesión</p>
            </>
          )}
        </div>
      </div>

      <div className='main-page'>
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
