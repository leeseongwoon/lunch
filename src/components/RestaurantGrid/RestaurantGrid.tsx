import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import AddCard from '../AddCard/AddCard';
import type { Restaurant } from '../../types/restaurant';
import styles from './RestaurantGrid.module.css';

export interface RestaurantGridHandle {
  scrollToCard: (index: number) => void;
}

interface RestaurantGridProps {
  restaurants: Restaurant[];
  editMode: boolean;
  highlightedIndex: number;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RestaurantGrid = forwardRef<RestaurantGridHandle, RestaurantGridProps>(
  function RestaurantGrid(
    { restaurants, editMode, highlightedIndex, onAdd, onEdit, onDelete },
    ref,
  ) {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      scrollToCard(index: number) {
        cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      },
    }));

    useEffect(() => {
      cardRefs.current = cardRefs.current.slice(0, restaurants.length);
    }, [restaurants.length]);

    return (
      <div className={styles.grid}>
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            restaurant={restaurant}
            editMode={editMode}
            highlighted={highlightedIndex === index}
            onDelete={() => onDelete(restaurant.id)}
            onEdit={() => onEdit(restaurant.id)}
          />
        ))}
        <AddCard visible={editMode} onClick={onAdd} />
      </div>
    );
  },
);

export default RestaurantGrid;
