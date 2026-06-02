import {
  getAnalytics,
  isSupported,
  logEvent,
  setUserId,
  type Analytics,
  type EventParams,
} from 'firebase/analytics';
import { app, isFirebaseConfigured } from './firebase';

let analytics: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!isFirebaseConfigured() || !app) return null;
  if (analytics) return analytics;
  if (!initPromise) {
    initPromise = isSupported().then((supported) => {
      if (!supported || !app) return null;
      analytics = getAnalytics(app);
      return analytics;
    });
  }
  return initPromise;
}

export function initAnalytics(): Promise<Analytics | null> {
  return getAnalyticsInstance();
}

export function trackEvent(eventName: string, params?: EventParams): void {
  void getAnalyticsInstance().then((instance) => {
    if (instance) logEvent(instance, eventName, params);
  });
}

export function trackPageView(): void {
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}

export function setAnalyticsUserId(userId: string | null): void {
  void getAnalyticsInstance().then((instance) => {
    if (!instance) return;
    setUserId(instance, userId ?? null);
  });
}
