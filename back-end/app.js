const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('API ReThinkBot funcionando'))

module.exports = app

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const conversationRoutes = require('./routes/conversation');
app.use('/api/conversations', conversationRoutes);
