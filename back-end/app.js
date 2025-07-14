const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())

app.get('/', (req, res) => res.send('API ReThinkBot funcionando'))

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const conversationRoutes = require('./routes/conversation');
app.use('/api/conversations', conversationRoutes);

module.exports = app