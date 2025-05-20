const apiKey = "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"; // Ganti dengan API key OpenRouter kamu

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const clickSound = document.getElementById("clickSound");

// Fungsi suara teks bahasa Indonesia
function speak(text) {
    if (!window.speechSynthesis) return;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'id-ID';
    msg.pitch = 1.2;
    msg.rate = 1.05;
    speechSynthesis.speak(msg);
}

// Fungsi menambah pesan ke chat dengan avatar dan bubble
function addMessage(text, sender = "bot") {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message", sender);

    if (sender === "bot") {
        const avatar = document.createElement("div");
        avatar.classList.add("avatar");
        messageEl.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = text;
    messageEl.appendChild(bubble);

    chat.appendChild(messageEl);
    chat.scrollTop = chat.scrollHeight;

    if (sender === "bot") speak(text);
}

// Fungsi kirim pesan ke AI
async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    clickSound.play(); // mainkan suara klik tombol

    addMessage(text, "user");
    input.value = "";

    const typingMsg = document.createElement("div");
    typingMsg.className = "typing";
    typingMsg.textContent = "AI-chan sedang mengetik...";
    chat.appendChild(typingMsg);
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://jheemaz21.github.io/chat-anime/",
                "X-Title": "AI-chan Anime Chat"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah AI-chan, asisten anime kawaii yang ramah dan membantu, dan kamu menjawab dalam Bahasa Indonesia."
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();

        chat.removeChild(typingMsg);
        addMessage(reply, "bot");
    } catch (error) {
        console.error(error);
        chat.removeChild(typingMsg);
        addMessage("Ups! AI-chan mengalami kesalahan teknis.", "bot");
    }
}

// Event listener tombol dan enter key
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
