import { CONFIG } from 'src/config-global';

import { WeatherApp } from 'src/sections/weather-landing/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <WeatherApp />;
}
