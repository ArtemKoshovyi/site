"use client";

import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return <>{children}</>;
}