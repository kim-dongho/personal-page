import Head from 'next/head';
import styled from '@emotion/styled';
import { useWeather, WeatherCondition } from '@/context/WeatherContext';
import SearchBar from '@/components/SearchBar';
import TodoList from '@/components/TodoList';
import Weather from '@/components/Weather';
import Shortcuts from '@/components/Shortcuts';
import WeatherAnimation from '@/components/WeatherAnimation';
import Clock from '@/components/Clock';

// --- Dynamic Background Images ---
// To add your own images, find a direct image URL and paste it here.
// Good sites for images are Pexels (https://www.pexels.com) and Unsplash (https://unsplash.com).
// To get the URL, right-click the image and select "Copy Image Address".
const backgrounds: Record<WeatherCondition, string> = {
  Default: 'https://images.unsplash.com/photo-1572966101025-e199cab72196?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  Sunny: 'https://images.unsplash.com/photo-1534030665069-90e016e995e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  Cloudy: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  Rainy: 'https://images.unsplash.com/photo-1721959524958-af4048aa81b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  Snowy: 'https://images.unsplash.com/photo-1671485928775-6d5fee2d6f29?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const PageContainer = styled.div<{ weather: WeatherCondition }>`
  position: relative;
  min-height: 100vh;
  background-image: url(${props => backgrounds[props.weather]});
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
`;

const MainContainer = styled.main`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
`;

const WidgetsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 40px;
  width: 100%;
  max-width: 900px;
`;

const HomePage = () => {
  const { weatherCondition } = useWeather();

  return (
    <PageContainer weather={weatherCondition}>
      <WeatherAnimation />
      <Head>
        <title>Awesome Dashboard</title>
        <meta name="description" content="A personalized dashboard with search, todos, and weather." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <Clock />
        <SearchBar />
        <Shortcuts />
        <WidgetsContainer>
          <TodoList />
          <Weather />
        </WidgetsContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default HomePage;
