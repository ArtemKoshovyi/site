import "./globals.css";
import Header from "./components/Header";
import { getCategories } from "@/lib/directus";
import { getWeatherByIP } from "@/lib/weather";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const weather = await getWeatherByIP();
  return (
    <html lang="uk">
      <body>
        <Header categories={categories} weather={weather} />
        {children}
      </body>
    </html>
  );
}