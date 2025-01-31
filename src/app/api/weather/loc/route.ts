// app/api/weather/current/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from 'src/config-global';
import axios from 'axios';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json(
      { message: 'Location parameter is required' },
      { status: 400 }
    );
  }

  try {
    let url = `${CONFIG.openWeatherAPIurl}/weather?${location}&appid=${CONFIG.openWeatherMapKey}&units=metric`;
    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Internal server error';
      
      return NextResponse.json(
        {
          error: true,
          message,
          timestamp: new Date().toISOString(),
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}