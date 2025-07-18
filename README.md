# 🧠  ReThinkBot – Train your way of thinking
> An educational chatbot designed to challenge your ideas, detect fallacies, and strengthen your critical thinking.

------------------

## 📌 Problem
In the era of misinformation, digital polarization, and echo chambers, thinking critically has become increasingly challenging. Most educational tools provide answers, but few train us to ask better questions.

------------------

## 💡 Solution
**ReThinkBot** is an AI-powered cognitive coach that simulates challenging conversations in four different modes (Socratic, Ethical Debate, Evidence Testing, and Discourse Analysis). Rather than providing answers, it challenges, confronts, and deepens the user's ideas to strengthen their reasoning skills.

------------------

## 🧑‍🎓 Target Users
- Students (ages 15–25)
- Teachers and facilitators
- NGOs and media outlets that promote media literacy
- Curious intellectuals

------------------

## 🧩 Conversation Modes

| Mode                     | Brief description                                   |
|--------------------------|------------------------------------------------------|
| 🟢 Socratic             | Ask profound questions.                              |
| 🟠 Ethical Debate       | Take the opposite stance, arguing with moral logic.  |
| 🔵 Evidence Test        | Demand data and evidence; spot fallacies.            |
| 🟣 Discourse Analysis   | Analyzes ideology, bias, and language.               |

------------------

## ⚙️ Tech Stack
### 🖥️ Frontend
- **React 19** – Library for building user interfaces
- **Vite** – Ultra-fast packager for modern development
- **React Router DOM v7** – For navigation between routes
- **Axios** – HTTP client to consume your backend API

### 🧠 Backend
- **Express 5** – Web framework for Node.js
- **Passport.js + passport-local** – Local authentication with sessions
- **express-session** – Secure session management
- **bcryptjs** – Password hashing
- **express-validator** – Validation of entries in routes
- **dotenv** – Environment variables
- **cors** – Middleware for CORS configuration

### 🧬 IA & APIs
- **Google Generative AI (Gemini 1.5)** – Generating chatbot responses

### 🛢️ Database
- **PostgreSQL** – Relational database
- **Prisma ORM** – Object-relational mapping for modeling, migrations, and queries

### 🧪 Dev Tools
- **Nodemon** – Automatic reloading in backend development
- **ESLint** – JavaScript/React Linter

### ☁️ Deployment
- **Frontend**: Vercel  
- **Backend**: Render

------------------

## 🧪 How It Works
1. Users can enter anonymously or log in to save their conversation history.
2. Write a statement or question.
3. Select an interaction mode:
   - 🧠 **Socratic** (critical questions)
   - ⚖️ **Ethical Debate**
   - 🔍 **Evidence Test**
   - 🗣️ **Discourse Analysis**
4. ReThinkBot responds according to the mode, promoting critical thinking through counterarguments, challenging questions, or linguistic analysis.
5. Each conversation is saved as a separate chat, allowing you to return to it later.

------------------

## 🛠️ Cómo Ejecutar Localmente

```bash
# 1. Clone the repository
git clone https://github.com/tuusuario/ReThinkBot-CodeQuity2025.git
cd ReThinkBot-CodeQuity2025

####################
# 🔧 Backend Setup
####################

# 2. Go to the backend folder
cd back-end

# 3. Install dependencies
npm install

# 4. Create the .env file (use .env.example)
cp .env.example .env

# 5. Start the backend server
npm start

####################
# 🖥️ Frontend Setup
####################

# 6. Open a new terminal and go to the frontend folder.
cd rethinkbot-client

# 7. Install dependencies
npm install

# 8. Create the .env file (use .env.example)
cp .env.example .env

# 9. Start the React application
npm run dev
