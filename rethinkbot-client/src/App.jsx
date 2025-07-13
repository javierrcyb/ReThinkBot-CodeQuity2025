import './App.css'
import ChatsNavBar from './components/ChatsNavbar.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AppRoutes from './Router.jsx'

function App() {
  const { user } = useAuth()

  return (
    <div className='whole-page'>
      <div className='sidebar'>
        <p className='new-chat'>New chat</p>
        <ChatsNavBar />
        <div className='foot-sidebar'>
          {user ? (
            <p>Usuario logueado</p>
          ) : (
            <p>No has iniciado sesión</p>
          )}
        </div>
      </div>

      <div className='main-page'>
        <AppRoutes />
      </div>
    </div>
  )
}

export default App
