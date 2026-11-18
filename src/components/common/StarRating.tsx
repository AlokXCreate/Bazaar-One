import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, count, size = 14 }) => {
  return (
    <div className="inline-flex items-center gap-1 text-amber-500">
      <Star size={size} className="fill-amber-400 text-amber-500" />
      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-stone-400">({count})</span>
      )}
    </div>
  );
};
