export function getFirestoreErrorHint(message: string): string | null {
  const lower = message.toLowerCase();

  if (lower.includes('permission') || lower.includes('insufficient')) {
    return [
      'Firestore 보안 규칙이 읽기/쓰기를 막고 있습니다.',
      'Firebase Console → Firestore → 규칙 탭에서 아래 규칙을 붙여넣고 「게시」를 눌러주세요.',
      '프로젝트의 firestore.rules 파일 내용과 동일합니다.',
    ].join(' ');
  }

  if (lower.includes('환경 변수') || lower.includes('.env')) {
    return '프로젝트 루트의 .env 파일을 확인한 뒤 개발 서버를 다시 실행해주세요.';
  }

  return null;
}
