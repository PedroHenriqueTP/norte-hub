import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <p>&copy; 2026 EH A NORTE. TODOS OS DIREITOS RESERVADOS.</p>
                <div className={styles.socials}>
                    <a href="#">INSTAGRAM</a>
                    <span>/</span>
                    <a href="#">TWITTER</a>
                    <span>/</span>
                    <a href="#">LINKEDIN</a>
                </div>
            </div>
        </footer>
    );
}
