import "./globals.css";
import Header from "./components/Header";
import { getCategories } from "@/lib/directus";
import ThemeProvider from "./theme-provider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="uk">
      <body>
        <ThemeProvider>
          <Header categories={categories} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}