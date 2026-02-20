const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const closeChat = document.getElementById("closeChat");


chatToggle.onclick = () => {
  chatPanel.classList.add("open");
};

closeChat.onclick = () => {
  chatPanel.classList.remove("open");
};

function displayUserMessage(message) {
  const chatBody = document.getElementById("chatBody");

  const msgDiv = document.createElement("div");
  msgDiv.className = "user-msg";
  msgDiv.innerText = message;

  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function displayBotMessage(message) {
  const chatBody = document.getElementById("chatBody");

  const msgDiv = document.createElement("div");
  msgDiv.className = "bot-msg";
  msgDiv.innerText = message;

  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
  const chatBody = document.getElementById("chatBody");

  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-msg typing";
  typingDiv.id = "typing-indicator";
  typingDiv.innerText = ".";

  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

async function sendMessage() {
  console.log("sending msg");

  const inputElement = document.getElementById("userInput");
  const message = inputElement.value;

  if (!message.trim()) return;

  displayUserMessage(message);
  inputElement.value = "";

  showTypingIndicator();

  const res = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  // console.log(data);
  removeTypingIndicator();

  displayBotMessage(data.reply);
}