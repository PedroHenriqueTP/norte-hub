import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Hub from '@/components/Hub/Hub';
import Footer from '@/components/Footer/Footer';
import InteractiveBackground from '@/components/Background/InteractiveBackground';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <InteractiveBackground />
      <Header />
      <Hero />
      <Hub />

      {/* Blog Placeholder Section */}
      <section id="blog" className={styles.sectionPlaceholder}>
        <h2>BLOG / NEWS</h2>
        <p>EM BREVE - CONTEÚDO URBANO</p>
      </section>

      {/* About Placeholder Section */}
      <section id="about" className={styles.sectionPlaceholder}>
        <h2>SOBRE NÓS</h2>
        <p>MANIFESTO URBANO</p>
      </section>

      <Footer />
    </main>
  );
}
