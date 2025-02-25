import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import './styles/mainStyle.css'
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
