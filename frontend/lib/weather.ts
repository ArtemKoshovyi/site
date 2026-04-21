// lib/weather.ts

type WeatherResult = {
  city: string;
  temperature: number | null;
};

type IpApiResponse = {
  city?: string;
  latitude?: number;
  longitude?: number;
};

type OpenMeteoResponse = {
  current_weather?: {
    temperature?: number;
  };
};

const FALLBACK_CITY = "Варшава";

export async function getWeatherByIP(): Promise<WeatherResult> {
  try {
    const ipRes = await fetch("https://ipapi.co/json/", {
       next: { revalidate: 60 } ,
    });

    if (!ipRes.ok) {
      return { city: FALLBACK_CITY, temperature: null };
    }

    const ipData = (await ipRes.json()) as IpApiResponse;

    const city = ipData.city?.trim() || FALLBACK_CITY;
    const latitude = ipData.latitude;
    const longitude = ipData.longitude;

    if (latitude == null || longitude == null) {
      return { city, temperature: null };
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      {
         next: { revalidate: 60 } ,
      }
    );

    if (!weatherRes.ok) {
      return { city, temperature: null };
    }

    const weatherData = (await weatherRes.json()) as OpenMeteoResponse;

    return {
      city,
      temperature: weatherData.current_weather?.temperature ?? null,
    };
  } catch {
    return {
      city: FALLBACK_CITY,
      temperature: null,
    };
  }
}