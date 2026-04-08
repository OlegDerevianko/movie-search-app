import { SkeletonCard } from './SkeletonCard';

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="movies-grid skeleton-grid">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
};