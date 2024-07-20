import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <NavLink to="/" exact="true" activeclassname="active">
        Início
      </NavLink>
      <NavLink to="/mangas" activeclassname="active">
        Mangás
      </NavLink>
      <NavLink to="/lancamentos" activeclassname="active">
        Lançamentos
      </NavLink>
      <NavLink to="/titulos" activeclassname="active">
        Títulos
      </NavLink>
      <NavLink to="/mais-lidos" activeclassname="active">
        Mais Lidos
      </NavLink>
      <NavLink to="/atualizacoes" activeclassname="active">
        Atualizações
      </NavLink>
    </nav>
  );
};

export default Sidebar;
