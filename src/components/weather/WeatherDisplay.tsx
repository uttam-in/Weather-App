// components/WeatherDisplay.tsx
import { format, fromUnixTime } from 'date-fns';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WeatherInfoCard } from './WeatherInfoCard';
import { WeatherData } from './types';

interface WeatherDisplayProps {
  weather: WeatherData;
  currentDateTime: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginTop: '16px'
};

export function WeatherDisplay({ weather, currentDateTime }: WeatherDisplayProps) {
  const mapCenter = {
    lat: weather.coord.lat,
    lng: weather.coord.lon
  };

  return (
    <Grid container spacing={3}>
      {/* Weather Information Section */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {weather.name}, {weather.sys.country}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  {weather.coord.lat.toFixed(2)}°N, {weather.coord.lon.toFixed(2)}°E
                </Typography>
              </Box>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                style={{ width: 200, height: 200 }}
              />
              <Typography variant="h4" gutterBottom>
                {Math.round(weather.main.temp)}°C
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {weather.weather[0].description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {currentDateTime}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<ThermostatIcon />}
                  title="Feels Like"
                  value={Math.round(weather.main.feels_like)}
                  unit="°C"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<WaterDropIcon />}
                  title="Humidity"
                  value={weather.main.humidity}
                  unit="%"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<AirIcon />}
                  title="Wind Speed"
                  value={weather.wind.speed}
                  unit="m/s"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<CompressIcon />}
                  title="Pressure"
                  value={weather.main.pressure}
                  unit="hPa"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<VisibilityIcon />}
                  title="Visibility"
                  value={(weather.visibility / 1000).toFixed(1)}
                  unit="km"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<CloudIcon />}
                  title="Cloudiness"
                  value={weather.clouds.all}
                  unit="%"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Sun Schedule
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <WeatherInfoCard
                    icon={<WbSunnyIcon />}
                    title="Sunrise"
                    value={format(fromUnixTime(weather.sys.sunrise), 'HH:mm')}
                    unit="UTC"
                  />
                </Grid>
                <Grid item xs={6}>
                  <WeatherInfoCard
                    icon={<WbTwilightIcon />}
                    title="Sunset"
                    value={format(fromUnixTime(weather.sys.sunset), 'HH:mm')}
                    unit="UTC"
                  />
                </Grid>
              </Grid>
            </Box>

            {weather.rain && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Precipitation
                  </Typography>
                  <WeatherInfoCard
                    icon={<WaterDropIcon />}
                    title="Rain (Last 1h)"
                    value={weather.rain['1h'] || 0}
                    unit="mm"
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Map Section */}
    {/* Map Section */}
    <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Location Map
            </Typography>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10}
                options={{
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true,
                  zoomControl: true,
                  styles: [
                    {
                      featureType: 'poi',
                      elementType: 'labels',
                      stylers: [{ visibility: 'on' }]
                    }
                  ]
                }}
              >
                <Marker
                  position={mapCenter}
                  title={`${weather.name}, ${weather.sys.country}`}
                />
              </GoogleMap>
            </LoadScript>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Click and drag to explore the map. Use the controls to zoom and change view.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Additional Weather Details Card */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<ThermostatIcon />}
                  title="Temperature Range"
                  value={`${Math.round(weather.main.temp_min)} - ${Math.round(weather.main.temp_max)}`}
                  unit="°C"
                />
              </Grid>
              <Grid item xs={6}>
                <WeatherInfoCard
                  icon={<AirIcon />}
                  title="Wind Direction"
                  value={weather.wind.deg}
                  unit="°"
                />
              </Grid>
              {weather.main.sea_level && (
                <Grid item xs={6}>
                  <WeatherInfoCard
                    icon={<CompressIcon />}
                    title="Sea Level Pressure"
                    value={weather.main.sea_level}
                    unit="hPa"
                  />
                </Grid>
              )}
              {weather.main.grnd_level && (
                <Grid item xs={6}>
                  <WeatherInfoCard
                    icon={<CompressIcon />}
                    title="Ground Level Pressure"
                    value={weather.main.grnd_level}
                    unit="hPa"
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}