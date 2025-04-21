
import React, { useState, useRef} from "react";
import { FiMessageCircle, FiSend, FiMic, FiMicOff, FiX } from "react-icons/fi";

const HelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const toggleBot = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { fromUser: true, text: message }]);
    setMessage("");
    // You can add chatbot reply logic here
  };

  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error", e);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="helpbot-container">
      {/* Floating Icon */}
      <button className="helpbot-button" onClick={toggleBot}>
        <FiMessageCircle size={24} />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="helpbot-popup">
          <div className="helpbot-header">
            <h4>HelpBot</h4>
            <FiX onClick={toggleBot} style={{ cursor: "pointer" }} />
          </div>

          <div className="helpbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.fromUser ? "user-message" : "bot-message"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="helpbot-input">
            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>
              <FiSend />
            </button>
            <button onClick={isRecording ? stopVoice : startVoice}>
              {isRecording ? <FiMicOff /> : <FiMic />}
            </button>
          </div>
        </div>
      )}

      {/* CSS Styling */}
      <style jsx>{`
        .helpbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .helpbot-button {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          padding: 12px;
          cursor: pointer;
        }

        .helpbot-popup {
          width: 300px;
          height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .helpbot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f5f5f5;
          border-bottom: 1px solid #ccc;
        }

        .helpbot-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }

        .user-message {
          background-color: #007bff;
          color: white;
          padding: 8px 12px;
          border-radius: 16px;
          margin: 6px 0;
          align-self: flex-end;
        }

        .bot-message {
          background-color: #e9ecef;
          padding: 8px 12px;
          border-radius: 16px;
          margin: 6px 0;
          align-self: flex-start;
        }

        .helpbot-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #ccc;
        }

        .helpbot-input input {
          flex: 1;
          padding: 8px;
          border-radius: 20px;
          border: 1px solid #ccc;
        }

        .helpbot-input button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default HelpBot;
