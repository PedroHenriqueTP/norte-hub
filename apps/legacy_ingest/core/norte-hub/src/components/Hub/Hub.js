import styles from './Hub.module.css';

const SITES = [
    {
        name: 'NORTE STORE',
        url: '#', // Placeholder
        description: 'Moda Urbana e Acessórios.',
        color: 'var(--neon-green)'
    },
    {
        name: 'BLOG',
        url: '#blog',
        description: 'Últimas novidades e cultura.',
        color: 'var(--neon-purple)'
    },
    {
        name: 'FUTURE SITE 1',
        url: '#',
        description: 'Em breve.',
        color: 'var(--neon-blue)'
    },
    {
        name: 'FUTURE SITE 2',
        url: '#',
        description: 'Em breve.',
        color: 'var(--neon-pink)'
    }
];

export default function Hub() {
    return (
        <section id="hub" className={styles.hub}>
            <h2 className={styles.sectionTitle}>ACESSO RÁPIDO</h2>
            <div className={styles.grid}>
                {SITES.map((site, index) => (
                    <a
                        key={index}
                        href={site.url}
                        className={styles.card}
                        style={{ '--hover-color': site.color }}
                    >
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{site.name}</h3>
                            <p className={styles.cardDesc}>{site.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
