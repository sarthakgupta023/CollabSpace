import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateWorkspace from './pages/CreateWorkspace.jsx';
import JoinWorkspace from './pages/JoinWorkspace.jsx';
import Editor from './pages/Editor.jsx';
import History from './pages/History.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateWorkspace />} />
      <Route path="/join" element={<JoinWorkspace />} />
      <Route path="/w/:workspaceId" element={<Editor />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}
