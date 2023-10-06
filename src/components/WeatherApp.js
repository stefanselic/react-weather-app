/** @format */
import { useState, useEffect } from 'react';
import styles from './WeatherApp.module.scss';

const API_KEY = `${process.env.REACT_APP_WEATHER_API_KEY}`;
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced handleCityChange function
  const handleCityChangeDebounced = debounce((value) => {
    setCity(value);
  }, 600);

  useEffect(() => {
    if (city) {
      setLoading(true);
      fetch(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setLoading(false);
        });
    }
  }, [city]);

  return (
    <>
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1>
            Weather <span>App ☀️</span>
          </h1>
          <img src="weather.png" height={200} width={400} />
        </div>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="🔍  Enter city name..."
          onChange={(e) => handleCityChangeDebounced(e.target.value)}
        />
        {loading ? (
          <p>Loading...</p>
        ) : weatherData ? (
          <div className={styles.secondContainer}>
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p>
              🌡 <b>Temperature:</b> {weatherData.main.temp}°C
            </p>
            <p>
              🌤 <b>Weather:</b> {weatherData.weather[0].description}
            </p>
            <p>
              💧 <b>Humidity:</b> {weatherData.main.humidity}%
            </p>
            <p>
              💨 <b>Wind Speed:</b> {weatherData.wind.speed} m/s
            </p>
          </div>
        ) : (
          <p>Enter a city name to get weather information.</p>
        )}
      </main>
    </>
  );
}

export default WeatherApp;
