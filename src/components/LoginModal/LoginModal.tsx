import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (email: string, password: string) => void | Promise<void>;
}

export default function LoginModal({
  open,
  loading,
  error,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setEmail('');
    setPassword('');
    const timer = setTimeout(() => emailRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    void onSubmit(email, password);
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="login-title">
        <h2 id="login-title" className={styles.title}>
          관리자 로그인
        </h2>
        <p className={styles.subtitle}>식당 추가·수정·삭제는 로그인 후에만 가능합니다.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="login-email">아이디 (이메일)</label>
            <input
              ref={emailRef}
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose} disabled={loading}>
              취소
            </button>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? '확인 중…' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
