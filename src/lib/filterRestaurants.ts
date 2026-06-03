import type { FoodTag } from '../constants';
import type { Restaurant } from '../types/restaurant';

export function filterRestaurants(
  restaurants: Restaurant[],
  query: string,
  tag: FoodTag | '',
): Restaurant[] {
  let result = tag ? restaurants.filter((r) => r.tag === tag) : restaurants;

  const q = query.trim().toLowerCase();
  if (!q) return result;

  return result.filter((restaurant) => {
    if (restaurant.name.toLowerCase().includes(q)) return true;
    if (restaurant.tag.toLowerCase().includes(q)) return true;
    return restaurant.menus.some((menu) => menu.toLowerCase().includes(q));
  });
}
