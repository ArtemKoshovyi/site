"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../page.module.css";
import { assetUrl, type NewsItem } from "../../lib/directus";
import Image from "next/image";

const DATE_LOCALE = "uk-UA";

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(DATE_LOCALE, { day: "numeric", month: "long" });
}

type Props = {
  hero: NewsItem | null;
  topList: NewsItem[];
};

export default function HomeHero({ hero, topList }: Props) {
  const candidates = useMemo(() => {
    const list: NewsItem[] = [];

    if (hero) list.push(hero);

    for (const item of topList) {
      if (!list.some((x) => x.slug === item.slug)) list.push(item);
    }

    // показуємо в hero тільки ті, де є cover_image
    return list.filter((x) => !!x.cover_image);
  }, [hero, topList]);

  const [selectedSlug, setSelectedSlug] = useState(() => candidates[0]?.slug ?? "");

  const selected = useMemo(() => {
    return candidates.find((x) => x.slug === selectedSlug) ?? candidates[0] ?? null;
  }, [candidates, selectedSlug]);

  if (!selected) return null;

  const bg = selected.cover_image ? assetUrl(String(selected.cover_image)) : "";

  return (
    <section className={styles.heroFull} aria-label="Головна новина">
      <div className={styles.heroBg}>
  <Image
    src={bg}
    alt={selected.title}
    fill
    priority
    unoptimized
    className={styles.heroBgImage}
    sizes="100vw"
  />
</div>
      <div className={styles.heroShade} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroKicker}>{formatDate(selected.published_at)}</div>

            <Link href={`/news/${selected.slug}`} className={styles.heroH1}>
              {selected.title}
            </Link>
          </div>

          <div className={styles.heroRight} aria-label="Обрати головне фото">
            <div className={styles.heroPickerTitle}>Головні новини</div>

            <div className={styles.heroPickerList}>
              {candidates.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.heroPickBtn} ${
                    item.slug === selected.slug ? styles.heroPickBtnActive : ""
                  }`}
                  onClick={() => setSelectedSlug(item.slug)}
                >
                  <span className={styles.heroPickTitle}>{item.title}</span>
                  <span className={styles.heroPickMeta}>{formatDate(item.published_at)}</span>
                </button>
              ))}
            </div>

            <Link href="/events" className={styles.eventsCta}>
              Меню заходів
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}