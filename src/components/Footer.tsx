import { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer<{ show: boolean }>`
  background: rgb(188, 47, 47);
  color: rgb(4, 4, 4);
  padding: 1.5rem 0;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 40px;
  bottom: 0;
  left: 0;
  transform: translateY(${({ show }) => (show ? '0' : '100%')});
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const FooterContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const threshold = 20;

      setShowFooter(scrollPosition > pageHeight - threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledFooter show={showFooter}>
      <FooterContainer>
        <p>&copy; 2025 Sistema de Reserva de Laboratorios - Escuela Colombiana de Ingeniería Julio Garavito</p>
      </FooterContainer>
    </StyledFooter>
  );
}

export default Footer;