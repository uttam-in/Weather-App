'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
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
} from '@mui/material';
import { WeatherRecord } from 'src/components/weather/types';


export function WeatherAppRecords() {    
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (): Promise<void> => {
    try {
      const response = await fetch('/api/weather-records');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRecords(data.data || []);
    } catch (errorMsg: any) {
      setError(`Failed to fetch records: ${errorMsg.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        location,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      const endpoint = editingId 
        ? `/api/weather-records?id=${editingId}`
        : '/api/weather-records';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
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
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/weather-records?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      fetchRecords();
    } catch (errorMsg: any) {
      setError(`Failed to delete record: ${errorMsg.message}`);
    }
  };

  const handleEdit = (record: WeatherRecord): void => {
    setLocation(record.location);
    setStartDate(new Date(record.start_date));
    setEndDate(new Date(record.end_date));
    setEditingId(record.id);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weather Records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {/* Form implementation remains the same as before */}
      </form>

      <Grid container spacing={2}>
        {records.map((record) => (
          <Grid item xs={12} key={record.id}>
            <Card>
              <CardContent>
                {/* Card content implementation remains the same */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};