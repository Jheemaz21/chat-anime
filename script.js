const chatBox = document.querySelector(".chat-box");
const input = document.querySelector("input");
const button = document.querySelector("button");
const audioClick = document.getElementById("clickSound");
const typingDelay = 30;

// Ganti URL ini dengan URL backend kamu (misal dari Render atau Replit)
const API_URL = "https://your-backend-name.onrender.com/api/chat"; // Ganti dengan backend kamu

// Tambahkan pesan ke UI
function addMessage(content, sender = "user") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = content;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
  } else {
    messageDiv.appendChild(bubble);
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Efek ketik
async function typeEffect(text, delay = typingDelay) {
  const bubble = document.createElement("div");
  bubble.className = "bubble typing";
  const messageDiv = document.createElement("div");
  messageDiv.className = "message bot";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  for (let i = 0; i <= text.length; i++) {
    bubble.innerText = text.slice(0, i);
    await new Promise(r => setTimeout(r, delay));
  }

  bubble.classList.remove("typing");
}

// Kirim pesan ke backend AI
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  input.value = "";
  audioClick.play();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    if (data.reply) {
      await typeEffect(data.reply);
    } else {
      addMessage("Maaf, terjadi kesalahan saat membalas.", "bot");
    }
  } catch (error) {
    console.error("Error:", error);
    addMessage("Gagal terhubung ke AI. Coba lagi nanti.", "bot");
  }
}

button.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
