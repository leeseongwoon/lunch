import { forwardRef } from 'react';
import type { Restaurant } from '../../types/restaurant';
import styles from './RestaurantCard.module.css';

interface RestaurantCardProps {
  restaurant: Restaurant;
  editMode: boolean;
  highlighted: boolean;
  onDelete: () => void;
  onEdit: () => void;
}

const RestaurantCard = forwardRef<HTMLDivElement, RestaurantCardProps>(
  function RestaurantCard({ restaurant, editMode, highlighted, onDelete, onEdit }, ref) {
    const { name, emoji, tag, menus } = restaurant;

    return (
      <div
        ref={ref}
        className={[
          styles.card,
          editMode ? styles.editMode : styles.cardInteractive,
          highlighted ? styles.highlighted : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {editMode && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={onDelete}
            title="삭제"
            aria-label={`${name} 삭제`}
          >
            ×
          </button>
        )}
        <div className={styles.emoji}>{emoji || '🍽️'}</div>
        <div className={styles.name}>{name}</div>
        <span className={styles.tag}>{tag}</span>
        <div className={styles.menu}>
          {menus.map((menu) => (
            <div key={menu}>{menu}</div>
          ))}
        </div>
        {editMode && (
          <button type="button" className={styles.editBtn} onClick={onEdit}>
            ✏️ 수정
          </button>
        )}
      </div>
    );
  },
);

export default RestaurantCard;
