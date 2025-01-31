# Weather App

Current Date and Time (UTC): 2025-01-31 09:21:19  

## Prerequisites

- Node.js 20.x or higher (Recommended)

## Installation

### Using npm

```bash
# Install dependencies (use --legacy-peer-deps if needed)
npm install

# Start development server
npm run dev
```

## Database Setup

### Create Database Tables
Execute the SQL commands in `database_tables.sql` to create the required tables.

### Environment Configuration
1. Copy `sample.env.local` to `.env.local`
2. Update the following environment variables:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# API Keys
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Building for Production

```bash
npm run build
```

## Icons Credits

Weather Icon: [iOS Weather](https://iconscout.com/icons/weather) by [Giulio Smedile](https://iconscout.com/contributors/giulio-smedile)

```

Theme used MUI.