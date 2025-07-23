import { Link } from "react-router-dom";
import LottieCard from "./LottieCard";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="mb-4 inline-flex flex-col items-center gap-2">
          <div className="bg-white/10 px-4 py-1.5 text-sm text-blue-400 mt-4 rounded-full">
            Introducing DatLings
          </div>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 object-contain mt-5 mb-5"
          />
        </div>

        <h1 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-10">
          We’ve Just Joined In, <br />
          <span className="text-blue-400">
            But We’re All In to Make It Better
          </span>
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Link to="/kdfs">
          <LottieCard
            title="MyKount aka DFS"
            subtitle="Design with a Global Perspective, Innovate with Ease."
            animationPath="/kdfs.json"
          />
        </Link>
        <Link to="/datbot">
          <LottieCard
            title="DatBot for Support Team"
            subtitle="Bringing energy and speed to what matters most."
            animationPath="/chat.json"
          />
        </Link>
      </div>

      {/* footer */}
      <footer className="text-center text-sm text-gray-400 mt-16">
        © {new Date().getFullYear()} DatLings - Tanisha Saxena, Harsh Saxena.
        All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
