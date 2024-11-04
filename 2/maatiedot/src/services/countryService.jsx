import axios from 'axios';

const BASE_URL_COUNTRIES = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const BASE_URL_WEATHER = 'https://api.openweathermap.org/data/2.5/weather';

const getAllCountries = async () => {
    const response = await axios.get(BASE_URL_COUNTRIES);
    return response.data;
};

const getWeather = async (city, apiKey) => {
    const url = `${BASE_URL_WEATHER}?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
};

export default { getAllCountries, getWeather };
