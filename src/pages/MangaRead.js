import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ChapterDetail from './ChapterDetail';
import './MangaRead.css';

// Componente principal para exibir os capítulos de um mangá
const MangaRead = () => {
  const { id } = useParams(); // Obtém o ID do mangá da URL
  const navigate = useNavigate(); // Função para navegação entre páginas
  const [chapters, setChapters] = useState([]); // Estado para armazenar a lista de capítulos
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [selectedChapter, setSelectedChapter] = useState(''); // Estado para armazenar o capítulo selecionado

  // Função para buscar os capítulos do mangá
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Solicita a lista de capítulos do mangá
        const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
          params: {
            translatedLanguage: ['pt-br'], // Filtra capítulos traduzidos para português
            limit: 100, // Limita o número de capítulos retornados
            order: {
              chapter: 'asc' // Ordena os capítulos em ordem crescente
            }
          }
        });
        const fetchedChapters = response.data.data;
        setChapters(fetchedChapters); // Armazena os capítulos no estado

        // Obtém o ID do último capítulo lido do armazenamento local
        const lastReadChapterId = localStorage.getItem(`lastReadChapter-${id}`);
        const initialChapterId = lastReadChapterId || (fetchedChapters.length > 0 ? fetchedChapters[0].id : '');

        // Define o capítulo inicial a ser exibido
        if (initialChapterId) {
          setSelectedChapter(initialChapterId);
          navigate(`/manga/${id}/read/${initialChapterId}`);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error); // Exibe erro caso a solicitação falhe
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchChapters();
  }, [id, navigate]); // Reexecuta quando o ID do mangá ou a função de navegação muda

  // Manipula a mudança de seleção do capítulo
  const handleChapterChange = (event) => {
    const selectedChapterId = event.target.value;
    setSelectedChapter(selectedChapterId); // Atualiza o capítulo selecionado
    localStorage.setItem(`lastReadChapter-${id}`, selectedChapterId); // Armazena o capítulo selecionado no armazenamento local
    navigate(`/manga/${id}/read/${selectedChapterId}`); // Navega para o capítulo selecionado
  };

  // Exibe mensagem de carregamento enquanto os dados estão sendo obtidos
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Exibe mensagem se não houver capítulos disponíveis
  if (chapters.length === 0) {
    return <div>Não há capítulos disponíveis.</div>;
  }

  return (
    <div className="manga-read">
      <h1 id="header">Capítulos</h1>
      <select value={selectedChapter} onChange={handleChapterChange} className="chapter-select">
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.attributes.title || `Capítulo ${chapter.attributes.chapter}`}
          </option>
        ))}
      </select>
      <Routes>
        <Route path=":chapterId" element={<ChapterDetail chapters={chapters} id={id} setSelectedChapter={setSelectedChapter} />} />
      </Routes>
    </div>
  );
};

export default MangaRead;
