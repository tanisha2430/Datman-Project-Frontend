

import { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import ChatbotAnimation from "./ChatbotAnimation";
import { FiVolume2, FiSquare } from "react-icons/fi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  type?: "transaction_found" | string;
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      const introText = "Hi, how can I help you?";
      let index = 0;
      const interval = setInterval(() => {
        setMessages((prev) => {
          const currentText = introText.slice(0, index + 1);
          const updatedMessage: Message = {
            role: "assistant",
            content: currentText,
          };
          if (prev.length === 0 || prev[0].role !== "assistant") {
            return [updatedMessage];
          } else {
            return [updatedMessage, ...prev.slice(1)];
          }
        });
        index++;
        if (index >= introText.length) clearInterval(interval);
      }, 50);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const speak = (text: string, index: number) => {
    if (window.speechSynthesis.speaking && speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.onend = () => setSpeakingMsgIndex(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingMsgIndex(index);
    }
  };

  const handleRaiseComplaint = (orderId: string) => {
    if (raisedComplaints.has(orderId)) {
      alert("✅ You already raised a complaint for this transaction.");
      return;
    }
    setRaisedComplaints((prev) => new Set(prev).add(orderId));
    alert("🚨 Complaint raised successfully!");
  };

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
      // const res = await fetch("https://datman-support-chatbot.netlify.app/.netlify/functions/chat", {
      // const res = await fetch("http://localhost:4000/dev/chat", {
      const res = await fetch(
        "https://gentle-manifestation-production-b42c.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      const isStructured =
        typeof data.answer === "object" &&
        data.answer.type === "transaction_found";

      const botMessage: Message = isStructured
        ? {
            role: "assistant",
            content: "",
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
  

    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-2 font-sans text-slate-800">
      <div className="flex flex-col w-full max-w-3xl h-full bg-white rounded-xl shadow-lg border border-slate-900">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 font-semibold text-2xl bg-gradient-to-r from-sky-100 to-emerald-100 text-slate-700 shadow-sm rounded-t-xl">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <span>DatBot Support</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
          {messages.map((msg, i) => {
            const isAssistant = msg.role === "assistant";
            const isTransaction =
              msg.type === "transaction_found" && !!msg.payload;

            return (
              <div key={i}>
                <div
                  className={`p-4 rounded-xl text-sm sm:text-base transition-all ease-in-out duration-150 ${
                    msg.role === "user"
                      ? "ml-auto bg-sky-100 text-right shadow"
                      : "mr-auto bg-zinc-100 text-left shadow-sm"
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
                              className="text-slate-500 hover:text-sky-600 transition-all"
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
                    <div className="bg-white border border-emerald-200 p-4 rounded-xl space-y-2 shadow-sm">
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
                              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all"
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
            <div className="italic text-gray-400 animate-pulse">
              Assistant is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white flex gap-2 flex-wrap sm:flex-nowrap sticky bottom-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Please let me know your concerns..."
            className="flex-1 border border-slate-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 shadow-md transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
