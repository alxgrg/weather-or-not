import { useEffect } from 'react';

import Card from './UI/Card';

const CurrentWeather = ({ weather, location, setWeather }) => {
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        );
        console.log('second');
        if (!response.ok) {
          throw new Error(
            `Failed to fetch location. Error: ${response.status}`
          );
        }
        const data = await response.json();
        console.log('data', data);
        setWeather(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocation();
  }, [location.lat, location.lon, setWeather]);
  return (
    <Card className='forcast'>
      <span className='location-name'>{weather.name}</span>

      <div className='temp-wrapper'>
        <span className='temp'>
          {/* {temp} */}
          <span className='unit'>°C</span>
        </span>
      </div>
    </Card>
  );
};

export default CurrentWeather;
