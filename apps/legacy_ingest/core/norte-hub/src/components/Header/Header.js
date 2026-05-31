
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>EH A NORTE</div>
            <nav className={styles.nav}>
                <a href="#hero" className={styles.navLink}>HOME</a>
                <a href="#hub" className={styles.navLink}>HUB</a>
                <a href="#blog" className={styles.navLink}>BLOG</a>
                <a href="#about" className={styles.navLink}>SOBRE</a>
            </nav>
        </header>
    );
}
