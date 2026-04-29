const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages");
const API_BASE_URL =
  window.location.hostname === "127.0.0.1" && window.location.port === "3000"
    ? "http://127.0.0.1:3110"
    : "";

const conversation = [];

const autoGrowInput = () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
};

const scrollToBottom = () => {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const addMessage = (role, content, extraClass = "") => {
  const div = document.createElement("div");
  div.className = `message ${role} ${extraClass}`.trim();
  div.textContent = content;
  messagesContainer.appendChild(div);
  scrollToBottom();
};

const setPendingState = (isPending) => {
  input.disabled = isPending;
  sendButton.disabled = isPending;
  sendButton.textContent = isPending ? "Sending..." : "Send";
};

const sendMessage = async (text) => {
  setPendingState(true);
  addMessage("user", text);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: conversation
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || "Request failed");
    }

    const assistantReply = payload?.response || "No response generated.";
    addMessage("bot", assistantReply);

    conversation.push({ role: "user", content: text });
    conversation.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    addMessage("bot", error.message || "Something went wrong.", "error");
  } finally {
    setPendingState(false);
    input.focus();
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  input.value = "";
  autoGrowInput();
  await sendMessage(text);
});

input.addEventListener("input", autoGrowInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

addMessage("bot", "Hi, I am your AI assistant. What would you like to build today?");
input.focus();
