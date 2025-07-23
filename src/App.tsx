import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Kdfs from "./components/Kdfs";
import Chat from "./components/Chat";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kdfs" element={<Kdfs />} />
      <Route path="/datbot" element={<Chat />} />
    </Routes>
  );
};

export default App;
