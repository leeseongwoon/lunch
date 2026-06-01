import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { FOOD_TAGS, type FoodTag } from '../../constants';
import type { Restaurant, RestaurantInput } from '../../types/restaurant';
import styles from './RestaurantModal.module.css';

interface FormState {
  name: string;
  emoji: string;
  tag: FoodTag;
  menus: string;
}

const emptyForm: FormState = { name: '', emoji: '', tag: '한식', menus: '' };

interface RestaurantModalProps {
  open: boolean;
  editingId: string | null;
  restaurant: Restaurant | undefined;
  saving: boolean;
  onClose: () => void;
  onSave: (input: RestaurantInput, id: string | null) => void | Promise<void>;
}

export default function RestaurantModal({
  open,
  editingId,
  restaurant,
  saving,
  onClose,
  onSave,
}: RestaurantModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    if (editingId !== null && restaurant) {
      setForm({
        name: restaurant.name,
        emoji: restaurant.emoji || '',
        tag: restaurant.tag,
        menus: restaurant.menus.join(', '),
      });
    } else {
      setForm(emptyForm);
    }

    const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open, editingId, restaurant]);

  const handleSave = () => {
    if (saving) return;

    const name = form.name.trim();
    const emoji = form.emoji.trim() || '🍽️';
    const tag = form.tag;
    const menusRaw = form.menus.trim();

    if (!name) {
      alert('식당 이름을 입력해주세요.');
      return;
    }
    if (!menusRaw) {
      alert('메뉴를 입력해주세요.');
      return;
    }

    const menus = menusRaw
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    void onSave({ name, emoji, tag, menus }, editingId);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && !saving) handleSave();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className={styles.title}>
          {editingId !== null ? '식당 수정' : '식당 추가'}
        </h2>
        <div className={styles.field}>
          <label htmlFor="f-name">식당 이름 *</label>
          <input
            ref={nameInputRef}
            id="f-name"
            type="text"
            placeholder="예: 카츠진"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            disabled={saving}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="f-emoji">이모지</label>
          <input
            id="f-emoji"
            type="text"
            placeholder="예: 🍱"
            maxLength={4}
            value={form.emoji}
            onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
            disabled={saving}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="f-tag">음식 종류 *</label>
          <select
            id="f-tag"
            value={form.tag}
            onChange={(e) =>
              setForm((f) => ({ ...f, tag: e.target.value as FoodTag }))
            }
            disabled={saving}
          >
            {FOOD_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="f-menus">대표 메뉴 *</label>
          <input
            id="f-menus"
            type="text"
            placeholder="예: 설렁탕, 도가니탕"
            value={form.menus}
            onChange={(e) => setForm((f) => ({ ...f, menus: e.target.value }))}
            disabled={saving}
          />
          <div className={styles.hint}>쉼표(,)로 구분해서 입력하세요</div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose} disabled={saving}>
            취소
          </button>
          <button type="button" className={styles.save} onClick={handleSave} disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
