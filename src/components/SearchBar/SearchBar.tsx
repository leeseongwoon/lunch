import type { FoodTag } from '../../constants';
import TagSelect from './TagSelect.tsx';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  tag: FoodTag | '';
  onTagChange: (tag: FoodTag | '') => void;
  filteredCount: number;
  totalCount: number;
}

export default function SearchBar({
  value,
  onChange,
  tag,
  onTagChange,
  filteredCount,
  totalCount,
}: SearchBarProps) {
  const trimmed = value.trim();
  const isFiltering = trimmed.length > 0 || tag !== '';
  const noResults = isFiltering && filteredCount === 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <TagSelect value={tag} onChange={onTagChange} />

        <div className={styles.searchGroup}>
          <label className={styles.searchLabel} htmlFor="restaurant-search">
            맛집 검색
          </label>
          <div className={styles.inputRow}>
            <span className={styles.icon} aria-hidden>
              🔍
            </span>
            <input
              id="restaurant-search"
              type="search"
              className={styles.input}
              placeholder="이름, 종류, 메뉴로 검색"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {value.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => onChange('')}
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      {isFiltering && (
        <p className={`${styles.meta} ${noResults ? styles.metaEmpty : ''}`}>
          {noResults
            ? tag
              ? `"${tag}"${trimmed ? ` · "${trimmed}"` : ''}에 맞는 맛집이 없습니다`
              : `"${trimmed}"에 맞는 맛집이 없습니다`
            : `${filteredCount}곳 / 전체 ${totalCount}곳`}
        </p>
      )}
    </div>
  );
}
