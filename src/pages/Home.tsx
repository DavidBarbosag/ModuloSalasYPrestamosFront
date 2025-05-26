import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ImageTresEstudiantes from '../assets/Tres-estudiantes-de-matematicas-trabajando.jpg';
import UbicacionIcon from '../assets/ubicacion.png';
import RelojIcon from '../assets/reloj.png';
import PersonaIcon from '../assets/personas.png';
import LibroIcon from '../assets/libro.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Contenedores y estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-top: 120px;
  padding-bottom: 100px;
`;

const CardFeatures = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
`;

const FeatureItem = styled.li`
  background-color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1f2937;
  font-size: 0.95rem;
`;

const FeatureIcon = styled.img`
  background-color: white;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const Section1 = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 4rem 2rem;
  background-color: #ffe4e6;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Section1Text = styled.div`
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title1 = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
`;

const Paragraph1 = styled.p`
  color: #4b5563;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ButtonPrimary = styled.button`
  background-color: #b91c1c;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
`;

const ButtonSecondary = styled.button`
  background-color: white;
  color: #1a202c;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  margin-top: 2.5rem;

  @media (min-width: 768px) {
    width: 50%;
    margin-top: 0;
  }
`;

const Section2 = styled.section`
  background-color: white;
  padding: 4rem 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const Title2 = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: white;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 350px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const CardButton = styled.button`
  background-color: #b91c1c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7f1d1d;
  }
`;


const Home = () => {

  return (
    <>
      <Header />
        <Container>
          {/* Sección 1 */}
          <Section1>
            <Section1Text>
              <Title1>Gestión de Salas y Elementos Recreativos</Title1>
              <Paragraph1>
                Reserva salas de descanso y elementos recreativos de manera fácil y rápida.
              </Paragraph1>
              <ButtonGroup>
                <Link to="/rooms/reserve">
                  <ButtonPrimary>Reservar Ahora</ButtonPrimary>
                </Link>
                <Link to="/availability">
                  <ButtonSecondary>Ver Disponibilidad</ButtonSecondary>
                </Link>
                <Link to="/register">
                  <ButtonSecondary>Devoluciones</ButtonSecondary>
                </Link>
              </ButtonGroup>
            </Section1Text>
            <Image src={ImageTresEstudiantes} alt="Personas compartiendo" />
          </Section1>

      {/* Sección 2 */}
      <Section2>
        <Title2>Servicios Disponibles</Title2>
        <CardsContainer>
          <Card>
            <CardTitle>Reserva de Salas</CardTitle>
            <CardDescription>
              Espacios para descanso y recreación como alguna descripción.
            </CardDescription>
            <CardFeatures>
              <FeatureItem>
                <FeatureIcon src={UbicacionIcon} alt="Ubicación" />
                Múltiples ubicaciones en el campus
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon src={RelojIcon} alt="Horario" />
                Horarios flexibles
              </FeatureItem>
            </CardFeatures>
            <Link to="/rooms/reserve">
              <CardButton>Reservar Sala</CardButton>
            </Link>
          </Card>

          <Card>
            <CardTitle>Préstamo de Elementos</CardTitle>
            <CardDescription>
              Juegos de mesa y equipos recreativos
            </CardDescription>
            <CardFeatures>
              <FeatureItem>
                <FeatureIcon src={LibroIcon} alt="libro" />
                Amplio catálogo disponible
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon src={PersonaIcon} alt="personicon" />
                Para uso individual o grupal
              </FeatureItem>
            </CardFeatures>
            <Link to="/elements/reserve">
              <CardButton>Ver Elementos</CardButton>
            </Link>
          </Card>

          <Card>
            <CardTitle>Mis Reservas</CardTitle>
            <CardDescription>
              Accede a tus reservas
            </CardDescription>
            <Link to="/user/reservations">
              <CardButton>Ver reservas</CardButton>
            </Link>
          </Card>
        </CardsContainer>
      </Section2>
    </Container>
    <Footer />
    </>
  );
};

export default Home;
