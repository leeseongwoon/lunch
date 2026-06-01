import styles from './Toolbar.module.css';

interface ToolbarProps {
  editMode: boolean;
  onToggle: () => void;
}

export default function Toolbar({ editMode, onToggle }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={`${styles.editBtn} ${editMode ? styles.editBtnActive : ''}`}
        onClick={onToggle}
      >
        {editMode ? '✅ 편집 완료' : '✏️ 편집하기'}
      </button>
    </div>
  );
}
