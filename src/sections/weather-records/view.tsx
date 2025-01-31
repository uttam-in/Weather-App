'use client';

// export function WeatherAppRecords() {    
//   const [location, setLocation] = useState<string>('');
//   const [startDate, setStartDate] = useState<Date>(new Date());
//   const [endDate, setEndDate] = useState<Date>(new Date());
//   const [records, setRecords] = useState<WeatherRecord[]>([]);
//   const [error, setError] = useState<string>('');
//   const [editingId, setEditingId] = useState<number | null>(null);

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const fetchRecords = async (): Promise<void> => {
//     try {
//       const response = await fetch('/api/weather-records');
//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setRecords(data.data || []);
//     } catch (errorMsg: any) {
//       setError(`Failed to fetch records: ${errorMsg.message}`);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     setError('');

//     try {
//       const payload = {
//         location,
//         startDate: startDate.toISOString().split('T')[0],
//         endDate: endDate.toISOString().split('T')[0],
//       };

//       const endpoint = editingId 
//         ? `/api/weather-records?id=${editingId}`
//         : '/api/weather-records';

//       const method = editingId ? 'PUT' : 'POST';

//       const response = await fetch(endpoint, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setLocation('');
//       setStartDate(new Date());
//       setEndDate(new Date());
//       setEditingId(null);
//       fetchRecords();
//     } catch (errorMsg: any) {
//       setError(errorMsg.message);
//     }
//   };

//   const handleDelete = async (id: number): Promise<void> => {
//     try {
//       const response = await fetch(`/api/weather-records?id=${id}`, {
//         method: 'DELETE',
//       });
      
//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
      
//       fetchRecords();
//     } catch (errorMsg: any) {
//       setError(`Failed to delete record: ${errorMsg.message}`);
//     }
//   };

//   const handleEdit = (record: WeatherRecord): void => {
//     setLocation(record.location);
//     setStartDate(new Date(record.start_date));
//     setEndDate(new Date(record.end_date));
//     setEditingId(record.id);
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Weather Records
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
//         {/* Form implementation remains the same as before */}
//       </form>

//       <Grid container spacing={2}>
//         {records.map((record) => (
//           <Grid item xs={12} key={record.id}>
//             <Card>
//               <CardContent>
//                 {/* Card content implementation remains the same */}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Box,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { WeatherRecord } from 'src/components/weather/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

export function WeatherAppRecords() {    
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/weather-records');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRecords(data.data || []);
    } catch (errorMsg: any) {
      setError(`Failed to fetch records: ${errorMsg.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: { location: string; startDate: string; endDate: string; id?: number } = {
        location,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      if (editingId) {
        payload.id = editingId;
      }

      const response = await fetch('/api/weather-records', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setLocation('');
      setStartDate(new Date());
      setEndDate(new Date());
      setEditingId(null);
      fetchRecords();
    } catch (errorMsg: any) {
      setError(errorMsg.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/weather-records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete record');
      }
      
      fetchRecords();
    } catch (errorMsg: any) {
      setError(`Failed to delete record: ${errorMsg.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: WeatherRecord): void => {
    setLocation(record.location);
    setStartDate(new Date(record.start_date));
    setEndDate(new Date(record.end_date));
    setEditingId(record.id);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weather Records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingId ? 'Edit Weather Record' : 'Add New Weather Record'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter city name (e.g., London, New York)"
                  helperText="Enter a city name or location"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  '& .react-datepicker-wrapper': { 
                    width: '100%' 
                  }
                }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    customInput={
                      <TextField 
                        fullWidth 
                        label="Start Date"
                        disabled={loading}
                      />
                    }
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  '& .react-datepicker-wrapper': { 
                    width: '100%' 
                  }
                }}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: any) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                    customInput={
                      <TextField 
                        fullWidth 
                        label="End Date"
                        disabled={loading}
                      />
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading 
                    ? 'Processing...' 
                    : editingId 
                      ? 'Update Record' 
                      : 'Add Record'
                  }
                </Button>
                
                {editingId && (
                  <Button
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={() => {
                      setEditingId(null);
                      setLocation('');
                      setStartDate(new Date());
                      setEndDate(new Date());
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Saved Records
      </Typography>

      <Grid container spacing={2}>
        {records.map((record) => (
          <Grid item xs={12} key={record.id}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {record.location}
                    </Typography>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Date Range: {formatDate(record.start_date)} - {formatDate(record.end_date)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Coordinates: {record.latitude.toFixed(2)}, {record.longitude.toFixed(2)}
                    </Typography>

                    {record.temperature_data && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">
                          Temperature Data:
                        </Typography>
                        <Typography variant="body2">
                          {record.temperature_data.map((data: any, index: number) => (
                            <span key={index}>
                              {format(new Date(data.dt * 1000), 'MMM dd HH:mm')}: {data.main.temp}°C
                              {index < record.temperature_data.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Record">
                      <IconButton 
                        onClick={() => handleEdit(record)}
                        disabled={loading}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete Record">
                      <IconButton
                        onClick={() => handleDelete(record.id)}
                        disabled={loading}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {records.length === 0 && !loading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No weather records found. Add your first record above.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {loading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  Loading...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}