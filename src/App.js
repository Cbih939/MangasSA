import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Mangas from './pages/Mangas';
import MangaDetail from './pages/MangaDetail';
import MangaRead from './pages/MangaRead';
import Lancamentos from './pages/Lancamentos';
import Titulos from './pages/Titulos';
import MaisLidos from './pages/MaisLidos';
import Atualizacoes from './pages/Atualizacoes';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mangas" element={<Mangas />} />
            <Route path="/manga/:id" element={<MangaDetail />} />
            <Route path="/manga/:id/read/*" element={<MangaRead />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/titulos" element={<Titulos />} />
            <Route path="/mais-lidos" element={<MaisLidos />} />
            <Route path="/atualizacoes" element={<Atualizacoes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
