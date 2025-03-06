import { Tag } from 'antd';
import type { ReactNode } from 'react';

interface TagSectionProps {
  items?: string[];
  label: ReactNode;
  color: string;
  className?: string;
}

export const TagSection = ({
  items,
  label,
  color,
  className = '',
}: TagSectionProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <strong>{label}</strong>
      {items.map((item) => (
        <Tag key={item} color={color}>
          {item}
        </Tag>
      ))}
    </div>
  );
};
