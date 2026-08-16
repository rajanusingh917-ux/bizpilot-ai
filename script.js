const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = "chat-message " + type;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

async function sendMessage() {
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  const thinking = addMessage("Thinking…", "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    thinking.textContent = data.reply;
  } catch (error) {
    console.error(error);
    thinking.textContent =
      "Sorry, the AI is temporarily unavailable. Please try again.";
  }
}

function quickQuestion(question) {
  userInput.value = question;
  sendMessage();
}

function handleEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
