import styles from './AddCard.module.css';

interface AddCardProps {
  visible: boolean;
  onClick: () => void;
}

export default function AddCard({ visible, onClick }: AddCardProps) {
  return (
    <button
      type="button"
      className={`${styles.cardAdd} ${visible ? styles.visible : ''}`}
      onClick={onClick}
      aria-label="식당 추가하기"
    >
      <div className={styles.icon}>＋</div>
      <div>식당 추가하기</div>
    </button>
  );
}
