import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MangaRead.css';

const ChapterDetail = ({ chapters, id, setSelectedChapter }) => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getNextChapter = () => {
    const currentIndex = chapters.findIndex(chap => chap.id === chapterId);
    const nextChapter = chapters[currentIndex + 1];
    return nextChapter ? nextChapter.id : null;
  };

  const getPreviousChapter = () => {
    const currentIndex = chapters.findIndex(chap => chap.id === chapterId);
    const previousChapter = chapters[currentIndex - 1];
    return previousChapter ? previousChapter.id : null;
  };

  const handlePreviousChapter = () => {
    const previousChapterId = getPreviousChapter();
    if (previousChapterId) {
      navigate(`/manga/${id}/read/${previousChapterId}`);
      setSelectedChapter(previousChapterId);
      localStorage.setItem(`lastReadChapter-${id}`, previousChapterId);
      document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextChapter = () => {
    const nextChapterId = getNextChapter();
    if (nextChapterId) {
      navigate(`/manga/${id}/read/${nextChapterId}`);
      setSelectedChapter(nextChapterId);
      localStorage.setItem(`lastReadChapter-${id}`, nextChapterId);
      document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
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
      <div className="chapter-pages">
        {pages.map((page, index) => (
          <img
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            className="chapter-page"
          />
        ))}
      </div>
      <div className='button-container'>
        <button
          onClick={handlePreviousChapter}
          disabled={!getPreviousChapter()}
          className="chapter-button"
        >
          Capítulo Anterior
        </button>

        <button
          onClick={handleNextChapter}
          disabled={!getNextChapter()}
          className="chapter-button"
        >
          Próximo Capítulo
        </button>
      </div>
    </div>
  );
};

export default ChapterDetail;