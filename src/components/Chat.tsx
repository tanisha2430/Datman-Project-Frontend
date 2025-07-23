import { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import ChatbotAnimation from "./ChatbotAnimation";
import { FiVolume2, FiSquare } from "react-icons/fi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // basic styling
import "tippy.js/animations/shift-away.css"; // animation

type Message = {
  role: "user" | "assistant";
  content: string;
  type?: "transaction_found" | string; // add other custom types as needed
  payload?: {
    source: string;
    orderId: string;
    date: string;
    gross: string;
    fee: string;
    net: string;
  };
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState<number | null>(null);
  const [raisedComplaints, setRaisedComplaints] = useState<Set<string>>(
    new Set()
  );

  //  useEffect(() => {
  //    const timer = setTimeout(() => {
  //      setShowIntro(false);
  //    }, 3000);
  //    return () => clearTimeout(timer);
  //  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);

      // Typing animation for initial message
      const introText = "Hi, how can I help you?";
      let index = 0;
      const interval = setInterval(() => {
        setMessages((prev) => {
          const currentText = introText.slice(0, index + 1);
          const updatedMessage: Message = {
            role: "assistant",
            content: currentText,
          };

          // Only keep this as the first assistant message
          if (prev.length === 0 || prev[0].role !== "assistant") {
            return [updatedMessage];
          } else {
            return [updatedMessage, ...prev.slice(1)];
          }
        });

        index++;
        if (index >= introText.length) clearInterval(interval);
      }, 50); // adjust typing speed here
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const speak = (text: string, index: number) => {
    if (window.speechSynthesis.speaking && speakingMsgIndex === index) {
      // If already speaking this message, stop it
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
    } else {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;

      utterance.onend = () => setSpeakingMsgIndex(null); // reset when done

      window.speechSynthesis.speak(utterance);
      setSpeakingMsgIndex(index);
    }
  };

  const handleRaiseComplaint = (orderId: string) => {
    if (raisedComplaints.has(orderId)) {
      alert("✅ You already raised a complaint for this transaction.");
      return;
    }

    // Trigger your complaint logic here (API call etc.)
    // Then update the state
    setRaisedComplaints((prev) => new Set(prev).add(orderId));
    alert("🚨 Complaint raised successfully!");
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // const markdownContent = await marked.parse(data.answer || "...");

      // const botMessage: Message = {
      //   role: "assistant",
      //   content: markdownContent,
      // };
      const isStructured =
        typeof data.answer === "object" &&
        data.answer.type === "transaction_found";

      const botMessage: Message = isStructured
        ? {
            role: "assistant",
            content: "", // not used in structured messages
            type: "transaction_found",
            payload: data.answer,
          }
        : {
            role: "assistant",
            content: await marked.parse(data.answer || "..."),
          };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const fallback = await marked.parse("❌ Error contacting assistant");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallback },
      ]);
    }

    setLoading(false);
  };

  if (showIntro) return <ChatbotAnimation />;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

    <div className="flex flex-col w-[50%] h-screen bg-gray-50">
      {/* Optional header */}
      <div className="text-center p-4 font-semibold text-xl bg-white shadow">
        DatBot Support{" "}
      </div>

      {/* Scrollable chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {/* {messages.map((msg, i) => (
          
          <div
            key={i}
            className={`p-2 rounded-md max-w-xs ${
              msg.role === "user"
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-gray-200 text-left"
            }`}

            
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />

            {msg.role === "assistant" && (
              <div className="flex justify-end mt-1">
                <Tippy
                  content={speakingMsgIndex === i ? "Stop" : "Read aloud"}
                  animation="shift-away"
                  duration={200}
                >
                  <button
                    onClick={() => speak(msg.content, i)}
                    className="mt-1 text-gray-600 hover:text-blue-600 transition-all"
                    title={speakingMsgIndex === i ? "Stop" : "Read aloud"}
                  >
                    {speakingMsgIndex === i ? (
                      <FiSquare className="w-4 h-4" />
                    ) : (
                      <FiVolume2 className="w-4 h-4" />
                    )}
                  </button>
                </Tippy>
              </div>
            )}
          </div>
          
        ))} */}
        {messages.map((msg, i) => {
          const isAssistant = msg.role === "assistant";
          const isTransaction =
            msg.type === "transaction_found" && !!msg.payload;

          return (
            <div key={i}>
              <div
                className={`p-2 rounded-md max-w-xs ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-gray-200 text-left"
                }`}
              >
                {!isTransaction ? (
                  <>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />

                    {isAssistant && (
                      <div className="flex justify-end mt-1">
                        <Tippy
                          content={
                            speakingMsgIndex === i ? "Stop" : "Read aloud"
                          }
                          animation="shift-away"
                          duration={200}
                        >
                          <button
                            onClick={() => speak(msg.content, i)}
                            className="mt-1 text-gray-600 hover:text-blue-600 transition-all"
                            title={
                              speakingMsgIndex === i ? "Stop" : "Read aloud"
                            }
                          >
                            {speakingMsgIndex === i ? (
                              <FiSquare className="w-4 h-4" />
                            ) : (
                              <FiVolume2 className="w-4 h-4" />
                            )}
                          </button>
                        </Tippy>
                      </div>
                    )}
                  </>
                ) : (
                  // ✅ Safe payload destructuring after type check
                  <div className="bg-white p-4 rounded-lg text-left space-y-2">
                    {(() => {
                      const payload = msg.payload!;
                      return (
                        <>
                          <p>
                            ✅ Found transaction from{" "}
                            <strong>{payload.source}</strong> for Order ID{" "}
                            <strong>{payload.orderId}</strong>
                          </p>
                          <p>📅 Date: {payload.date}</p>
                          <p>
                            💰 Gross: ₹{payload.gross} • Fee: ₹{payload.fee} •
                            Net: ₹{payload.net}
                          </p>
                          <p>If this was unauthorized, click below:</p>
                          <button
                            onClick={() =>
                              handleRaiseComplaint(payload.orderId)
                            }
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Raise Complaint
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="italic text-gray-500">Assistant is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input area */}
      <div className="p-4 border-t bg-white sticky bottom-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
}
