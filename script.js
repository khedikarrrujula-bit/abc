const recognition = new (
  window.SpeechRecognition || window.webkitSpeechRecognition
)();

recognition.continuous = false;
recognition.lang = "en-IN";

function startListening() {
  recognition.start();
}

recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript;
  document.getElementById("transcript").innerText =
    "Transcript: " + text;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  document.getElementById("result").innerText =
    `${data.label} (${data.confidence}%)`;
};
