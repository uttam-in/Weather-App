import { NextRequest, NextResponse } from 'next/server';
import { WeatherRecord } from 'src/components/weather/types';
import moment from 'moment';
import pool from '../../../lib/db';
import { geocodeLocation, getWeatherData } from '../../../lib/weatherApi';

async function validateDateRange(startDate: string, endDate: string): Promise<void> {
  const start = moment(startDate);
  const end = moment(endDate);
  
  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format');
  }
  
  if (end.isBefore(start)) {
    throw new Error('End date must be after start date');
  }
  
  if (end.diff(start, 'days') > 5) {
    throw new Error('Date range cannot exceed 5 days');
  }
}

// GET handler
export async function GET() {
  try {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM weather_records');
    const records: WeatherRecord[] = rows.map((row: any) => ({
      id: row.id,
      location: row.location,
      latitude: row.latitude,
      longitude: row.longitude,
      start_date: row.start_date,
      end_date: row.end_date,
      temperature_data: JSON.parse(row.temperature_data),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return NextResponse.json({ data: records });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, startDate, endDate } = body;

    await validateDateRange(startDate, endDate);
    const geoData = await geocodeLocation(location);
    const weatherData = await getWeatherData(
      geoData.lat,
      geoData.lon,
      startDate,
      endDate
    );

    const [result] = await pool.query(
      `INSERT INTO weather_records 
       (location, latitude, longitude, start_date, end_date, temperature_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        geoData.name,
        geoData.lat,
        geoData.lon,
        startDate,
        endDate,
        JSON.stringify(weatherData)
      ]
    );

    const newRecord: WeatherRecord = {
      id: (result as any).insertId,
      location: geoData.name,
      latitude: geoData.lat,
      longitude: geoData.lon,
      start_date: startDate,
      end_date: endDate,
      temperature_data: weatherData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(
      { data: newRecord },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// PUT handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, location, startDate, endDate } = body;

    await validateDateRange(startDate, endDate);
    const geoData = await geocodeLocation(location);
    const weatherData = await getWeatherData(
      geoData.lat,
      geoData.lon,
      startDate,
      endDate
    );

    const [result] = await pool.query(
      `UPDATE weather_records 
       SET location = ?, latitude = ?, longitude = ?, start_date = ?, end_date = ?, temperature_data = ?, updated_at = ?
       WHERE id = ?`,
      [
        geoData.name,
        geoData.lat,
        geoData.lon,
        startDate,
        endDate,
        JSON.stringify(weatherData),
        new Date().toISOString(),
        id
      ]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    const updatedRecord: WeatherRecord = {
      id,
      location: geoData.name,
      latitude: geoData.lat,
      longitude: geoData.lon,
      start_date: startDate,
      end_date: endDate,
      temperature_data: weatherData,
      created_at: (result as any).created_at,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ data: updatedRecord });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const [result] = await pool.query(
      'DELETE FROM weather_records WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}