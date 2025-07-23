import { useState } from "react";
import Lottie from "lottie-react";
import chathome from "../../public/chathome.json";

export default function ChatbotAnimation() {
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleClick = () => {
    if (hasSpoken) return;

    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(
      "Hi, I am your chatbot. How can I help you today?"
    );
    utterance.lang = "en-US";
    utterance.voice = voices.find((v) => v.lang === "en-US") || null;
    utterance.rate = 1;
    window.speechSynthesis.cancel(); // clear any previous speech
    window.speechSynthesis.speak(utterance);

    setHasSpoken(true);
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-full bg-white cursor-pointer"
      onClick={handleClick}
    >
      <Lottie animationData={chathome} loop={false} className="w-80 h-80" />
      {!hasSpoken && (
        <div className="absolute bottom-10 text-gray-500 text-sm animate-pulse">
          {/* Tap anywhere to activate voice */}
        </div>
      )}
    </div>
  );
}
