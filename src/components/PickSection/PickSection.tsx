import { forwardRef } from 'react';
import type { Restaurant } from '../../types/restaurant';
import styles from './PickSection.module.css';

interface PickSectionProps {
  running: boolean;
  result: Restaurant | null;
  showResult: boolean;
  onPick: () => void;
}

const PickSection = forwardRef<HTMLElement, PickSectionProps>(function PickSection(
  { running, result, showResult, onPick },
  ref,
) {
  return (
    <section ref={ref} className={styles.section}>
      <button
        type="button"
        className={styles.pickBtn}
        onClick={onPick}
        disabled={running}
      >
        🎲 오늘의 점심 추첨하기
      </button>
      {result && (
        <div className={`${styles.resultBox} ${showResult ? styles.resultBoxShow : ''}`}>
          <div className={styles.resultEmoji}>{result.emoji || '🍽️'}</div>
          <div className={styles.resultLabel}>오늘의 점심 추천</div>
          <div className={styles.resultName}>{result.name}</div>
          <div className={styles.resultDivider} />
          <span className={styles.resultTag}>{result.tag}</span>
          <div className={styles.resultMenu}>
            {result.menus.map((menu) => (
              <div key={menu}>{menu}</div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default PickSection;
