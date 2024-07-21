import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Mangas from './pages/Mangas';
import MangaDetail from './pages/MangaDetail';
import MangaRead from './pages/MangaRead';
import Lancamentos from './pages/Lancamentos';
import Titulos from './pages/Titulos';
import MaisLidos from './pages/MaisLidos';
import Atualizacoes from './pages/Atualizacoes';
import Categoria from './pages/Categoria'; // Importe o componente Categoria
import Sidebar from './components/Sidebar';
import Footer from './components/Footer'; // Importe o Footer
import './App.css';

function App() {
  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (event.deltaY < 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

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
            <Route path="/categoria/:categoryId" element={<Categoria />} /> {/* Adicione a nova rota */}
          </Routes>
        </div>
        <Footer /> {/* Adicione o Footer aqui */}
      </div>
    </Router>
  );
}

export default App;
