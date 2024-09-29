import Image from "next/image";
import Link from "next/link";
import styles from "../styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Landsat Explorer</h1>
        <Image
          src="/landsat_image.jpeg"
          alt="Landsat satellite image"
          width={600}
          height={400}
          priority
        />
        <Link href="/login" className={styles.loginButton}>
          Login
        </Link>
      </main>
    </div>
  );
}
