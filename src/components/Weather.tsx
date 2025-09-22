import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useWeather, WeatherCondition } from '@/context/WeatherContext';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiThunderstorm, WiNa } from 'react-icons/wi';

// --- Styled Components (some are updated) ---
const WeatherCard = styled.div`
  padding: 20px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  width: 240px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const IconWrapper = styled.div`
  font-size: 4em;
  color: #e8eaed;
`;

const Details = styled.div`
  text-align: left;
`;

const Temperature = styled.p`
  margin: 0;
  font-size: 2em;
  font-weight: bold;
`;

const Description = styled.p`
  margin: 0;
  text-transform: capitalize;
  font-size: 1.1em;
`;

const LoadingText = styled.p`
  font-size: 1.1em;
  opacity: 0.8;
`;

const SimulatorContainer = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
`;

const SimLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.9em;
  opacity: 0.8;
`;

const SimButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SimButton = styled.button`
  background: none;
  border: 1px solid #8ab4f8;
  color: #8ab4f8;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #8ab4f8;
    color: #202124;
  }
`;

// --- Weather Data & Logic ---
interface WeatherData {
  temp: number;
  description: string;
  icon: React.ReactNode;
  location: string;
}

const mapWeatherCodeToIcon = (code: number): React.ReactNode => {
  if (code >= 200 && code < 300) return <WiThunderstorm />;
  if (code >= 300 && code < 600) return <WiRain />;
  if (code >= 600 && code < 700) return <WiSnow />;
  if (code >= 700 && code < 800) return <WiFog />;
  if (code === 800) return <WiDaySunny />;
  if (code > 800) return <WiCloudy />;
  return <WiNa />;
};

const mapWeatherCodeToCondition = (code: number): WeatherCondition => {
    if (code >= 200 && code < 300) return 'Rainy';
    if (code >= 300 && code < 600) return 'Rainy';
    if (code >= 600 && code < 700) return 'Snowy';
    if (code > 800) return 'Cloudy';
    return 'Sunny'; // Default to Sunny for clear or foggy
};

const Weather = () => {
  const { setWeatherCondition } = useWeather();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lat = 37.566;
    const lon = 126.9784;
    
    const fetchWeather = () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey || apiKey === 'your_api_key_here') {
        setError("API Key not found. Please set it in .env.local");
        return;
      }
      
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          if (data.cod !== 200) {
            throw new Error(data.message);
          }
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: mapWeatherCodeToIcon(data.weather[0].id),
            location: data.name,
          });
          setWeatherCondition(mapWeatherCodeToCondition(data.weather[0].id));
        })
        .catch(err => setError(err.message));
    };

    fetchWeather();
  }, [setWeatherCondition]);

  const renderContent = () => {
    if (error) {
      return <LoadingText>Error: {error}</LoadingText>;
    }
    if (!weather) {
      return <LoadingText>Fetching weather...</LoadingText>;
    }
    return (
      <WeatherInfo>
        <IconWrapper>{weather.icon}</IconWrapper>
        <Details>
          <Temperature>{weather.temp}°C</Temperature>
          <Description>{weather.location}</Description>
        </Details>
      </WeatherInfo>
    );
  };

  return (
    <WeatherCard>
      {renderContent()}
      <SimulatorContainer>
        <SimLabel>Theme Override</SimLabel>
        <SimButtonGroup>
          <SimButton onClick={() => setWeatherCondition('Sunny')}>☀️</SimButton>
          <SimButton onClick={() => setWeatherCondition('Cloudy')}>☁️</SimButton>
          <SimButton onClick={() => setWeatherCondition('Rainy')}>🌧️</SimButton>
          <SimButton onClick={() => setWeatherCondition('Snowy')}>❄️</SimButton>
        </SimButtonGroup>
      </SimulatorContainer>
    </WeatherCard>
  );
};

export default Weather;
