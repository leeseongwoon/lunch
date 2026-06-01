export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return '올바른 이메일 형식이 아닙니다.';
    case 'auth/user-disabled':
      return '비활성화된 계정입니다.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '아이디 또는 비밀번호가 올바르지 않습니다.';
    case 'auth/too-many-requests':
      return '시도 횟수가 많습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '로그인에 실패했습니다.';
  }
}
