import './App.css';
import ChatsNavBar from './components/ChatsNavbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AppRoutes from './Router.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/');
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
              <p>🔓 Active session</p>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <button onClick={handleLogIn}>Log in</button>
              <button onClick={handleSignIn}>Sign up</button>
              <p>🔒 You are not logged in</p>
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
