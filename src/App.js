import { useEffect, useState, useCallback, Fragment } from 'react';
import Card from './components/UI/Card';

import './App.css';

const DEFAULT_LOCATIONS = {
  nyc: { lon: 40.73061, lat: -73.935242 },
  toronto: { lon: 43.65107, lat: -79.347015 },
  tokyo: { lon: 35.652832, lat: 139.839478 },
  sydney: { lon: -33.865143, lat: 151.2099 },
  dubai: { lon: 25.276987, lat: 55.296249 },
  mexico: { lon: 19.451054, lat: -99.125519 },
  kyiv: { lon: 19.451054, lat: 30.523333 },
};

function App() {
  const [location, setLocation] = useState({});
  const [locationQuery, setLocationQuery] = useState('');
  const [locationQueryResults, setLocationQueryResults] = useState([]);
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loacationData, setLocationData] = useState({});
  const [hasBeenSet, setHasBeenSet] = useState(false);

  const getRandomCity = useCallback(() => {
    const cities = Object.keys(DEFAULT_LOCATIONS);
    const index = Math.floor(Math.random() * 8);
    const city = cities[index];
    console.log(DEFAULT_LOCATIONS[city]);
    return DEFAULT_LOCATIONS[city];
  }, []);

  const getUserLocation = useCallback(async () => {
    try {
      const response = await fetch('https://geolocation-db.com/json/');
      if (!response.ok) {
        setLocation(getRandomCity());
        throw new Error(
          `Could not retrieve your location. Error message:  ${response.status}`
        );
      }
      const data = await response.json();
      setLocation({ lon: data.longitude, lat: data.latitude });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }, [getRandomCity]);

  const fetchLocation = useCallback(async () => {
    console.log(location);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch location. Error: ${response.status}`);
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.log(error);
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    setIsLoading(true);
    if (!hasBeenSet) {
      getUserLocation();
    }

    fetchLocation();
    setIsLoading(false);
  }, [getUserLocation, getRandomCity, fetchLocation, hasBeenSet]);

  useEffect(() => {
    if (locationQuery.length > 0) {
      fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${locationQuery}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          setLocationQueryResults(data);
        });
    } else if (locationQuery.length === 0) {
      setLocationQueryResults([]);
    }
  }, [locationQuery]);

  console.log(location);

  const changeLocationHandler = (location) => {
    setHasBeenSet(true);
    setLocation(location);
    setLocationQuery('');
    setLocationQueryResults([]);
    console.log(location);
  };

  const handleLocationNameChange = (event) => {
    setLocationQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8) {
      setLocationQuery(event.target.value);
      console.log(event.target.value);
    }
  };

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (weather.main) {
    const temp = Math.round(weather.main.temp).toString();
    const icon = ` https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const time = utc + 1000 * weather.timezone;
    const nd = new Date(time);
    content = (
      <Fragment>
        <span className='location-name'>{weather.name}</span>
        <span>{nd.toLocaleTimeString()}</span>
        <div>
          <img src={icon} alt='weather icon' />
        </div>
        <div className='weather-desc'>{weather.weather[0].main}</div>

        <div className='temp-wrapper'>
          <span className='temp'>
            {temp}
            <span className='unit'>°C</span>
          </span>
        </div>
      </Fragment>
    );
  } else {
    content = <p>Could not find location.</p>;
  }
  let searchResults;
  if (locationQueryResults.length > 0) {
    searchResults = locationQueryResults.map((location, i) => (
      <button
        className='location-btn'
        onClick={() => {
          changeLocationHandler({ lon: location.lon, lat: location.lat });
          console.log(location);
          setLocationData({
            city: location.name,
            state: location.state,
            country: location.country,
          });
        }}
        value={location.name}
        key={i}
      >
        {location.state !== undefined
          ? location.name + ', ' + location.state + ', ' + location.country
          : location.name + ', ' + location.country}
      </button>
    ));
  }

  return (
    <div className='App'>
      <div className='search-box-container'>
        <label htmlFor='search'>Find new location</label>
        <input
          type='text'
          name='search'
          value={locationQuery}
          onChange={handleLocationNameChange}
          onKeyDown={handleKeyDown}
          className='search-input'
        />
      </div>

      {searchResults && <Card className='search-box'>{searchResults}</Card>}
      <Card className='forcast'>{content}</Card>
    </div>
  );
}

export default App;
