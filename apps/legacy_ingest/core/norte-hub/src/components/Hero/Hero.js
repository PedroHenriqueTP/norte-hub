import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section id="hero" className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    URBAN<br /><span className={styles.highlight}>HUB</span>
                </h1>
                <p className={styles.subtitle}>
                    CENTRO DE CONEXÃO E<br />DIRECIONAMENTO
                </p>
            </div>
            <div className={styles.scrollIndicator}>
                SCROLL DOWN
            </div>
        </section>
    );
}
