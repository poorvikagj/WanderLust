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



async function sendMessage() {
  console.log("sending msg");

  const inputElement = document.getElementById("userInput");
  const message = inputElement.value;

  if (!message.trim()) return;

  displayUserMessage(message);
  inputElement.value = "";

  const res = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  console.log(data);

  displayBotMessage(data.reply);
}