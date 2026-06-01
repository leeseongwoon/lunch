export const RESTAURANTS_COLLECTION = 'restaurants';

export const FOOD_TAGS = [
  '한식',
  '일식',
  '중식',
  '분식',
  '경양식',
  '도시락',
  '기타',
] as const;

export type FoodTag = (typeof FOOD_TAGS)[number];
