import type { BuiltInNode, EdgeTypes, Node, NodeTypes } from '@xyflow/react';
import { PositionLoggerNode } from './PositionLoggerNode';

export type PositionLoggerNodeData = Node<
  {
    label?: string;
  },
  'position-logger'
>;

export type AppNode = BuiltInNode | PositionLoggerNodeData;

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
} satisfies NodeTypes;

export const edgeTypes = {} satisfies EdgeTypes;
