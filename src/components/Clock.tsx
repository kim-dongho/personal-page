import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

// --- Styled Components ---
const ClockContainer = styled.div`
  text-align: center;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
`;

const TimeDisplay = styled.h1`
  font-size: 6rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 2px;
`;

const DateDisplay = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
  opacity: 0.9;
`;

// --- Component ---
const Clock = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };

  const timeString = new Intl.DateTimeFormat('ko-KR', timeOptions).format(currentDate);
  const dateString = new Intl.DateTimeFormat('ko-KR', dateOptions).format(currentDate);

  return (
    <ClockContainer>
      <TimeDisplay>{timeString}</TimeDisplay>
      <DateDisplay>{dateString}</DateDisplay>
    </ClockContainer>
  );
};

export default Clock;
