
// import React, { useState, useRef} from "react";
// import { FiMessageCircle, FiSend, FiMic, FiMicOff, FiX } from "react-icons/fi";

// const HelpBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const recognitionRef = useRef(null);

//   const toggleBot = () => setIsOpen(!isOpen);

//   const handleSend = () => {
//     if (!message.trim()) return;
//     setMessages([...messages, { fromUser: true, text: message }]);
//     setMessage("");
//     // You can add chatbot reply logic here
//   };

//   const startVoice = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setMessage(transcript);
//     };

//     recognition.onerror = (e) => {
//       console.error("Speech error", e);
//     };

//     recognition.onend = () => setIsRecording(false);

//     recognition.start();
//     recognitionRef.current = recognition;
//     setIsRecording(true);
//   };

//   const stopVoice = () => {
//     recognitionRef.current?.stop();
//     setIsRecording(false);
//   };

//   return (
//     <div className="helpbot-container">
//       {/* Floating Icon */}
//       <button className="helpbot-button" onClick={toggleBot}>
//         <FiMessageCircle size={24} />
//       </button>

//       {/* Chat Popup */}
//       {isOpen && (
//         <div className="helpbot-popup">
//           <div className="helpbot-header">
//             <h4>HelpBot</h4>
//             <FiX onClick={toggleBot} style={{ cursor: "pointer" }} />
//           </div>

//           <div className="helpbot-messages">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={msg.fromUser ? "user-message" : "bot-message"}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           <div className="helpbot-input">
//             <input
//               type="text"
//               placeholder="Ask something..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend}>
//               <FiSend />
//             </button>
//             <button onClick={isRecording ? stopVoice : startVoice}>
//               {isRecording ? <FiMicOff /> : <FiMic />}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* CSS Styling */}
//       <style jsx>{`
//         .helpbot-container {
//           position: fixed;
//           bottom: 20px;
//           right: 20px;
//           z-index: 1000;
//         }

//         .helpbot-button {
//           background: #007bff;
//           color: white;
//           border: none;
//           border-radius: 50%;
//           padding: 12px;
//           cursor: pointer;
//         }

//         .helpbot-popup {
//           width: 300px;
//           height: 400px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .helpbot-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px;
//           background: #f5f5f5;
//           border-bottom: 1px solid #ccc;
//         }

//         .helpbot-messages {
//           flex: 1;
//           padding: 10px;
//           overflow-y: auto;
//         }

//         .user-message {
//           background-color: #007bff;
//           color: white;
//           padding: 8px 12px;
//           border-radius: 16px;
//           margin: 6px 0;
//           align-self: flex-end;
//         }

//         .bot-message {
//           background-color: #e9ecef;
//           padding: 8px 12px;
//           border-radius: 16px;
//           margin: 6px 0;
//           align-self: flex-start;
//         }

//         .helpbot-input {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px;
//           border-top: 1px solid #ccc;
//         }

//         .helpbot-input input {
//           flex: 1;
//           padding: 8px;
//           border-radius: 20px;
//           border: 1px solid #ccc;
//         }

//         .helpbot-input button {
//           background: none;
//           border: none;
//           cursor: pointer;
//           font-size: 18px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HelpBot;
import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiSend, FiMic, FiMicOff, FiX } from "react-icons/fi";

const HelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // API base URL - change this to your FastAPI URL
  const API_URL = "https://irctc-app-thp7.onrender.com";

  const toggleBot = () => setIsOpen(!isOpen);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          fromUser: false, 
          text: "Hello! I'm Jarvis. How can I help you today?" 
        }
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { fromUser: true, text: message };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage("");
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await fetch(`${API_URL}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = { fromUser: false, text: data.text };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Handle special actions
      if (data.action === "openUrl" && data.actionData?.url) {
        window.open(data.actionData.url, "_blank");
      }
    } catch (error) {
      console.error("Error communicating with Jarvis API:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          fromUser: false, 
          text: "Sorry, I encountered an error. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
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
      console.error("Speech recognition error", e);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            <h4>Jarvis AI Assistant</h4>
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
            {isLoading && (
              <div className="bot-message loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="helpbot-input">
            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !message.trim()}>
              <FiSend />
            </button>
            <button onClick={isRecording ? stopVoice : startVoice} disabled={isLoading}>
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .helpbot-button {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          padding: 12px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .helpbot-button:hover {
          transform: scale(1.1);
        }

        .helpbot-popup {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 320px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .helpbot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #007bff;
          color: white;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .helpbot-header h4 {
          margin: 0;
          font-weight: 500;
        }

        .helpbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background-color: #f8f9fa;
        }

        .user-message, .bot-message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          margin: 6px 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .user-message {
          background-color: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .bot-message {
          background-color: white;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .loading {
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #007bff;
          margin: 0 3px;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .helpbot-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #eee;
          background-color: white;
        }

        .helpbot-input input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
          transition: border 0.3s;
        }

        .helpbot-input input:focus {
          border-color: #007bff;
        }

        .helpbot-input button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #007bff;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background-color 0.3s;
        }

        .helpbot-input button:hover {
          background-color: #f0f7ff;
        }

        .helpbot-input button:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default HelpBot;