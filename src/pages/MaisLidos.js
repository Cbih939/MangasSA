import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MaisLidos.css';

const MaisLidos = () => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 24;

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            includes: ['cover_art'],
            availableTranslatedLanguage: ['pt-br'],
            order: {
              follows: 'desc' // Ordenar pelos mais seguidos (mais lidos)
            }
          }
        });

        setMangas(response.data.data);
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [currentPage]);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleReadClick = (mangaId) => {
    navigate(`/manga/${mangaId}/read`);
  };

  return (
    <div className="mais-lidos">
      <h2>Mais Lidos</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="manga-list">
            {mangas.map((manga) => (
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
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
            <span>Página {currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)}>Próximo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaisLidos;
