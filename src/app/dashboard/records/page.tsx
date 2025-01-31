import { CONFIG } from 'src/config-global';

import { WeatherAppRecords } from 'src/sections/weather-records/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Records | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <WeatherAppRecords />;
}
