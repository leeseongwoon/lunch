import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { RESTAURANTS_COLLECTION } from '../constants';
import { DEFAULT_RESTAURANTS } from '../data/defaultRestaurants';
import { db, isFirebaseConfigured } from './firebase';
import type { Restaurant, RestaurantInput } from '../types/restaurant';
import type { FoodTag } from '../constants';

function parseRestaurantDoc(snapshot: QueryDocumentSnapshot<DocumentData>): Restaurant {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: String(data.name ?? ''),
    emoji: String(data.emoji ?? '🍽️'),
    tag: data.tag as FoodTag,
    menus: Array.isArray(data.menus) ? data.menus.map(String) : [],
  };
}

function restaurantsCollection() {
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  return collection(db, RESTAURANTS_COLLECTION);
}

export function subscribeRestaurants(
  onData: (restaurants: Restaurant[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  if (!isFirebaseConfigured() || !db) {
    onError(
      import.meta.env.PROD
        ? 'Firebase 설정이 배포 빌드에 포함되지 않았습니다.'
        : 'Firebase 환경 변수가 설정되지 않았습니다.',
    );
    return () => {};
  }

  const q = query(restaurantsCollection(), orderBy('name'));

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(parseRestaurantDoc));
    },
    (error) => {
      onError(error.message);
    },
  );
}

export async function seedDefaultRestaurantsIfEmpty(): Promise<void> {
  if (!db) return;

  const snapshot = await getDocs(restaurantsCollection());
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  for (const restaurant of DEFAULT_RESTAURANTS) {
    const ref = doc(restaurantsCollection());
    batch.set(ref, {
      name: restaurant.name,
      emoji: restaurant.emoji,
      tag: restaurant.tag,
      menus: restaurant.menus,
    });
  }
  await batch.commit();
}

export async function addRestaurant(input: RestaurantInput): Promise<void> {
  await addDoc(restaurantsCollection(), input);
}

export async function updateRestaurant(id: string, input: RestaurantInput): Promise<void> {
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  await updateDoc(doc(db, RESTAURANTS_COLLECTION, id), { ...input });
}

export async function deleteRestaurant(id: string): Promise<void> {
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  await deleteDoc(doc(db, RESTAURANTS_COLLECTION, id));
}
