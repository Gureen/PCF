import type { BuiltInNode, EdgeTypes, Node, NodeTypes } from '@xyflow/react';
import { ActivityNode } from './ActivityNode';
import { PositionLoggerNode } from './PositionLoggerNode';

export type PositionLoggerNodeData = Node<
  {
    label?: string;
  },
  'position-logger'
>;

export type ActivityNodeData = Node<
  {
    label: string;
    description?: string;
    inputs?: string[];
    outputs?: string[];
  },
  'activity'
>;

export type AppNode = BuiltInNode | PositionLoggerNodeData | ActivityNodeData;

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  activity: ActivityNode,
} satisfies NodeTypes;

// Define custom edge types if needed
export const edgeTypes = {} satisfies EdgeTypes;
