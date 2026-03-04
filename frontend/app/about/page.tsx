import { notFound } from "next/navigation";
import styles from "./about.module.css";
import { getPage } from "@/lib/directus";

export default async function AboutPage() {
  const page = await getPage();

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <main className={styles.container}>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />
    </main>
  );
}