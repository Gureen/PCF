import type { EdgeTypes, Node, NodeTypes } from '@xyflow/react';
import { PositionLoggerNode } from './PositionLoggerNode';

/**
 * Type definition for the data structure of position logger nodes
 * Extends the base Node type from React Flow with custom data properties
 */
export type PositionLoggerNodeData = Node<
  {
    /** Name of the activity */
    label: string;
    /** Optional description of the activity */
    description?: string;
    /** Optional array of input dependencies */
    inputs?: string[];
    /** Optional array of output connections */
    outputs?: string[];
    /** Optional array of users assigned to this activity */
    assignedUsers?: string[];
    /** Optional background color for the node */
    color?: string;
    /** Optional deadline date string */
    deadline?: string;
    /** Optional criteria for approval */
    approvalCriteria?: string;
    /** Optional priority level */
    priority?: string;
  },
  'position-logger'
>;

/**
 * Union type of all node types used in the application
 * Currently only includes PositionLoggerNodeData
 */
export type AppNode = PositionLoggerNodeData;

/**
 * Registry of available node types for React Flow
 * Maps type names to the corresponding React components
 */
export const nodeTypes = {
  'position-logger': PositionLoggerNode,
} satisfies NodeTypes;

/**
 * Registry of available edge types for React Flow
 * Currently empty but prepared for custom edge types
 */
export const edgeTypes = {} satisfies EdgeTypes;

/**
 * Interface for validation results returned by flow validation functions
 */
export interface ValidationResult {
  /** Indicates if the flow is valid */
  isValid: boolean;
  /** Array of validation errors found in the flow */
  errors: ValidationError[];
}

/**
 * Interface for individual validation errors in flow validation
 */
export interface ValidationError {
  /** Type of validation issue: warning or error */
  type: 'warning' | 'error';
  /** Description of the validation issue */
  message: string;
  /** Optional IDs of nodes associated with this error */
  nodeIds?: string[];
  /** Optional IDs of edges associated with this error */
  edgeIds?: string[];
}
