'use client';

import { useState, useEffect, useCallback } from 'react';
import { Country, State, City } from 'country-state-city';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

import { WeatherDisplay } from 'src/components/weather';
import { WeatherData, SearchParams, LocationData } from 'src/components/weather/types';
import { DEFAULT_CENTER } from 'src/components/weather/constants';
import { TabPanel } from 'src/components/weather/TabPanel';
import { getCurrentWeather, getCurrentWeatherLocation } from 'src/services/weather';
import { LocationSearch } from 'src/components/weather/LocationSearch';

export function WeatherApp() {
  const [currentDateTime, setCurrentDateTime] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
  const [searchParams, setSearchParams] = useState<SearchParams>({
    country: '',
    state: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    plainText: '',
  });

  const [locationData, setLocationData] = useState<LocationData>({
    selectedCountry: null,
    selectedState: null,
    selectedCity: null,
    countries: [],
    states: [],
    cities: [],
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setLocationData(prev => ({
      ...prev,
      countries: allCountries,
    }));
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (locationData.selectedCountry) {
      const countryStates = State.getStatesOfCountry(locationData.selectedCountry.isoCode);
      setLocationData(prev => ({
        ...prev,
        states: countryStates,
        selectedState: null,
        selectedCity: null,
        cities: [],
      }));
    }
  }, [locationData.selectedCountry]);

  // Update cities when state changes
  useEffect(() => {
    if (locationData.selectedCountry && locationData.selectedState) {
      const stateCities = City.getCitiesOfState(
        locationData.selectedCountry.isoCode,
        locationData.selectedState.isoCode
      );
      setLocationData((prev:any) => ({
        ...prev,
        cities: stateCities,
        selectedCity: null,
      }));
    }
  }, [locationData.selectedState, locationData.selectedCountry]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    const country = locationData.countries.find(
      (c: any) => c.isoCode === event.target.value
    );
    setLocationData(prev => ({
      ...prev,
      selectedCountry: country,
      selectedState: null,
      selectedCity: null,
    }));
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    const state = locationData.states.find(
      (s: any) => s.isoCode === event.target.value
    );
    setLocationData(prev => ({
      ...prev,
      selectedState: state,
      selectedCity: null,
    }));
  };

  const handleCityChange = (event: SelectChangeEvent) => {
    const city = locationData.cities.find(
      (c: any) => c.name === event.target.value
    );
    setLocationData(prev => ({
      ...prev,
      selectedCity: city,
    }));
  };

  const handleInputChange = (field: keyof SearchParams) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setSearchParams({
      ...searchParams,
      [field]: event.target.value,
    });
  };

  const validateCoordinates = () => {
    const lat = parseFloat(searchParams.latitude);
    const lon = parseFloat(searchParams.longitude);
    return !Number.isNaN(lat) && !Number.isNaN(lon) && 
           lat >= -90 && lat <= 90 && 
           lon >= -180 && lon <= 180;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTabValue(2);
        setSearchParams(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setLoading(false);
      },
      (errorMsg:any) => {
        setError(`Unable to retrieve your location: ${errorMsg.message}`);
        setLoading(false);
      }
    );
  };

  const fetchWeather = async () => {
    let query = '';
    let location = '';
    
    switch (tabValue) {
      case 0:
        if (!locationData.selectedCity) {
          setError('Please select a city');
          return;
        }
        query = `${locationData.selectedCity.name},${locationData.selectedCountry.isoCode}`;
        location = locationData.selectedCity.name;
        break;
        
      case 1:
        if (!searchParams.zipCode) {
          setError('Please enter a zip code');
          return;
        }
        query = searchParams.zipCode;
        location = searchParams.zipCode;
        break;
        
      case 2:
        if (!validateCoordinates()) {
          setError('Please enter valid coordinates');
          return;
        }
        query = `lat=${searchParams.latitude}&lon=${searchParams.longitude}`;
        location = `${searchParams.latitude},${searchParams.longitude}`;
        break;

      case 3:
        if (!searchParams.plainText.trim()) {
          setError('Please enter a location');
          return;
        }
        query = searchParams.plainText;
        location = searchParams.plainText;
        break;
      default:
        break
    }

    setLoading(true);
    setError('');

    try {
      let data:any = null;
      if (tabValue === 2){
        data = await getCurrentWeatherLocation({ location: query });
      }else{
        data = await getCurrentWeather({ location: query });
      }
      
      setWeather(data);
      setMapCenter({
        lat: data.coord.lat,
        lng: data.coord.lon,
      });

      // Store the search history 

      setError('');
      setLoading(true);
      if (tabValue !== 2)
      try {
        const payload: { location: string; startDate: string; endDate: string; id?: number } = {
          location,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        };
  
        const response = await fetch('/api/weather-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        const dataM = await response.json();
        
        if (dataM.error) {
          throw new Error(dataM.error);
        }
  
      } catch (errorMsg: any) {
        setError(errorMsg.message);
      } finally {
        setLoading(false);
      }
      // end of storing search history

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (weather) {
      setMapCenter({
        lat: weather.coord.lat,
        lng: weather.coord.lon,
      });
    }
  }, [weather]);

  return (
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: '1200px', // Fixed maximum width
        margin: '0 auto',
        minHeight: '100vh',
        p: { xs: 2, md: 3 }, // Responsive padding
        backgroundColor: 'background.default',
      }}
    >
      {/* Container for all content */}
      <Box 
        sx={{ 
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" component="h1">
            Weather App
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {currentDateTime} UTC
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          {/* Search Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ 
                mb: 3,
                '& .MuiTabs-flexContainer': {
                  justifyContent: { xs: 'flex-start', md: 'center' }
                }
              }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Location Search" />
              <Tab label="Zip Code" />
              <Tab label="Coordinates" />
              <Tab label="Search" />
            </Tabs>
          </Box>

          {/* Search Forms */}
          <Box sx={{ mt: 2 }}>
            <TabPanel value={tabValue} index={0}>
              <LocationSearch 
                locationData={locationData}
                onCountryChange={handleCountryChange}
                onStateChange={handleStateChange}
                onCityChange={handleCityChange}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TextField
                fullWidth
                label="Zip Code"
                placeholder="Enter zip code..."
                value={searchParams.zipCode}
                onChange={handleInputChange('zipCode')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 'md' }}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2} sx={{ maxWidth: 'md', margin: '0 auto' }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={searchParams.latitude}
                    onChange={handleInputChange('latitude')}
                    type="number"
                    inputProps={{ step: 'any', min: -90, max: 90 }}
                    placeholder="-90 to 90"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={searchParams.longitude}
                    onChange={handleInputChange('longitude')}
                    type="number"
                    inputProps={{ step: 'any', min: -180, max: 180 }}
                    placeholder="-180 to 180"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <TextField
                fullWidth
                label="Location Search"
                placeholder="Enter city name, landmark, or address..."
                value={searchParams.plainText}
                onChange={handleInputChange('plainText')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 'md' }}
              />
            </TabPanel>
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              mt: 3, 
              mb: 4, 
              display: 'flex', 
              gap: 2,
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={fetchWeather}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </Button>
            <Button
              variant="outlined"
              onClick={getCurrentLocation}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              Use Current Location
            </Button>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                maxWidth: 'md',
                margin: '0 auto'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Weather Display */}
          {weather && (
            <Box sx={{ mt: 3 }}>
              <WeatherDisplay 
                weather={weather} 
                currentDateTime={currentDateTime} 
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}