// server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Puerto del frontend Vite
  credentials: true // Para cookies/sesión
}));


