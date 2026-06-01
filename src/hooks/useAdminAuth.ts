import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { getAuthErrorMessage } from '../lib/authErrors';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setAuthLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth가 초기화되지 않았습니다.');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      const code = e && typeof e === 'object' && 'code' in e ? String(e.code) : '';
      throw new Error(getAuthErrorMessage(code));
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  return {
    user,
    isAdmin: Boolean(user),
    authLoading,
    signIn,
    signOut,
  };
}
