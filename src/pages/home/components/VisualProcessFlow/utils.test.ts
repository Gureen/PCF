import type { Activity } from '@/interfaces';
import type { Edge } from '@xyflow/react';
import type { MessageInstance } from 'antd/es/message/interface';
import {
  calculateNodePositions,
  detectCircularDependencies,
  findActivityById,
  generateEdgesFromActivities,
  updateActivityPosition,
  validateConnectionLimits,
} from './utils';

describe('detectCircularDependencies', () => {
  it('should return false when no dependencies exist', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }];
    const edges: Edge[] = [];
    expect(detectCircularDependencies(nodes, edges)).toBe(false);
  });

  it('should return false for linear dependencies', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const edges: Edge[] = [
      { id: 'e-A-B', source: 'A', target: 'B' },
      { id: 'e-B-C', source: 'B', target: 'C' },
    ];
    expect(detectCircularDependencies(nodes, edges)).toBe(false);
  });

  it('should return true for circular dependencies', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const edges: Edge[] = [
      { id: 'e-A-B', source: 'A', target: 'B' },
      { id: 'e-B-C', source: 'B', target: 'C' },
      { id: 'e-C-A', source: 'C', target: 'A' },
    ];
    expect(detectCircularDependencies(nodes, edges)).toBe(true);
  });

  it('should return true for indirect circular dependencies', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
    const edges: Edge[] = [
      { id: 'e-A-B', source: 'A', target: 'B' },
      { id: 'e-B-C', source: 'B', target: 'C' },
      { id: 'e-C-D', source: 'C', target: 'D' },
      { id: 'e-D-A', source: 'D', target: 'A' },
    ];
    expect(detectCircularDependencies(nodes, edges)).toBe(true);
  });

  it('should handle isolated nodes correctly', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
    const edges: Edge[] = [
      { id: 'e-A-B', source: 'A', target: 'B' },
      // C and D are isolated
    ];
    expect(detectCircularDependencies(nodes, edges)).toBe(false);
  });
});

describe('generateEdgesFromActivities', () => {
  it('should generate no edges for empty activities', () => {
    const activities: Activity[] = [];
    expect(generateEdgesFromActivities(activities)).toEqual([]);
  });

  it('should generate no edges when no connections exist', () => {
    const activities: Activity[] = [
      { id: 'A', activityName: 'Activity A', inputs: [], outputs: [] },
      { id: 'B', activityName: 'Activity B', inputs: [], outputs: [] },
    ];
    expect(generateEdgesFromActivities(activities)).toEqual([]);
  });

  it('should generate correct edges based on inputs and outputs', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        inputs: [],
        outputs: ['B'],
      },
      {
        id: 'B',
        activityName: 'Activity B',
        inputs: ['A'],
        outputs: [],
      },
    ];

    const result = generateEdgesFromActivities(activities);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e-A-B');
    expect(result[0].source).toBe('A');
    expect(result[0].target).toBe('B');
    expect(result[0].type).toBe('smoothstep');
    expect(result[0].animated).toBe(true);
    expect(result[0].markerEnd).toBeDefined();
  });

  it('should handle multiple connections', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        inputs: [],
        outputs: ['B', 'C'],
      },
      {
        id: 'B',
        activityName: 'Activity B',
        inputs: ['A'],
        outputs: ['C'],
      },
      {
        id: 'C',
        activityName: 'Activity C',
        inputs: ['A', 'B'],
        outputs: [],
      },
    ];

    const result = generateEdgesFromActivities(activities);
    expect(result).toHaveLength(3);

    // Check for edge A->B
    expect(
      result.some(
        (edge) =>
          edge.id === 'e-A-B' && edge.source === 'A' && edge.target === 'B',
      ),
    ).toBe(true);

    // Check for edge A->C
    expect(
      result.some(
        (edge) =>
          edge.id === 'e-A-C' && edge.source === 'A' && edge.target === 'C',
      ),
    ).toBe(true);

    // Check for edge B->C
    expect(
      result.some(
        (edge) =>
          edge.id === 'e-B-C' && edge.source === 'B' && edge.target === 'C',
      ),
    ).toBe(true);
  });

  it('should handle activities referenced by id or name', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        inputs: [],
        outputs: ['Activity B'], // Using name instead of ID
      },
      {
        id: 'B',
        activityName: 'Activity B',
        inputs: ['Activity A'],
        outputs: [],
      },
    ];

    const result = generateEdgesFromActivities(activities);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e-A-B');
    expect(result[0].source).toBe('A');
    expect(result[0].target).toBe('B');
  });

  it('should prevent duplicate edges', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        inputs: [],
        outputs: ['B', 'B'], // Duplicate output
      },
      {
        id: 'B',
        activityName: 'Activity B',
        inputs: ['A', 'A'], // Duplicate input
        outputs: [],
      },
    ];

    const result = generateEdgesFromActivities(activities);
    expect(result).toHaveLength(1); // Should only create one edge
  });
});

