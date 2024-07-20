import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ChapterDetail from './ChapterDetail';
import './MangaRead.css';

const MangaRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState('');


  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
          params: {
            translatedLanguage: ['pt-br'],
            limit: 100,
            order: {
              chapter: 'asc'
            }
          }
        });
        const fetchedChapters = response.data.data;
        setChapters(response.data.data);

        const lastReadChapterId = localStorage.getItem(`lastReadChapter-${id}`);
        const initialChapterId = lastReadChapterId || (fetchedChapters.length > 0 ? fetchedChapters[0].id : '');

        if (initialChapterId) {
          setSelectedChapter(initialChapterId);
          navigate(`/manga/${id}/read/${initialChapterId}`);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id, navigate]);


  const handleChapterChange = (event) => {
    const selectedChapterId = event.target.value;
    setSelectedChapter(selectedChapterId);
    localStorage.setItem(`lastReadChapter-${id}`, selectedChapterId);
    navigate(`/manga/${id}/read/${selectedChapterId}`);

  };


  if (loading) {
    return <div>Carregando...</div>;
  }

  if (chapters.length === 0) {
    return <div>No chapters available.</div>;
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
