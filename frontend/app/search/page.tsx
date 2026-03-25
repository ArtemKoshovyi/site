import Link from "next/link";
import styles from "../page.module.css";
import { searchNews } from "@/lib/directus";

type Props = {
  searchParams?: { q?: string } | Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await Promise.resolve(searchParams);
  const q = (sp?.q ?? "").trim();
  const results = q ? await searchNews(q) : [];

  return (
    <main style={{ padding: "24px 0" }}>
      <div className={styles.container}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Пошук</h1>

        
        <form
          action="/search"
          method="GET"
          style={{ display: "flex", gap: 12, marginBottom: 24 }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Введи запит, наприклад: Одеса"
            style={{
              flex: 1,
              height: 44,
              padding: "0 14px",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--surface)",
              color: "var(--ink)",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 10,
              background: "var(--ink)",
              color: "var(--bg)",
              border: "1px solid var(--ink)",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            шукати
          </button>
        </form>

        {!q && <p style={{ opacity: 0.7 }}>Введи запит, щоб знайти новини</p>}

        {q && results.length === 0 && (
          <p style={{ opacity: 0.7 }}>Нічого не знайдено за запитом “{q}”</p>
        )}

        {results.length > 0 && (
          <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
            {results.map((item) => (
              <li key={item.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                <Link
                  href={`/news/${item.slug}`}
                  style={{ fontWeight: 800, textDecoration: "none" }}
                >
                  {item.title}
                </Link>

                {item.excerpt && <p style={{ marginTop: 6, opacity: 0.75 }}>{item.excerpt}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}