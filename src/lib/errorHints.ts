export function getFirestoreErrorHint(message: string): string | null {
  const lower = message.toLowerCase();

  if (lower.includes('permission') || lower.includes('insufficient')) {
    return [
      'Firestore 보안 규칙이 읽기/쓰기를 막고 있습니다.',
      'Firebase Console → Firestore → 규칙 탭에서 아래 규칙을 붙여넣고 「게시」를 눌러주세요.',
      '프로젝트의 firestore.rules 파일 내용과 동일합니다.',
    ].join(' ');
  }

  if (
    lower.includes('환경 변수') ||
    lower.includes('.env') ||
    lower.includes('secrets') ||
    lower.includes('배포 빌드')
  ) {
    return import.meta.env.PROD
      ? 'GitHub → leeseongwoon/lunch → Settings → Secrets and variables → Actions 에서 .env 와 동일한 6개 VITE_FIREBASE_* Secret 을 만든 뒤, Actions 를 Re-run 하거나 main 에 다시 push 하세요.'
      : '프로젝트 루트의 .env 파일을 확인한 뒤 npm run dev 를 다시 실행해주세요.';
  }

  return null;
}
