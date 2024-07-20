import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Header from '../components/Header';

const Home = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [latestReleases, setLatestReleases] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [loadingReleases, setLoadingReleases] = useState(true);
  const [currentPageUpdates, setCurrentPageUpdates] = useState(1);
  const [currentPageReleases, setCurrentPageReleases] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchMangas = async (page, setPage, setLoading, order) => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            includes: ['cover_art'],
            availableTranslatedLanguage: ['pt-br'],
            order
          }
        });

        setPage(response.data.data);
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas(currentPageUpdates, setLatestUpdates, setLoadingUpdates, { updatedAt: 'desc' });
  }, [currentPageUpdates]);

  useEffect(() => {
    const fetchMangas = async (page, setPage, setLoading, order) => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
            includes: ['cover_art'],
            availableTranslatedLanguage: ['pt-br'],
            order
          }
        });

        setPage(response.data.data);
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas(currentPageReleases, setLatestReleases, setLoadingReleases, { createdAt: 'desc' });
  }, [currentPageReleases]);

  const getCoverUrl = (manga) => {
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    if (coverArt && coverArt.attributes) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg`;
    }
    return 'default-cover.jpg';
  };

  const getMangaTitle = (manga) => {
    return manga.attributes.title['pt-br'] || manga.attributes.title.en || 'Título não disponível';
  };

  const getMangaDescription = (manga) => {
    return manga.attributes.description['pt-br'] || manga.attributes.description.en || 'Descrição não disponível';
  };

  const truncateText = (text, limit) => {
    if (!text) return ''; // Verifica se o texto é válido
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  const handlePageChange = (setPage, newPage) => {
    setPage(newPage);
  };

  const handleReadClick = (mangaId) => {
    navigate(`/manga/${mangaId}/read`);
  };

  return (
    <div className="home">
      <Header />
      <div className="manga-container">
        <h2>Últimas Atualizações</h2>
        {loadingUpdates ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="manga-list">
              {latestUpdates.map((manga) => (
                <div key={manga.id} className="manga-card">
                  <div className="manga-card-inner">
                    <div className="manga-card-front">
                      <img src={getCoverUrl(manga)} alt={getMangaTitle(manga)} />
                    </div>
                    <div className="manga-card-back">
                      <h3>{getMangaTitle(manga)}</h3>
                      <p>{truncateText(getMangaDescription(manga), 150)}</p>
                      <button type="button" onClick={() => handleReadClick(manga.id)}>Ler</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button disabled={currentPageUpdates === 1} onClick={() => handlePageChange(setCurrentPageUpdates, currentPageUpdates - 1)}>Anterior</button>
              <span>Página {currentPageUpdates}</span>
              <button onClick={() => handlePageChange(setCurrentPageUpdates, currentPageUpdates + 1)}>Próximo</button>
            </div>
          </div>
        )}
        <h2>Últimos Lançamentos</h2>
        {loadingReleases ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="manga-list">
              {latestReleases.map((manga) => (
                <div key={manga.id} className="manga-card">
                  <div className="manga-card-inner">
                    <div className="manga-card-front">
                      <img src={getCoverUrl(manga)} alt={getMangaTitle(manga)} />
                    </div>
                    <div className="manga-card-back">
                      <h3>{getMangaTitle(manga)}</h3>
                      <p>{truncateText(getMangaDescription(manga), 150)}</p>
                      <button type="button" onClick={() => handleReadClick(manga.id)}>Ler</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button disabled={currentPageReleases === 1} onClick={() => handlePageChange(setCurrentPageReleases, currentPageReleases - 1)}>Anterior</button>
              <span>Página {currentPageReleases}</span>
              <button onClick={() => handlePageChange(setCurrentPageReleases, currentPageReleases + 1)}>Próximo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
