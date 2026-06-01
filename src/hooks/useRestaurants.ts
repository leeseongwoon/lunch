import { useCallback, useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  addRestaurant,
  deleteRestaurant,
  subscribeRestaurants,
  updateRestaurant,
} from '../lib/restaurants';
import type { Restaurant, RestaurantInput } from '../types/restaurant';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError(
        import.meta.env.PROD
          ? 'Firebase 설정이 배포 빌드에 포함되지 않았습니다. GitHub Actions Secrets에 VITE_FIREBASE_* 값을 등록한 뒤 다시 배포해주세요.'
          : 'Firebase 환경 변수가 설정되지 않았습니다. 프로젝트 루트의 .env 파일을 확인한 뒤 개발 서버를 다시 실행해주세요.',
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      return subscribeRestaurants(
        (data) => {
          if (!cancelled) {
            setRestaurants(data);
            setLoading(false);
            setError(null);
          }
        },
        (message) => {
          if (!cancelled) {
            setError(message);
            setLoading(false);
          }
        },
      );
    };

    let unsubscribe: (() => void) | undefined;

    run().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const addOrUpdate = useCallback(async (input: RestaurantInput, id: string | null) => {
    if (id) {
      await updateRestaurant(id, input);
    } else {
      await addRestaurant(input);
    }
  }, []);

  const removeById = useCallback(async (id: string) => {
    await deleteRestaurant(id);
  }, []);

  return { restaurants, loading, error, addOrUpdate, removeById };
}
