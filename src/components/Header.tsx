import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.png';

// Definición de tipos para las props
interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

// Estilos con styled-components
const HeaderContainer = styled.header<{ visible: boolean; scrolled: boolean }>`
  background: linear-gradient(rgb(142, 24, 24), rgb(191, 36, 36));
  color: rgb(4, 4, 4);
  padding: 1.5rem 0;
  text-align: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  transform: translateY(${({ visible }) => visible ? '0' : '-100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: ${({ scrolled }) => 
    scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.1)'
  };
  backdrop-filter: ${({ scrolled }) => scrolled ? 'blur(8px)' : 'none'};
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
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin: 0;
  transition: opacity 0.2s ease;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  transition: opacity 0.2s ease;
`;

const Header: React.FC<HeaderProps> = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;
      
      setScrolled(currentScrollY > 50);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      if (currentScrollY <= 100) {
        setVisible(true);
      } else if (scrollDifference < -5) {
        setVisible(true);
      } else if (scrollDifference > 10 && currentScrollY > 200) {
        setVisible(false);
      }

      scrollTimeout.current = setTimeout(() => {
        lastScrollY.current = currentScrollY;
      }, 10);
    };

    let rafId: number;
    const throttledHandleScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <HeaderContainer visible={visible} scrolled={scrolled}>
      <Container>
        <LogoContainer>
          <UniversityLogo 
            src={Logo} 
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