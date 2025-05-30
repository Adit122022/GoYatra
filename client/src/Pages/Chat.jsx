import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PlaneTakeoff, Send } from "lucide-react";
import { Link } from 'react-router-dom'

const intentButtons = [
  { label: "🔁 Reset Password", message: "How can I reset my password?" },
  { label: "✈ Book Flight", message: "Help me book a flight to Paris." },
  { label: "☀ Weather in New York", message: "What's the weather in New York?" },
  { label: "🏨 Hotel in Tokyo", message: "Help me book a flight to Paris." },
  { label: "🌧 Forecast Berlin", message: "Will it rain tomorrow in Berlin?" },
  { label: "💱 Exchange USD to EUR", message: "What's the exchange rate for USD to EUR?" },
  { label: "🏙 Top spots in Sydney", message: "What are the top tourist spots in Sydney?" },
  { label: "🚗 Rent Car in Rome", message: "I need a rental car in Rome." },
  { label: "🐛 App Crash", message: "The app keeps crashing on my phone." },
  { label: "🌙 Dark Mode", message: "Can you add a dark mode feature?" },
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      let speechTimeout;

      recognition.onstart = () => {
        setListening(true);
        speechTimeout = setTimeout(() => {
          recognition.stop();
        }, 4000);
      };

      recognition.onspeechend = () => {
        clearTimeout(speechTimeout);
        recognition.stop();
      };

      recognition.onend = () => {
        setListening(false);
        clearTimeout(speechTimeout);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const speakText = (text) => {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      startListening();
    };

    synthRef.current.speak(utterance);
  };

const handleSend = async (customMsg) => {
  const messageToSend = customMsg || input;
  if (!messageToSend.trim()) return;

  setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/tripplan/chat", {
      message: messageToSend,
    });

    const rawReply = res.data.reply;

// Replace ** with paragraph breaks (2 newlines)
let botReply = rawReply.replace(/\*\*/g, "\n\n");

// Replace * with line breaks (1 newline)
botReply = botReply.replace(/\*/g, "\n");

// Optional: Trim extra spaces
botReply = botReply.trim();
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    speakText(botReply);
  } catch {
    const errMsg = "Server error occurred.";
    setMessages((prev) => [...prev, { from: "bot", text: errMsg }]);
    speakText(errMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 flex flex-col gap-5">
       {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 hover:opacity-80 transition-all">
          <PlaneTakeoff className="text-primary-300" />
          <h1 className="text-xl md:text-2xl font-bold">GoYatra</h1>
        </Link>

        {/* Chat Display */}
        <div className="h-96 overflow-y-auto bg-gray-100 rounded-lg p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs text-sm ${
                msg.from === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-800"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border text-gray-500 text-sm px-4 py-2 rounded-lg animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Intent Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {intentButtons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleSend(btn.message)}
              className="text-xs border px-2 py-1 rounded hover:bg-gray-200 transition-all"
            >
              <span className="hidden sm:inline">{btn.label}</span>
              <span className="inline sm:hidden">{btn.label.trim()[0]}</span>
            </button>
          ))}
        </div>

        {/* Input + Controls */}
        <div className="flex items-center gap-2">
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm"
            placeholder="Ask a travel question..."
          />
          <button
            onClick={() => handleSend()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <Send size={16} />
            <span className="hidden sm:inline text-sm">Send</span>
          </button>
          <button
            onClick={startListening}
            className={`px-3 py-2 rounded-lg text-white text-sm ${listening ? "bg-red-500" : "bg-green-600"}`}
            title="Start Listening"
          >
            🎤
          </button>
          <button
            onClick={stopSpeaking}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
            title="Stop Speaking"
          >
            🛑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
