import type { BuiltInNode, Node, NodeTypes } from '@xyflow/react';
import { PositionLoggerNode } from './PositionLoggerNode';

export type PositionLoggerNodeData = Node<
  {
    label?: string;
  },
  'position-logger'
>;

export type AppNode = BuiltInNode | PositionLoggerNodeData;

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    type: 'input',
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

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
} satisfies NodeTypes;
