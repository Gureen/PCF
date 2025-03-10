import type { Edge } from '@xyflow/react';
import type { AppNode } from './types';

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    position: { x: 0, y: 0 },
    data: { label: 'Content Creation' },
    style: { backgroundColor: '#6ede87', color: 'white' },
  },
  {
    id: 'b',
    position: { x: 0, y: 100 },
    data: { label: 'Editorial Review' },
    style: { backgroundColor: '#ff0072', color: 'white' },
  },
  {
    id: 'c',
    position: { x: 0, y: 200 },
    data: { label: 'Legal Review' },
    style: { backgroundColor: '#6865A5', color: 'white' },
  },
];

export const initialEdges = [
  { id: 'a->b', source: 'a', target: 'b', animated: true },
  { id: 'b->c', source: 'b', target: 'c', animated: true },
  { id: 'c->d', source: 'c', target: 'd', animated: true },
] satisfies Edge[];
