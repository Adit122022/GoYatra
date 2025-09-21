import { useState, useEffect, useRef } from "react";
import { PlaneTakeoff, Send, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAxios from "../components/Axios/axios";

const intentButtons = [
  { label: "🔁 Reset Password", message: "How can I reset my password?" },
  { label: "✈ Book Flight", message: "Help me book a flight to Paris." },
  { label: "☀ Weather in New York", message: "What's the weather in New York?" },
  { label: "🏨 Hotel in Tokyo", message: "Help me book a hotel in Tokyo." },
  { label: "🏙 Top spots in Sydney", message: "What are the top tourist spots in Sydney?" },
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const axiosInstance = useAxios();

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
        handleSend(transcript);
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
    if (!isSpeechEnabled) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
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
      const res = await axiosInstance.post("/tripplan/chat", {
        message: messageToSend,
      });

      const rawReply = res.data.reply;

      let botReply = rawReply.replace(/\*\*/g, "\n\n");
      botReply = botReply.replace(/\*/g, "\n");
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-base-100 rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 hover:opacity-80 transition-all">
          <PlaneTakeoff className="text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">GoYatra</h1>
        </Link>

        <div className="h-96 overflow-y-auto bg-base-200/50 rounded-lg p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.from === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-md text-sm shadow ${msg.from === "user" ? "bg-primary text-primary-content" : "bg-base-100 text-base-content"
                }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-base-100 text-base-content/60 text-sm px-4 py-2 rounded-lg shadow animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {intentButtons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleSend(btn.message)}
              className="btn btn-ghost btn-sm normal-case text-xs font-normal text-base-content/80 hover:bg-base-300" >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input input-bordered w-full text-sm"
            placeholder="Ask a travel question..."
          />
          <button
            onClick={() => handleSend()}
            className="btn btn-primary"
          >
            <Send size={16} />
          </button>
          <button
            onClick={startListening}
            className={`btn ${listening ? "btn-error" : "btn-ghost hover:bg-base-300"}`}
            title="Start Listening"
          >
            <Mic size={16} />
          </button>
          <button
            onClick={stopSpeaking}
            className="btn btn-ghost hover:bg-base-300"
            title="Stop Speaking"
          >
            <Square size={16} />
          </button>
          <button
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className="btn btn-ghost hover:bg-base-300"
            title={isSpeechEnabled ? "Disable Speech" : "Enable Speech"}
          >
            {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Chat;
