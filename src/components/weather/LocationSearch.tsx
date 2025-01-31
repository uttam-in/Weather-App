// components/LocationSearch.tsx
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LocationData } from './types';

interface LocationSearchProps {
  locationData: LocationData;
  onCountryChange: (event: any) => void;
  onStateChange: (event: any) => void;
  onCityChange: (event: any) => void;
}

export function LocationSearch({
  locationData,
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationSearchProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={locationData.selectedCountry?.isoCode || ''}
            label="Country"
            onChange={onCountryChange}
          >
            {locationData.countries.map((country: any) => (
              <MenuItem key={country.isoCode} value={country.isoCode}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl 
          fullWidth 
          disabled={!locationData.selectedCountry}
        >
          <InputLabel>State</InputLabel>
          <Select
            value={locationData.selectedState?.isoCode || ''}
            label="State"
            onChange={onStateChange}
          >
            {locationData.states.map((state: any) => (
              <MenuItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl 
          fullWidth 
          disabled={!locationData.selectedState}
        >
          <InputLabel>City</InputLabel>
          <Select
            value={locationData.selectedCity?.name || ''}
            label="City"
            onChange={onCityChange}
          >
            {locationData.cities.map((city: any) => (
              <MenuItem key={city.name} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}