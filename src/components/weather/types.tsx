export interface WeatherRecord {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    temperature_data: WeatherData[];
    created_at: string;
    updated_at: string;
  }
  
  export interface WeatherData {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }
  
  export interface GeocodingResponse {
    lat: number;
    lon: number;
    name: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
  }