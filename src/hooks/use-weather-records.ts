import { useState, useCallback } from 'react';
import { WeatherRecord, ApiResponse } from 'src/components/weather/types';

export function useWeatherRecords() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/weather-records');
      const data: ApiResponse<WeatherRecord[]> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRecords(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords
  };
}