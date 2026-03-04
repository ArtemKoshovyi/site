import Link from "next/link";
import styles from "./news.module.css";
import { assetUrl, getNewsBySlug } from "../../../lib/directus";

function formatDate(value?: string | null) {
  if (!value) return "";
  // Добавлена настройка локали для корректного отображения даты
  return new Date(value).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const slug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : null;

  if (!slug) {
    return (
      <div className={styles.container}>
        <p>Адресу новини не вказано.</p>
      </div>
    );
  }

  const item = await getNewsBySlug(slug);

  if (!item) {
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Новину не знайдено</h1>
        <p>Запитувана сторінка "{slug}" відсутня або була видалена.</p>
        <Link href="/" className={styles.back}>← Повернутися до списку новин</Link>
      </div>
    );
  }

  const img = assetUrl(item.cover_image);

  return (
    <article className={styles.container}>

      <header>
        <h1 className={styles.h1}>{item.title}</h1>
        <div className={styles.meta}>{formatDate(item.published_at)}</div>
      </header>

      {img && (
        <div className={styles.imageWrapper}>
          <img className={styles.cover} src={img} alt={item.title ?? ""} />
        </div>
      )}

      {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}

      <hr className={styles.divider} />

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
      />
    </article>
  );
}