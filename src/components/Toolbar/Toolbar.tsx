import styles from './Toolbar.module.css';

interface ToolbarProps {
  editMode: boolean;
  isAdmin: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function Toolbar({ editMode, isAdmin, onToggle, onLogout }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {isAdmin && !editMode && (
        <>
          <span className={styles.adminBadge}>관리자 로그인됨</span>
          <button type="button" className={styles.logoutBtn} onClick={onLogout}>
            로그아웃
          </button>
        </>
      )}
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
