import type { Edge, EdgeTypes } from '@xyflow/react';

export const initialEdges = [
  { id: 'a->b', source: 'a', target: 'b', animated: true },
  { id: 'b->c', source: 'b', target: 'c', animated: true },
  { id: 'c->d', source: 'c', target: 'd', animated: true },
] satisfies Edge[];

export const edgeTypes = {} satisfies EdgeTypes;
