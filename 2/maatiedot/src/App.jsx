import { useState, useEffect } from 'react';
import countryService from './services/countryService';

const CountryList = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => onShow(country)}>show</button>
        </li>
      ))}
    </ul>
  );
};

const CountryDetails = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} flag`} width="150" />

      {weather && (
        <div>
          <h4>Weather in {country.capital[0]}</h4>
          <p>temperature {weather.main.temp} Celsius</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    countryService.getAllCountries()
      .then(fetchedCountries => setCountries(fetchedCountries));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      countryService.getWeather(capital, api_key)
        .then(fetchedWeather => setWeather(fetchedWeather))
        .catch(error => console.error("Weather fetch failed:", error));
    }
  }, [selectedCountry, api_key]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null);
    setWeather(null);
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setWeather(null);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {selectedCountry ? (
        <CountryDetails country={selectedCountry} weather={weather} />
      ) : (
        <CountryList countries={filteredCountries} onShow={handleShowCountry} />
      )}
    </div>
  );
};

export default App;
