import FeatureCard from './FeatureCard';

export default function FeatureGrid({ features, columns = 3, className = '' }) {
  const colClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${colClass} gap-6 sm:gap-8 ${className}`}>
      {features.map((feature, idx) => (
        <FeatureCard key={feature.id || idx} feature={feature} index={idx} />
      ))}
    </div>
  );
}
