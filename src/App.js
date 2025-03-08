import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import './styles/mainStyle.css'
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { FriendsPage } from "./pages/FriendsPage";
import { CreatePage } from "./pages/CreatePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { FaqPage } from "./pages/FaqPage";
import { ChatPage } from "./pages/ChatPage";
import { SearchPage } from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:profileId" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/search/:searchTerm" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
