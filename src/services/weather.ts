// src/services/weather.ts
'use client';

import axios from 'axios';
import { isAxiosError } from 'axios';

// ----------------------------------------------------------------------

export type WeatherParams = {
  location: string;
};

export type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
};

export type WeatherError = {
  code: string;
  message: string;
};

export const getCurrentWeather = async ({ location }: WeatherParams): Promise<WeatherData> => {
  try {
    const response = await axios.get('/api/weather/current', {
      params: {
        location,
      },
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      
      switch (error.response?.status) {
        case 404:
          throw new Error(`Location "${location}" not found`);
        case 401:
          throw new Error('Invalid API key');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later');
        case 500:
          throw new Error('Weather service is currently unavailable');
        default:
          throw new Error(`Failed to fetch weather data: ${errorMessage}`);
      }
    }
    
    throw error;
  }
};