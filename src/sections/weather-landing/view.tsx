'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';

import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/config-global';
import { getCurrentWeather } from 'src/services/weather';


type WeatherData = {
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
};

export function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getCurrentWeather({ location });
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Weather Forecast
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Enter location (city, zip code, landmark...)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={fetchWeather}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Get Weather'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {weather && (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {weather.name}
              </Typography>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                style={{ width: 100, height: 100 }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {weather.weather[0].description}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThermostatIcon />
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Temperature
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(weather.main.temp)}°C
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WaterDropIcon />
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Humidity
                  </Typography>
                  <Typography variant="h6">
                    {weather.main.humidity}%
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AirIcon />
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Wind Speed
                  </Typography>
                  <Typography variant="h6">
                    {weather.wind.speed} m/s
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompressIcon />
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Pressure
                  </Typography>
                  <Typography variant="h6">
                    {weather.main.pressure} hPa
                  </Typography>
                </div>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </DashboardContent>
  );
}