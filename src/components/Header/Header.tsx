import styles from './Header.module.css';

interface HeaderProps {
  count: number;
}

export default function Header({ count }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.badge}>🍽️ 회사 근처 맛집 {count}곳</div>
      <h1 className={styles.title}>오늘 점심 어디가지?</h1>
      <p className={styles.subtitle}>버튼을 눌러 오늘의 점심을 추첨해보세요</p>
    </header>
  );
}
