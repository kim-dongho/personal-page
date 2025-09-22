import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useWeather } from '@/context/WeatherContext';

const fall = keyframes`
  0% {
    transform: translateY(-10vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 1;
  }
`;

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; // Above the background overlay, but below modals
`;

const Raindrop = styled.div`
  position: absolute;
  bottom: 100%;
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
  animation: ${fall} 0.5s linear infinite;
`;

const Snowflake = styled.div`
  position: absolute;
  top: -10%;
  background-color: #fff; // White color
  border-radius: 50%; // Make it a circle
  width: 4px; // Small size
  height: 4px; // Small size
  animation: ${fall} 10s linear infinite;
`;

const Rain = () => {
  const items = Array.from({ length: 100 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${0.2 + Math.random() * 0.3}s`,
    };
    return <Raindrop key={i} style={style} />;
  });
  return <ParticleContainer>{items}</ParticleContainer>;
};

const Snow = () => {
  const items = Array.from({ length: 100 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      fontSize: `${0.5 + Math.random() * 1.5}em`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${5 + Math.random() * 5}s`,
      opacity: Math.random(),
    };
    return <Snowflake key={i} style={style} />;
  });
  return <ParticleContainer>{items}</ParticleContainer>;
};


const WeatherAnimation = () => {
  const { weatherCondition } = useWeather();

  switch (weatherCondition) {
    case 'Rainy':
      return <Rain />;
    case 'Snowy':
      return <Snow />;
    default:
      return null;
  }
};

export default WeatherAnimation;
