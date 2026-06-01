import { useCallback, useEffect, useRef, useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  addRestaurant,
  deleteRestaurant,
  seedDefaultRestaurantsIfEmpty,
  subscribeRestaurants,
  updateRestaurant,
} from '../lib/restaurants';
import type { Restaurant, RestaurantInput } from '../types/restaurant';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError('Firebase 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        if (!seededRef.current) {
          seededRef.current = true;
          await seedDefaultRestaurantsIfEmpty();
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '초기 데이터를 불러오지 못했습니다.');
          setLoading(false);
        }
        return;
      }

      if (cancelled) return;

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
