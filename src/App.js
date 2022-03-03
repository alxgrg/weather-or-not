import { useEffect, useState, useRef } from 'react';

import './App.css';

function App() {
  const [location, setLocation] = useState('Toronto');
  const [weather, setWeather] = useState({});
  const locationEl = useRef(null);

  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=ecd26f397034985825d7cf51ba053022`
    )
      .then((response) => response.json())
      .then((data) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            setWeather(data);
          });
      });
  }, [location]);
  console.log(weather);

  const changeLocationHandler = (event) => {
    event.preventDefault();
    console.log(locationEl.current.value);
    setLocation(locationEl.current.value);
  };

  const handleLocationNameChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <div className='App'>
      <form onSubmit={changeLocationHandler}>
        <input type='text' ref={locationEl} />
        <button>Change Location</button>
      </form>

      {weather.main && (
        <div>
          {weather.name} {weather.main.temp}
        </div>
      )}
    </div>
  );
}

export default App;
