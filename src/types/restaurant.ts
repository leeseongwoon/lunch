import type { FoodTag } from '../constants';

export interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  tag: FoodTag;
  menus: string[];
}

export type RestaurantInput = Omit<Restaurant, 'id'>;
