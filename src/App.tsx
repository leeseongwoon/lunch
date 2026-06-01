import { useCallback, useRef, useState } from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';
import RestaurantGrid, {
  type RestaurantGridHandle,
} from './components/RestaurantGrid/RestaurantGrid';
import PickSection from './components/PickSection/PickSection';
import RestaurantModal from './components/RestaurantModal/RestaurantModal';
import Footer from './components/Footer/Footer';
import { useRestaurants } from './hooks/useRestaurants';
import { getFirestoreErrorHint } from './lib/errorHints';
import type { Restaurant, RestaurantInput } from './types/restaurant';

export default function App() {
  const { restaurants, loading, error, addOrUpdate, removeById } = useRestaurants();
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [pickResult, setPickResult] = useState<Restaurant | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  const lastPickRef = useRef(-1);
  const gridRef = useRef<RestaurantGridHandle>(null);
  const pickSectionRef = useRef<HTMLElement>(null);

  const openModal = useCallback((id: string | null = null) => {
    setEditingId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const name = restaurants.find((r) => r.id === id)?.name;
      if (!confirm(`"${name}"을(를) 삭제할까요?`)) return;
      try {
        await removeById(id);
      } catch (e) {
        alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
      }
    },
    [restaurants, removeById],
  );

  const handleSave = useCallback(
    async (input: RestaurantInput, id: string | null) => {
      setSaving(true);
      try {
        await addOrUpdate(input, id);
        closeModal();
      } catch (e) {
        alert(e instanceof Error ? e.message : '저장에 실패했습니다.');
      } finally {
        setSaving(false);
      }
    },
    [addOrUpdate, closeModal],
  );

  const pickRandom = useCallback(() => {
    if (running || restaurants.length === 0) return;

    setRunning(true);
    setShowResult(false);
    setPickResult(null);

    let count = 0;
    const total = 20;

    const tick = () => {
      const current = Math.floor(Math.random() * restaurants.length);
      setHighlightedIndex(current);
      count++;

      if (count >= total) {
        let pick = Math.floor(Math.random() * restaurants.length);
        if (restaurants.length > 1) {
          while (pick === lastPickRef.current) {
            pick = Math.floor(Math.random() * restaurants.length);
          }
        }
        lastPickRef.current = pick;

        setHighlightedIndex(pick);
        gridRef.current?.scrollToCard(pick);

        setPickResult(restaurants[pick]);
        setShowResult(true);
        setRunning(false);

        setTimeout(() => {
          pickSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
        return;
      }

      setTimeout(tick, count < 12 ? 80 : 140);
    };

    tick();
  }, [running, restaurants]);

  const editingRestaurant = editingId
    ? restaurants.find((r) => r.id === editingId)
    : undefined;

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.status}>맛집 목록을 불러오는 중…</p>
      </div>
    );
  }

  if (error) {
    const hint = getFirestoreErrorHint(error);
    return (
      <div className={styles.container}>
        <p className={styles.statusError}>{error}</p>
        {hint && <p className={styles.statusHint}>{hint}</p>}
        {error.toLowerCase().includes('permission') && (
          <pre className={styles.rulesSnippet}>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read, write: if true;
    }
  }
}`}</pre>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header count={restaurants.length} />
      <Toolbar editMode={editMode} onToggle={() => setEditMode((v) => !v)} />
      <RestaurantGrid
        ref={gridRef}
        restaurants={restaurants}
        editMode={editMode}
        highlightedIndex={highlightedIndex}
        onAdd={() => openModal(null)}
        onEdit={openModal}
        onDelete={handleDelete}
      />
      <PickSection
        ref={pickSectionRef}
        running={running}
        result={pickResult}
        showResult={showResult}
        onPick={pickRandom}
      />
      <Footer />

      <RestaurantModal
        open={modalOpen}
        editingId={editingId}
        restaurant={editingRestaurant}
        saving={saving}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
