import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Definición de tipos para las props
interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

// Estilos con styled-components
const HeaderContainer = styled.header<{ hidden: boolean }>`
  background: linear-gradient(rgb(156, 16, 16),rgb(177, 26, 26));
  color: rgb(4, 4, 4);
  padding: 1.5rem 0;
  text-align: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ hidden }) => hidden ? 'translateY(-100%)' : 'translateY(0)'};
  z-index: 1000;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const UniversityLogo = styled.img`
  width: 170px;
  height: 90px;
  margin-right: 15px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
`;

const Header: React.FC<HeaderProps> = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <HeaderContainer hidden={hidden}>
      <Container>
        <LogoContainer>
          <UniversityLogo 
            src="public/logo.png" 
            alt="Logo ECI" 
          />
          <div>
            <Title>Reserva de salas y elementos recreativos</Title>
            <Subtitle>Escuela Colombiana de Ingeniería Julio Garavito</Subtitle>
          </div>
        </LogoContainer>
      </Container>
    </HeaderContainer>
  );
};

export default Header;