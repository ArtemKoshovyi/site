// lib/weather.ts

type WeatherResult = {
  city: string;
  temperature: number | null;
};

export async function getWeatherByIP(): Promise<WeatherResult> {
  try {
    // 1️⃣ визначаємо місто по IP
    const ipRes = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
    });

    const ipData = await ipRes.json();

    const city = ipData.city;
    const latitude = ipData.latitude;
    const longitude = ipData.longitude;

    if (!latitude || !longitude) {
      return { city: "Невідомо", temperature: null };
    }

    // 2️⃣ отримуємо погоду
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      { cache: "no-store" }
    );

    const weatherData = await weatherRes.json();

    return {
      city,
      temperature: weatherData.current_weather?.temperature ?? null,
    };
  } catch (error) {
    return { city: "Невідомо", temperature: null };
  }
}