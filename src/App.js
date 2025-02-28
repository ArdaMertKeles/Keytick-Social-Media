import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import './styles/mainStyle.css'
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:profileId" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