describe('calculateNodePositions', () => {
  it('should position nodes correctly with existing positions', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        position: { x: 100, y: 200 },
      },
      {
        id: 'B',
        activityName: 'Activity B',
        position: { x: 300, y: 400 },
      },
    ];

    const result = calculateNodePositions(activities);

    expect(result).toHaveLength(2);
    expect(result[0].position).toEqual({ x: 100, y: 200 });
    expect(result[1].position).toEqual({ x: 300, y: 400 });
  });

  it('should generate new positions for nodes without positions', () => {
    const activities: Activity[] = [
      { id: 'A', activityName: 'Activity A' },
      { id: 'B', activityName: 'Activity B' },
    ];

    const result = calculateNodePositions(activities);

    expect(result).toHaveLength(2);
    expect(result[0].position).toBeDefined();
    expect(result[1].position).toBeDefined();

    // Positions should be different for each node
    expect(result[0].position).not.toEqual(result[1].position);
  });

  it('should handle mixed case - some nodes with positions, some without', () => {
    const activities: Activity[] = [
      {
        id: 'A',
        activityName: 'Activity A',
        position: { x: 100, y: 200 },
      },
      { id: 'B', activityName: 'Activity B' }, // No position
      {
        id: 'C',
        activityName: 'Activity C',
        position: { x: 300, y: 400 },
      },
    ];

    const result = calculateNodePositions(activities);

    expect(result).toHaveLength(3);

    // Nodes with positions should keep them
    const nodeA = result.find((n) => n.id === 'A');
    const nodeC = result.find((n) => n.id === 'C');
    expect(nodeA?.position).toEqual({ x: 100, y: 200 });
    expect(nodeC?.position).toEqual({ x: 300, y: 400 });

    // Node without position should get a position
    const nodeB = result.find((n) => n.id === 'B');
    expect(nodeB?.position).toBeDefined();
  });

  it('should return empty array for empty activities', () => {
    const activities: Activity[] = [];
    const result = calculateNodePositions(activities);
    expect(result).toEqual([]);
  });

  it('should use default horizontal and vertical gaps if not provided', () => {
    const activities: Activity[] = [
      { id: 'A', activityName: 'Activity A' },
      { id: 'B', activityName: 'Activity B' },
      {
        id: 'C',
        activityName: 'Activity C',
        inputs: ['A'],
        outputs: [],
      },
    ];

    const result = calculateNodePositions(activities);
    expect(result).toHaveLength(3);

    for (const node of result) {
      expect(node.position).toBeDefined();
    }
  });
});

describe('validateConnectionLimits', () => {
  it('should return true for valid connections', () => {
    const sourceActivity: Activity = {
      id: 'A',
      activityName: 'Activity A',
      outputs: ['B', 'C'],
    };

    const targetActivity: Activity = {
      id: 'D',
      activityName: 'Activity D',
      inputs: ['B', 'C'],
    };

    // Create a mock for MessageInstance
    const messageApi = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    } as unknown as MessageInstance;

    expect(
      validateConnectionLimits(sourceActivity, targetActivity, messageApi),
    ).toBe(true);
    expect(messageApi.error).not.toHaveBeenCalled();
  });

  it('should return false when output limit is reached (3 outputs)', () => {
    const sourceActivity: Activity = {
      id: 'A',
      activityName: 'Activity A',
      outputs: ['B', 'C', 'D'], // Already has 3 outputs (maximum)
    };

    const targetActivity: Activity = {
      id: 'E',
      activityName: 'Activity E',
      inputs: [],
    };

    // Create a mock for MessageInstance
    const messageApi = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    } as unknown as MessageInstance;

    expect(
      validateConnectionLimits(sourceActivity, targetActivity, messageApi),
    ).toBe(false);
    expect(messageApi.error).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('maximum of 3 output connections'),
        duration: 4,
      }),
    );
  });

  it('should return false when input limit is reached (3 inputs)', () => {
    const sourceActivity: Activity = {
      id: 'A',
      activityName: 'Activity A',
      outputs: [],
    };

    const targetActivity: Activity = {
      id: 'D',
      activityName: 'Activity D',
      inputs: ['B', 'C', 'E'], // Already has 3 inputs (maximum)
    };

    // Create a mock for MessageInstance
    const messageApi = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    } as unknown as MessageInstance;

    expect(
      validateConnectionLimits(sourceActivity, targetActivity, messageApi),
    ).toBe(false);
    expect(messageApi.error).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('maximum of 3 input connections'),
        duration: 4,
      }),
    );
  });

  it('should handle undefined inputs/outputs gracefully', () => {
    const sourceActivity: Activity = {
      id: 'A',
      activityName: 'Activity A',
      // outputs is undefined
    };

    const targetActivity: Activity = {
      id: 'D',
      activityName: 'Activity D',
      // inputs is undefined
    };

    // Create a mock for MessageInstance
    const messageApi = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    } as unknown as MessageInstance;

    expect(
      validateConnectionLimits(sourceActivity, targetActivity, messageApi),
    ).toBe(true);
    expect(messageApi.error).not.toHaveBeenCalled();
  });
});

describe('updateActivityPosition', () => {
  it('should update position for matching activity', () => {
    const activities: Activity[] = [
      { id: 'A', position: { x: 100, y: 100 } },
      { id: 'B', position: { x: 200, y: 200 } },
    ];

    const newPosition = { x: 300, y: 300 };
    const result = updateActivityPosition(activities, 'A', newPosition);

    expect(result[0].position).toEqual(newPosition);
    expect(result[1].position).toEqual({ x: 200, y: 200 });
  });
});

describe('findActivityById', () => {
  it('should find activity by id', () => {
    const activities: Activity[] = [
      { id: 'A', activityName: 'Activity A' },
      { id: 'B', activityName: 'Activity B' },
    ];

    const result = findActivityById('B', activities);

    expect(result).toBe(activities[1]);
  });

  it('should return undefined when activity not found', () => {
    const activities: Activity[] = [{ id: 'A', activityName: 'Activity A' }];

    const result = findActivityById('Z', activities);

    expect(result).toBeUndefined();
  });
});
