# 🧠 ReThinkBot – Entrenador de Pensamiento Crítico

---

## 📌 Problema + Solución

En un contexto de creciente polarización, desinformación y pensamiento superficial promovido por cámaras de eco digitales, las personas carecen de herramientas accesibles para entrenar su pensamiento crítico de forma activa.  
**ReThinkBot** es un chatbot educativo diseñado como un **entrenador cognitivo** que desafía activamente tus ideas, identifica falacias, te obliga a argumentar con evidencia y a considerar perspectivas opuestas. No responde por ti: **te entrena a pensar mejor**.

---

## 👥 Usuarios Objetivo

- **Estudiantes (15–25 años)**: especialmente en educación cívica, filosofía, periodismo, ciencias sociales o tecnología.
- **Docentes y facilitadores**: que buscan promover el debate y la reflexión crítica en sus clases.
- **ONGs y medios de comunicación**: que trabajan en alfabetización mediática, combate de la desinformación o formación ciudadana.
- **Curiosos intelectuales**: personas interesadas en mejorar su capacidad de argumentar y razonar.

---

## 🧠 Objetivo General

Construir una plataforma que no entrega respuestas “correctas”, sino que entrena al usuario a pensar, argumentar, contrastar y reflexionar desde múltiples ángulos. Esto se logra a través de distintos **modos de conversación críticos**.

---

## 🧩 Modos Activos del Bot

### 🟢 Modo 1: Socrático
- Solo responde con preguntas.
- Obliga al usuario a definir, justificar y profundizar.
- Fomenta reflexión metacognitiva.

### 🟠 Modo 2: Debate Ético
- Toma el lado opuesto al del usuario.
- Argumenta con lógica moral o filosófica.
- Cambia de enfoque si el usuario responde con solidez.

### 🔵 Modo 3: Prueba de Evidencia
- Pide fuentes verificables, datos y cifras.
- Identifica falacias y saltos lógicos.
- Evalúa si las premisas sostienen la conclusión.

### 🟣 Modo 4: Análisis de Discurso
- Analiza el lenguaje, términos y marcos ideológicos.
- Detecta sesgos, eufemismos, generalizaciones y falacias.
- Hace explícitas las implicancias del discurso.

---

## 🗺️ Tabla de Modos + Comportamiento Esperado

| Modo                  | Input del Usuario                            | ReThinkBot responde con…                                           |Comportamiento específico
|-----------------------|----------------------------------------------|---------------------------------------------------------------------------------------------------|
|🟢 Socrático           |“Creo que la pobreza es culpa de la flojera.” |“¿Cómo defines ‘flojera’? ¿Cómo puedes demostrar esa relación?”     | Solo formula preguntas.      |
|🟠 Debate Ético        |“Estoy a favor del aborto.”                   |“¿Y si el feto tiene derecho a la vida? ¿No es eso discriminación?” | Adopta postura contraria con respeto.|
| 🔵 Prueba de Evidencia|“Los inmigrantes aumentan el crimen.”         |“¿Tienes datos que respalden eso? ¿De qué país y año hablas?”       | Pide evidencia y lógica clara.|
| 🟣 Análisis Discurso  |“Los verdaderos patriotas saben la verdad.”   |“¿Qué implica ‘verdaderos’? ¿Qué ideología se esconde allí?”        | Analiza ideología, sesgos y marco retórico.|


## 🧪 Flujo de Interacción (Arquitectura Lógica)

```plaintext
1. Usuario escribe una afirmación, argumento o pregunta.
2. Elige el modo activo (Socrático, Debate Ético, Evidencia, Discurso).
3. ReThinkBot analiza el input y genera una respuesta:
    - Que desafía, cuestiona o problematiza
    - Que señala sesgos, falacias o falta de evidencia
    - Que invita a pensar desde otra perspectiva
4. Usuario responde, modifica o contraargumenta.
5. ReThinkBot profundiza la conversación o propone una reflexión final.
6. El sistema genera una pantalla final con:
    - Mapa de ideas discutidas
    - Falacias detectadas
    - Preguntas abiertas
    - Recomendaciones de lectura o fuentes fiables

┌────────────────────────────────────────────┐
│ 🧠 ReThinkBot                               │
├────────────────────────────────────────────┤
│ [ Modo: 🔘 Socrático | ⚪ Debate | ⚪ Evidencia | ⚪ Discurso ] │
├────────────────────────────────────────────┤
│ Chat                                        │
│ Usuario: “Creo que X.”                      │
│ Bot:    “¿Qué justificación tienes para eso?”│
│                                            │
│ [ Campo de texto ]           [Enviar]       │
└────────────────────────────────────────────┘
