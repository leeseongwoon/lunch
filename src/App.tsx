import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header.tsx';
import Toolbar from './components/Toolbar/Toolbar.tsx';
import RestaurantGrid, {
  type RestaurantGridHandle,
} from './components/RestaurantGrid/RestaurantGrid.tsx';
import PickSection from './components/PickSection/PickSection.tsx';
import RestaurantModal from './components/RestaurantModal/RestaurantModal.tsx';
import LoginModal from './components/LoginModal/LoginModal.tsx';
import Footer from './components/Footer/Footer.tsx';
import { useRestaurants } from './hooks/useRestaurants';
import { useAdminAuth } from './hooks/useAdminAuth';
import { getFirestoreErrorHint } from './lib/errorHints';
import { setAnalyticsUserId, trackEvent } from './lib/analytics';
import { seedDefaultRestaurantsIfEmpty } from './lib/restaurants';
import type { Restaurant, RestaurantInput } from './types/restaurant';

export default function App() {
  const { restaurants, loading, error, addOrUpdate, removeById } = useRestaurants();
  const { user, isAdmin, signIn, signOut } = useAdminAuth();
  const [editMode, setEditMode] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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

  useEffect(() => {
    setAnalyticsUserId(user?.uid ?? null);
  }, [user?.uid]);

  const openModal = useCallback(
    (id: string | null = null) => {
      if (!user) return;
      setEditingId(id);
      setModalOpen(true);
    },
    [user],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  const handleToggleEdit = useCallback(() => {
    if (editMode) {
      setEditMode(false);
      return;
    }
    if (!user) {
      setLoginError(null);
      setLoginOpen(true);
      return;
    }
    setEditMode(true);
    trackEvent('edit_mode_enter');
  }, [editMode, user]);

  const handleLogout = useCallback(async () => {
    if (editMode) setEditMode(false);
    closeModal();
    await signOut();
    trackEvent('admin_logout');
  }, [editMode, signOut, closeModal]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginLoading(true);
      setLoginError(null);
      try {
        await signIn(email, password);
        await seedDefaultRestaurantsIfEmpty();
        trackEvent('admin_login');
        setLoginOpen(false);
        setEditMode(true);
      } catch (e) {
        setLoginError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
      } finally {
        setLoginLoading(false);
      }
    },
    [signIn],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!user) return;
      const name = restaurants.find((r) => r.id === id)?.name;
      if (!confirm(`"${name}"을(를) 삭제할까요?`)) return;
      try {
        await removeById(id);
        trackEvent('restaurant_delete', { restaurant_name: name ?? '' });
      } catch (e) {
        alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
      }
    },
    [restaurants, removeById, user],
  );

  const handleSave = useCallback(
    async (input: RestaurantInput, id: string | null) => {
      if (!user) return;
      setSaving(true);
      try {
        await addOrUpdate(input, id);
        trackEvent(id ? 'restaurant_update' : 'restaurant_add', {
          restaurant_name: input.name,
          food_tag: input.tag,
        });
        closeModal();
      } catch (e) {
        alert(e instanceof Error ? e.message : '저장에 실패했습니다.');
      } finally {
        setSaving(false);
      }
    },
    [addOrUpdate, closeModal, user],
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

        const picked = restaurants[pick];
        setPickResult(picked);
        setShowResult(true);
        setRunning(false);
        trackEvent('lunch_pick', {
          restaurant_name: picked.name,
          food_tag: picked.tag,
          restaurant_count: restaurants.length,
        });

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
      allow read: if true;
      allow create, update, delete: if request.auth != null;
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
      <Toolbar
        editMode={editMode}
        isAdmin={isAdmin}
        onToggle={handleToggleEdit}
        onLogout={handleLogout}
      />
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

      <LoginModal
        open={loginOpen}
        loading={loginLoading}
        error={loginError}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleLogin}
      />

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
