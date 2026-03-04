"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../page.module.css";
import { FaInstagram, FaFacebookF, FaYoutube, FaTelegramPlane } from "react-icons/fa";
import { FiMoon, FiSun, FiSearch } from "react-icons/fi";
import type { Category } from "../../lib/directus";

function categoryHref(cat: Category) {
  return cat.slug ? `/category/${cat.slug}` : `/category/${cat.id}`;
}

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

type HeaderVariant = "full" | "top";

type Weather = {
  city: string;
  temperature: number | null;
};

type Props = {
  categories?: Category[];
  variant?: HeaderVariant;
  weather?: Weather;
};

export default function Header({ categories = [], variant = "full", weather }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const categoriesForNav = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  function applyTheme(next: Theme) {
    setTheme(next);
    try {
      window.localStorage.setItem("theme", next);
      document.documentElement.dataset.theme = next;
    } catch {
      // ignore
    }
  }

  // sync theme on first paint
  if (typeof document !== "undefined") {
    const current = (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
    if (current !== theme) document.documentElement.dataset.theme = theme;
  }

  const cityLabel = weather?.city ?? "Варшава";
  const tempLabel =
    weather?.temperature != null ? `${Math.round(weather.temperature)}°` : "+2°";

  return (
    <header className={styles.header}>
      <div className={styles.headerTopbar}>
        <div className={styles.container}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarCity}>{cityLabel}</span>
            <span className={styles.topbarDot} aria-hidden="true">
              •
            </span>
            <span className={styles.topbarWeather}>{tempLabel}</span>
          </div>

          <div className={styles.topbarRight}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={theme === "dark" ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
              onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            <Link href="/search" className={styles.iconBtn} aria-label="Пошук">
              <FiSearch />
            </Link>

            <a
              href="https://www.facebook.com/share/1F3Ga9h2Xs/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={styles.iconLink}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={styles.iconLink}
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className={styles.iconLink}
            >
              <FaYoutube />
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className={styles.iconLink}
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      {variant === "full" ? (
        <>
          <div className={styles.headerBar}>
            <div className={styles.container}>
              <Link href="/" className={styles.brandRow} aria-label="Головна">
                <img src="/emblem.svg" alt="" className={styles.brandLogo} />
                <span className={styles.brandName} aria-label="Спілка ветеранів України">
                  <span className={styles.brandWord}>Спілка</span>
                  <span className={styles.brandWord}>Ветеранів</span>
                  <span className={styles.brandWord}>України</span>
                </span>
              </Link>

              <nav className={styles.nav} aria-label="Категорії">
                <Link href="/" className={styles.navLink}>
                  головна
                </Link>
                {categoriesForNav.map((cat) => (
                  <Link key={cat.id} href={categoryHref(cat)} className={styles.navLink}>
                    {cat.name}
                  </Link>
                ))}
                 <Link href="/about" className={styles.navLink}>
                  про нас
                </Link>
              </nav>

              <div className={styles.headerRight}>
                <button
                  type="button"
                  className={styles.burger}
                  aria-label="Відкрити меню"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className={styles.burgerLines} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
              <div className={styles.mobileTopbar}>
                <button
                  type="button"
                  className={styles.mobileThemeBtn}
                  onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? "Світла тема" : "Темна тема"}
                </button>
              </div>

              <nav className={styles.mobileNav} aria-label="Категорії (мобільне меню)">
                <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  головна
                </Link>

                                {categoriesForNav.map((cat) => (
                  <Link
                    key={cat.id}
                    href={categoryHref(cat)}
                    className={styles.navLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link href="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  про нас
                </Link>
              </nav>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </>
      ) : (
        <div className={styles.topOnlyDivider} aria-hidden="true" />
      )}
    </header>
  );
}