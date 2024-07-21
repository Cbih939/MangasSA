import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
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
        setChapters(response.data.data);
        if (response.data.data.length > 0) {
          const firstChapterId = response.data.data[0].id;
          setSelectedChapter(firstChapterId);
          navigate(`/manga/${id}/read/${firstChapterId}`);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  const handleChapterChange = (event) => {
    setSelectedChapter(event.target.value);
    navigate(`/manga/${id}/read/${event.target.value}`);
  };

  const handleNextChapter = () => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === selectedChapter);
    if (currentIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentIndex + 1].id;
      setSelectedChapter(nextChapterId);
      navigate(`/manga/${id}/read/${nextChapterId}`);
    }
  };

  const handlePreviousChapter = () => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === selectedChapter);
    if (currentIndex > 0) {
      const previousChapterId = chapters[currentIndex - 1].id;
      setSelectedChapter(previousChapterId);
      navigate(`/manga/${id}/read/${previousChapterId}`);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (chapters.length === 0) {
    return <div>No chapters available.</div>;
  }

  return (
    <div className="manga-read">
      <h1>Capítulos</h1>
      <select value={selectedChapter} onChange={handleChapterChange} className="chapter-select">
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.attributes.title || `Capítulo ${chapter.attributes.chapter}`}
          </option>
        ))}
      </select>
      <div className="navigation-buttons">
        <button onClick={handlePreviousChapter} disabled={chapters.findIndex(chapter => chapter.id === selectedChapter) === 0}>
          Capítulo Anterior
        </button>
        <button onClick={handleNextChapter} disabled={chapters.findIndex(chapter => chapter.id === selectedChapter) === chapters.length - 1}>
          Próximo Capítulo
        </button>
      </div>
      <Routes>
        <Route path=":chapterId" element={<ChapterDetail />} />
      </Routes>
    </div>
  );
};

const ChapterDetail = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`);
        setChapter(response.data.data);

        const pagesResponse = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const baseUrl = pagesResponse.data.baseUrl;
        const pageFiles = pagesResponse.data.chapter.data;
        setPages(pageFiles.map(file => `${baseUrl}/data/${pagesResponse.data.chapter.hash}/${file}`));
      } catch (error) {
        console.error('Error fetching chapter:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!chapter) {
    return <div>Error loading chapter details.</div>;
  }

  return (
    <div className="chapter-detail">
      <h2>{chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`}</h2>
      <div className="chapter-page-container">
        <img
          src={pages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className="chapter-page"
        />
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Página Anterior
        </button>
        <button onClick={handleNextPage} disabled={currentPage === pages.length - 1}>
          Próxima Página
        </button>
      </div>
    </div>
  );
};

export default MangaRead;
