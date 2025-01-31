// export interface WeatherRecord {
//     id: number;
//     location: string;
//     latitude: number;
//     longitude: number;
//     start_date: string;
//     end_date: string;
//     temperature_data: WeatherData[];
//     created_at: string;
//     updated_at: string;
//   }
  
  // export interface WeatherData {
  //   dt: number;
  //   main: {
  //     temp: number;
  //     feels_like: number;
  //     humidity: number;
  //   };
  //   weather: Array<{
  //     main: string;
  //     description: string;
  //   }>;
  // }
  
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

  export interface WeatherRecord {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    temperature_data: Array<{
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
    }>;
    created_at: string;
    updated_at: string;
  }


  // types/weather.ts
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    '1h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface SearchParams {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  plainText: string;
}

export interface LocationData {
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  countries: any[];
  states: any[];
  cities: any[];
}