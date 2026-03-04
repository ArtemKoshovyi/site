// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import { getCategories } from "@/lib/directus";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="uk">
      <body>
        <Header categories={categories} />
        {children}
      </body>
    </html>
  );
}