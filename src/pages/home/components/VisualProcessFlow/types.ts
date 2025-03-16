import type { EdgeTypes, Node, NodeTypes } from '@xyflow/react';
import { PositionLoggerNode } from './PositionLoggerNode';

export type PositionLoggerNodeData = Node<
  {
    label: string;
    description?: string;
    inputs?: string[];
    outputs?: string[];
    assignedUsers?: string[];
    color?: string;
    deadline?: string;
    approvalCriteria?: string;
    priority?: string;
    notifyUsers?: string[];
  },
  'position-logger'
>;

export type AppNode = PositionLoggerNodeData;

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
} satisfies NodeTypes;

// Define custom edge types if needed
export const edgeTypes = {} satisfies EdgeTypes;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'warning' | 'error';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}
