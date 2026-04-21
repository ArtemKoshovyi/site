import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { assetUrl, getNewsByCategory, getCategoryBySlug, type NewsItem } from "@/lib/directus";
import Header from "../../components/Header";
import { getCategories } from "@/lib/directus";

function formatUkDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  // safe resolve params (covers some edge cases / different next versions)
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = decodeURIComponent(resolvedParams.slug);

  const category = await getCategoryBySlug(slug);
  const categories = await getCategories();

  if (!category) {
    notFound();
  }

  const news = await getNewsByCategory(slug);

  // sidebar: take a few items with images first, then fall back to any
  const sidebarItems =
    news.filter((n) => !!n.cover_image).slice(0, 5).length > 0
      ? news.filter((n) => !!n.cover_image).slice(0, 5)
      : news.slice(0, 5);

  return (
    <div className={styles.page}>
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
        
        </nav>

        <header className={styles.categoryHero}>
          <h1 className={styles.categoryTitle}>{category.name}</h1>
          {category.description ? (
            <p className={styles.categoryDesc}>{category.description}</p>
          ) : null}
        </header>
      </div>

      <div className={styles.main}>
        <section className={styles.feed}>

          {news.length === 0 ? (
            <div className={styles.emptyState}>
              <p>У цій категорії поки немає новин</p>
              <p className={styles.emptyHint}>
                перевір у directus: у новин має бути вибрана ця категорія і статус published
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {news.map((item: NewsItem) => {
                const dateLabel = formatUkDate((item as any).published_at);
                return (
                  <article key={item.id} className={styles.card}>
                    <div className={styles.cardBody}>
                      {dateLabel ? <span className={styles.meta}>{dateLabel}</span> : null}

                      <h3 className={styles.title}>
                        <Link className={styles.titleLink} href={`/news/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      {item.excerpt ? <p className={styles.excerpt}>{item.excerpt}</p> : null}
                    </div>

                    {item.cover_image ? (
                      <div className={styles.cardMedia}>
                        <img
                          className={styles.cardImg}
                          src={assetUrl(item.cover_image) || ""}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className={styles.cardMedia} aria-hidden="true" />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>важливо</h3>

          <div className={styles.featuredList}>
            {sidebarItems.map((item: NewsItem) => {
              const dateLabel = formatUkDate((item as any).published_at);
              return (
                <Link key={item.id} className={styles.featuredItem} href={`/news/${item.slug}`}>
                  <div className={styles.featuredMedia}>
                    {item.cover_image ? (
                      <img
                        className={styles.featuredImg}
                        src={assetUrl(item.cover_image) || ""}
                        alt=""
                        loading="lazy"
                      />
                    ) : null}

                    <div className={styles.featuredOverlay}>
                      {dateLabel ? <span className={styles.featuredTime}>{dateLabel}</span> : null}
                      <span className={styles.featuredTitle}>{item.title}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
   </div>

  );
}