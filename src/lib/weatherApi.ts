import axios from 'axios';
import { CONFIG } from 'src/config-global';
import { GeocodingResponse, WeatherData } from 'src/components/weather/types';

const BASE_URL = 'http://api.openweathermap.org/data/2.5';

export async function geocodeLocation(location: string): Promise<GeocodingResponse> {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${CONFIG.openWeatherMapKey}`
    );

    if (response.data.length === 0) {
      throw new Error('Location not found');
    }

    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      name: response.data[0].name
    };
  } catch (error) {
    throw new Error('Failed to geocode location');
  }
}

export async function getWeatherData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.openWeatherMapKey}&units=metric`
    );
    
    return filterWeatherData(response.data, startDate, endDate);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

function filterWeatherData(
  data: any,
  startDate: string,
  endDate: string
): WeatherData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.list.filter((item: WeatherData) => {
    const date = new Date(item.dt * 1000);
    return date >= start && date <= end;
  });
}