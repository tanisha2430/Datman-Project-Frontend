import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";

interface LottieCardProps {
  title: string;
  subtitle: string;
  animationPath: string;
}

const LottieCard = ({ title, animationPath }: LottieCardProps) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(animationPath)
      .then((res) => res.json())
      .then(setAnimationData);
  }, [animationPath]);

  return (
    <div className="bg-black rounded-lg p-6 flex flex-col justify-between items-center h-80 text-center">
      {animationData && (
        <Lottie loop play animationData={animationData} className="h-48 mb-4" />
      )}
      <h2 className="text-2xl border p-2 font-semibold text-white mb-1">{title}</h2>
      {/* <p className="text-sm  text-gray-400">{subtitle}</p> */}
    </div>
  );
};

export default LottieCard;
