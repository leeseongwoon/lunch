export const RESTAURANTS_COLLECTION = 'restaurants';

export const FOOD_TAGS = [
  '한식',
  '일식',
  '중식',
  '분식',
  '양식',
  '경양식',
  '도시락',
  '아시안',
  '기타',
] as const;

export type FoodTag = (typeof FOOD_TAGS)[number];
