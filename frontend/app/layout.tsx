import "./globals.css";
import Header from "./components/Header";
import { getCategories } from "@/lib/directus";
import ThemeProvider from "./theme-provider";

export const metadata = {
  verification: {
    google: "4Eys10DTwJ3Xi2oLaLmQPpIvNFR46SJmYHFCRYXoeCE",
  },
};

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