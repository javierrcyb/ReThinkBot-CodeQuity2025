import './ChatsNavbar.css';
import { useChat } from '../context/ChatContext';
import { Link } from 'react-router-dom';
import { deleteConversation as deleteFromServer } from '../services/conversation';

function ChatsNavBar() {
  const { conversations, isLoading, error } = useChat();
  const { deleteConversation } = useChat(); // del contexto

  const handleDelete = async (id) => {
  const confirm = window.confirm('Are you sure you want to delete this conversation?');

  if (!confirm) return;

  try {
    await deleteFromServer(id); 
    deleteConversation(id);             
  } catch (err) {
    console.error('Error deleting conversation:', err);
    alert('Error deleting conversation');
  }
};

  return (
    <div className="chats-navbar">
      <h3>Your conversations</h3>

      {isLoading && <p>🔄 Loading conversations...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <ul className="chat-list">
          {conversations.length === 0 ? (
            <p>You don't have any conversations yet.</p>
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
