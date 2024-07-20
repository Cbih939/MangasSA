import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MangaDetail.css';

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}`, {
          params: {
            includes: ['cover_art']
          }
        });
        setManga(response.data.data);
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!manga) {
    return <div>Error loading manga details.</div>;
  }

  const getCoverUrl = (manga) => {
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    if (coverArt && coverArt.attributes) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg`;
    }
    return 'default-cover.jpg'; // Imagem de capa padrão caso não exista
  };

  const handleReadClick = () => {
    navigate(`/manga/${manga.id}/read`);
  };

  return (
    <div className="manga-detail">
      <h1>{manga.attributes.title.en || manga.attributes.title['pt-br']}</h1>
      <img src={getCoverUrl(manga)} alt={manga.attributes.title.en || manga.attributes.title['pt-br']} />
      <p>{manga.attributes.description.en || manga.attributes.description['pt-br']}</p>
      <button type="button" onClick={handleReadClick}>
        Iniciar Leitura
      </button>
    </div>
  );
};

export default MangaDetail;
