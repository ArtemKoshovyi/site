"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import pageStyles from "../page.module.css";
import headerStyles from "./Header.module.css";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import { FiMoon, FiSun, FiSearch } from "react-icons/fi";
import type { Category, NewsItem } from "../../lib/directus";
import { getWeatherByIP } from "../../lib/weather";

function categoryHref(cat: Category) {
  return cat.slug ? `/category/${cat.slug}` : `/category/${cat.id}`;
}

type Theme = "light" | "dark";
type HeaderVariant = "full" | "top";

type Weather = {
  city: string;
  temperature: number | null;
};

type Props = {
  categories?: Category[];
  variant?: HeaderVariant;
  weather?: Weather;
  tickerNews?: NewsItem[];
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export default function Header({
  categories = [],
  variant = "full",
  weather,
  tickerNews = [],
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [clientWeather, setClientWeather] = useState<Weather | null>(null);

  useEffect(() => {
    getWeatherByIP().then(setClientWeather).catch(() => {});
  }, []);

  const categoriesForNav = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const tickerItems = useMemo(() => {
    return (Array.isArray(tickerNews) ? tickerNews : []).slice(0, 8);
  }, [tickerNews]);

  function applyTheme(next: Theme) {
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
      document.documentElement.dataset.theme = next;
    } catch {}
  }

  if (typeof document !== "undefined") {
    const current =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "light";

    if (current !== theme) {
      document.documentElement.dataset.theme = theme;
    }
  }

  const w = clientWeather ?? weather;
  const cityLabel = w?.city && w.city !== "Невідомо" ? w.city : "Варшава";
  const tempLabel = w?.temperature != null ? `${Math.round(w.temperature)}°` : "—";

  return (
    <header className={headerStyles.header}>
      <div className={headerStyles.headerTopbar}>
        <div className={`${pageStyles.container} ${headerStyles.topbarInner}`}>
          <div className={headerStyles.topbarLeft}>
            <span className={headerStyles.topbarCity}>{cityLabel}</span>
            <span className={headerStyles.topbarDot} aria-hidden="true">
              •
            </span>
            <span className={headerStyles.topbarWeather}>{tempLabel}</span>
          </div>

          <div className={headerStyles.topbarRight}>
            <button
              type="button"
              className={headerStyles.iconBtn}
              aria-label={
                theme === "dark"
                  ? "Увімкнути світлу тему"
                  : "Увімкнути темну тему"
              }
              onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            <Link
              href="/search"
              className={headerStyles.iconBtn}
              aria-label="Пошук"
            >
              <FiSearch />
            </Link>

            <a
              href=""
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={headerStyles.iconLink}
            >
              <FaFacebookF />
            </a>

            <a
              href=""
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={headerStyles.iconLink}
            >
              <FaInstagram />
            </a>

            <a
              href=""
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className={headerStyles.iconLink}
            >
              <FaYoutube />
            </a>

            <a
              href=""
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className={headerStyles.iconLink}
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      {variant === "full" ? (
        <>
          <div className={headerStyles.headerBar}>
            <div className={`${pageStyles.container} ${headerStyles.headerBarInner}`}>
              <Link href="/" className={headerStyles.brandRow} aria-label="Головна">
                
                
                <span
                  className={headerStyles.brandName}
                  aria-label="Спілка ветеранів України"
                >
                  <span className={headerStyles.brandWord}>Спілка</span>
                  <span className={headerStyles.brandWord}>Ветеранів</span>
                  <span className={headerStyles.brandWord}>України</span>
                </span>
              </Link>

              <div className={headerStyles.mobileHeaderTitleWrap}>
                <button
                  type="button"
                  className={headerStyles.burger}
                  aria-label="Відкрити меню"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className={headerStyles.burgerLines} aria-hidden="true" />
                </button>

                <Link href="/" className={headerStyles.mobileHeaderTitle}>
                  Спілка Ветеранів України
                </Link>

                <button
                  type="button"
                  className={headerStyles.mobileThemeIconBtn}
                  aria-label={
                    theme === "dark"
                      ? "Увімкнути світлу тему"
                      : "Увімкнути темну тему"
                  }
                  onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>
              </div>

              <nav className={headerStyles.nav} aria-label="Категорії">
                <Link href="/" className={headerStyles.navLink}>
                  Головна
                </Link>

                {categoriesForNav.map((cat) => (
                  <Link
                    key={cat.id}
                    href={categoryHref(cat)}
                    className={headerStyles.navLink}
                  >
                    {cat.name}
                  </Link>
                ))}

                <Link href="/about" className={headerStyles.navLink}>
                  Про нас
                </Link>
              </nav>

              <div className={headerStyles.headerRight}>
                <button
                  type="button"
                  className={headerStyles.burger}
                  aria-label="Відкрити меню"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className={headerStyles.burgerLines} aria-hidden="true" />
                </button>
              </div>
            </div>

            {tickerItems.length > 0 ? (
              <div className={headerStyles.mobileTicker} aria-label="Останні новини">
                <div className={headerStyles.mobileTickerTrack}>
                  {[...tickerItems, ...tickerItems].map((item, index) => (
                    <Link
                      key={`${item.id}-${index}`}
                      href={`/news/${item.slug}`}
                      className={headerStyles.mobileTickerItem}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              className={`${headerStyles.mobileMenuOverlay} ${
                menuOpen ? headerStyles.mobileMenuOverlayOpen : ""
              }`}
              onClick={() => setMenuOpen(false)}
            />

            <aside
              className={`${headerStyles.mobileMenu} ${
                menuOpen ? headerStyles.mobileMenuOpen : ""
              }`}
            >
              <div className={headerStyles.mobileMenuHeader}>

                <button
                  type="button"
                  className={headerStyles.mobileMenuClose}
                  aria-label="Закрити меню"
                  onClick={() => setMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={headerStyles.mobileMenuBody}>
                <nav
                  className={headerStyles.mobileNav}
                  aria-label="Категорії (мобільне меню)"
                >
                  <Link
                    href="/"
                    className={headerStyles.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Головна</span>
                  </Link>

                  {categoriesForNav.map((cat) => (
                    <Link
                      key={cat.id}
                      href={categoryHref(cat)}
                      className={headerStyles.mobileNavLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}

                  <Link
                    href="/about"
                    className={headerStyles.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Про нас</span>
                  </Link>
                </nav>
              </div>
            </aside>
          </div>

          <div className={headerStyles.headerDivider} aria-hidden="true" />
        </>
      ) : (
        <div className={headerStyles.topOnlyDivider} aria-hidden="true" />
      )}
    </header>
  );
}