import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

type LottieLoaderProps = {
  layer: 1 | 2 | 3;
  className?: string;
};

const getAnimationPath = () => {
      return "/Loading Dots Blue.json";
};

const LottieLoader: React.FC<LottieLoaderProps> = ({className}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      const res = await fetch(getAnimationPath());
      const json = await res.json();
      setAnimationData(json);
    };

    loadAnimation();
  }, []);

  if (!animationData) return <div className="text-gray-400">Loading...</div>;

  return (
    <Lottie
      animationData={animationData}
      loop
      className={className || "w-24 h-24"}
    />
  );
};

export default LottieLoader;







// import React, { useEffect, useState } from "react";
// import Lottie from "lottie-react";

// type LottieLoaderProps = {
//   layer: 1 | 2 | 3 | 4 | 5;
//   className?: string;
// };

// const getAnimationPath = (layer: number): string => {
//   switch (layer) {
//     case 1:
//       return "/AI animation.json";
//     case 2:
//       return "/Transaction process.json";
//     case 3:
//       return "/AI animation.json";
//     case 4:
//       return "/loaders/Robot-thinking.json";
//     case 5:
//       return "/AI animation.json";
//     default:
//       return "/Loading Dots Blue.json";
//   }
// };

// const LottieLoader: React.FC<LottieLoaderProps> = ({ layer, className }) => {
//   const [animationData, setAnimationData] = useState<any>(null);

//   useEffect(() => {
//     const loadAnimation = async () => {
//       try {
//         const res = await fetch(getAnimationPath(layer));
//         const json = await res.json();
//         setAnimationData(json);
//       } catch (err) {
//         console.error("Failed to load Lottie animation:", err);
//       }
//     };

//     loadAnimation();
//   }, [layer]);

//   if (!animationData)
//     return <div className="text-gray-400">Loading animation...</div>;

//   return (
//     <Lottie
//       animationData={animationData}
//       loop
//       className={className || "w-24 h-24"}
//     />
//   );
// };

// export default LottieLoader;
