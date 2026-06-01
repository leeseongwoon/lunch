import type { RestaurantInput } from '../types/restaurant';

export const DEFAULT_RESTAURANTS: RestaurantInput[] = [
  { name: '카츠진', emoji: '🍱', tag: '일식', menus: ['일식카츠'] },
  { name: '팔육', emoji: '🥩', tag: '한식', menus: ['육회비빔밥', '고추장찌개 (점심특선)'] },
  { name: '취복루', emoji: '🥢', tag: '중식', menus: ['가지튀김덮밥'] },
  { name: '거구회관', emoji: '🍲', tag: '한식', menus: ['순두부찌개', '내장탕'] },
  { name: '명인설렁탕', emoji: '🥣', tag: '한식', menus: ['설렁탕'] },
  { name: '금자김밥', emoji: '🍙', tag: '분식', menus: ['다양한 김밥'] },
  { name: '토속골', emoji: '🍗', tag: '한식', menus: ['닭개장', '닭곰탕'] },
  {
    name: '소복식당',
    emoji: '🐟',
    tag: '한식',
    menus: ['고등어구이', '소고기 장터국밥', '삼겹정식', '고추장제육볶음 (점심특선)'],
  },
  { name: '한솥도시락', emoji: '🍱', tag: '도시락', menus: ['다양한 도시락'] },
  { name: '무공돈까스', emoji: '🍛', tag: '경양식', menus: ['경양식 돈까스', '분식'] },
  { name: '국수나무', emoji: '🍜', tag: '분식', menus: ['국수', '분식'] },
  {
    name: '산목',
    emoji: '🍝',
    tag: '중식',
    menus: ['중화국수', '볶음우동', '김치말이국수', '카레라이스'],
  },
  { name: '샤브로21', emoji: '🫕', tag: '일식', menus: ['1인 샤브샤브'] },
  { name: '두꺼비부대찌개', emoji: '🍲', tag: '한식', menus: ['부대찌개'] },
];
