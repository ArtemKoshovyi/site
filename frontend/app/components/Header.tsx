"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import headerStyles from "./Header.module.css";
import type { Category } from "../../lib/directus";
import { FiMoon, FiSun } from "react-icons/fi";

function categoryHref(cat: Category) {
  return cat.slug ? `/category/${cat.slug}` : `/category/${cat.id}`;
}

type Props = {
  categories?: Category[];
};

export default function Header({ categories = [] }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

function toggleTheme() {
  const next = theme === "dark" ? "light" : "dark";
  setTheme(next);
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
}
  const categoriesForNav = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  return (
    <>
      <header className={headerStyles.header}>
        <div className={headerStyles.headerInner}>
          {/* left side */}
          <div className={headerStyles.leftGroup}>
            <button
              type="button"
              className={headerStyles.iconButton}
              aria-label="Відкрити меню"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <FiMenu />
            </button>

            <Link
              href="/search"
              className={headerStyles.iconButton}
              aria-label="Пошук"
            >
              <FiSearch />
            </Link>
          </div>

          {/* center logo */}
          <div className={headerStyles.centerGroup}>
            <Link href="/" className={headerStyles.logo} aria-label="Головна">
              <span className={headerStyles.logoText}>Express News</span>
            </Link>
          </div>

          {/* right side socials */}
          <div className={headerStyles.rightGroup}>
            <button
              type="button"
              aria-label="Toggle theme"
              className={headerStyles.iconButton}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={headerStyles.socialLink}
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={headerStyles.socialLink}
            >
              <FaInstagram />
            </a>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className={headerStyles.socialLink}
            >
              <FaTelegramPlane />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className={headerStyles.socialLink}
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </header>

      <div
        className={`${headerStyles.overlay} ${
          menuOpen ? headerStyles.overlayOpen : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`${headerStyles.sideMenu} ${
          menuOpen ? headerStyles.sideMenuOpen : ""
        }`}
      >
        <div className={headerStyles.sideMenuHeader}>
          <div className={headerStyles.sideMenuTitle}></div>

          
        </div>

        <nav className={headerStyles.sideNav} aria-label="Категорії">
          <Link
            href="/"
            className={headerStyles.sideNavLink}
            onClick={() => setMenuOpen(false)}
          >
            Головна
          </Link>

          {categoriesForNav.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat)}
              className={headerStyles.sideNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          <Link
            href="/about"
            className={headerStyles.sideNavLink}
            onClick={() => setMenuOpen(false)}
          >
            Про нас
          </Link>
        </nav>
      </aside>
    </>
  );
}