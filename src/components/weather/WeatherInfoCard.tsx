// components/WeatherInfoCard.tsx
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface WeatherInfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
}

export const WeatherInfoCard = ({ icon, title, value, unit }: WeatherInfoCardProps) => (
  <Paper elevation={2} sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <div>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">
          {value} {unit}
        </Typography>
      </div>
    </Box>
  </Paper>
);