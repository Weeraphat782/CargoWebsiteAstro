type ServiceIconId = 'air' | 'customs' | 'warehouse' | 'cold' | 'flask';

const paths: Record<ServiceIconId, (string | { circle: [number, number, number] })[]> = {
  air: ['M21 12l-9 3-9-3 4-2 5 1 5-4 2 1-3 3z'],
  customs: ['M12 3l7 3v6c0 4-3 6.6-7 8-4-1.4-7-4-7-8V6z', 'M9 12l2 2 4-4'],
  warehouse: ['M3 21V9l9-5 9 5v12', 'M3 21h18M9 21v-6h6v6'],
  cold: ['M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3', 'M4 8l16 8M4 16l16-8'],
  flask: ['M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4A2 2 0 0019 18l-5-9V3'],
};

interface ServiceIconProps {
  id: ServiceIconId;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function ServiceIcon({ id, className, size = 18, strokeWidth = 1.85 }: ServiceIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[id].map((d, i) =>
        typeof d === 'string' ? (
          <path key={i} d={d} />
        ) : (
          <circle key={i} cx={d.circle[0]} cy={d.circle[1]} r={d.circle[2]} />
        ),
      )}
    </svg>
  );
}

export type { ServiceIconId };
