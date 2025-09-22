import { createContext, useState, useContext, ReactNode } from 'react';

export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Default';

interface WeatherContextType {
  weatherCondition: WeatherCondition;
  setWeatherCondition: (condition: WeatherCondition) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('Rainy');

  return (
    <WeatherContext.Provider value={{ weatherCondition, setWeatherCondition }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
