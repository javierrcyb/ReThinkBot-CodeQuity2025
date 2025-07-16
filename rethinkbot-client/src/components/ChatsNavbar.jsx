import './ChatsNavbar.css';
import { useChat } from '../context/ChatContext';
import { Link } from 'react-router-dom';
import { deleteConversation } from '../services/conversation'; 

function ChatsNavBar() {
  const { conversations, isLoading, error } = useChat();

  const handleDelete = async (id) => {
  const confirm = window.confirm('¿Estás seguro de eliminar esta conversación?');

  if (!confirm) return;

  try {
    await deleteConversation(id);
    alert('✅ Conversación eliminada');

    // Puedes recargar las conversaciones desde el contexto si tienes una función
    // O simplemente recargar la página temporalmente
    window.location.reload(); // ⚠️ temporal, puedes mejorarlo con estado global
  } catch (err) {
    console.error('❌ Error eliminando conversación:', err);
    alert('Error al eliminar conversación');
  }
};

  return (
    <div className="chats-navbar">
      <h3>Tus conversaciones</h3>

      {isLoading && <p>🔄 Cargando conversaciones...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <ul className="chat-list">
          {conversations.length === 0 ? (
            <p>No tienes conversaciones aún.</p>
          ) : (
            conversations.map((conv) => (
              <li key={conv.id} className="chat-item">
                <Link to={`/chat/${conv.id}`} className="chat-link">
                  🗨️ Chat {conv.id.slice(0, 6)}... – {conv.mode}
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(conv.id)}
                  title="Eliminar conversación"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ChatsNavBar;
