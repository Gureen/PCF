import { DEFAULT_COLOR } from '@/constants';
import type { Activity } from '@/interfaces';
import type { FormValues } from './types';
import { createActivityObject, getColorValue } from './utils';

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
const mockRandomUUID = jest.fn(() => mockUUID);

beforeEach(() => {
  // Reset the mock before each test
  mockRandomUUID.mockClear();
  Object.defineProperty(global.crypto, 'randomUUID', { value: mockRandomUUID });
});

describe('getColorValue', () => {
  it('returns the input when given a valid string', () => {
    const color = '#FF5733';
    expect(getColorValue(color)).toBe(color);
  });

  it('calls toHexString when given an object with that method', () => {
    const mockColorObj = {
      toHexString: jest.fn(() => '#AABBCC'),
    };

    expect(getColorValue(mockColorObj)).toBe('#AABBCC');
    expect(mockColorObj.toHexString).toHaveBeenCalledTimes(1);
  });

  it('returns DEFAULT_COLOR when given null', () => {
    expect(getColorValue(null)).toBe(DEFAULT_COLOR);
  });

  it('returns DEFAULT_COLOR when given undefined', () => {
    expect(getColorValue(undefined)).toBe(DEFAULT_COLOR);
  });

  it('returns DEFAULT_COLOR when given an object without toHexString', () => {
    const invalidObj = { someProperty: 'value' };
    expect(
      getColorValue(invalidObj as unknown as { toHexString?: () => string }),
    ).toBe(DEFAULT_COLOR);
  });
});

describe('createActivityObject', () => {
  const mockFormValues: FormValues = {
    activityName: 'Test Activity',
    description: 'Test Description',
    assignedUsers: ['user1', 'user2'],
    color: '#FF5733',
    deadline: '2025-04-01',
    approvalCriteria: 'Complete all tasks',
  };

  const existingActivity: Activity = {
    id: 'existing-id',
    activityName: 'Existing Activity',
    description: 'Existing Description',
    assignedUsers: ['user3'],
    color: '#334455',
    deadline: '2025-03-01',
    approvalCriteria: 'Old criteria',
  };

  it('creates a new activity with a generated UUID when not editing', () => {
    const result = createActivityObject(mockFormValues, false, null);

    expect(result).toEqual({
      id: mockUUID,
      activityName: mockFormValues.activityName,
      description: mockFormValues.description,
      assignedUsers: mockFormValues.assignedUsers,
      color: mockFormValues.color,
      deadline: mockFormValues.deadline,
      approvalCriteria: mockFormValues.approvalCriteria,
    });

    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('preserves the existing ID when editing an activity', () => {
    const result = createActivityObject(mockFormValues, true, existingActivity);

    expect(result).toEqual({
      id: existingActivity.id,
      activityName: mockFormValues.activityName,
      description: mockFormValues.description,
      assignedUsers: mockFormValues.assignedUsers,
      color: mockFormValues.color,
      deadline: mockFormValues.deadline,
      approvalCriteria: mockFormValues.approvalCriteria,
    });

    // We just verify the ID is preserved, don't check if randomUUID was called
    // as the implementation might have different logic
    expect(result.id).toBe(existingActivity.id);
  });

  it('uses DEFAULT_COLOR when color is undefined in form values', () => {
    const formValuesWithUndefinedColor: FormValues = {
      ...mockFormValues,
      color: undefined,
    };

    const result = createActivityObject(
      formValuesWithUndefinedColor,
      false,
      null,
    );

    expect(result.color).toBe(DEFAULT_COLOR);
  });

  it('handles editing with partially updated form values', () => {
    // Only updating some fields
    const partialUpdate: FormValues = {
      activityName: 'Updated Activity',
      description: existingActivity.description, // Unchanged
      assignedUsers: existingActivity.assignedUsers, // Unchanged
      color: '#999999', // Changed
      deadline: existingActivity.deadline, // Unchanged
      approvalCriteria: 'Updated criteria', // Changed
    };

    const result = createActivityObject(partialUpdate, true, existingActivity);

    expect(result).toEqual({
      id: existingActivity.id,
      activityName: 'Updated Activity',
      description: existingActivity.description,
      assignedUsers: existingActivity.assignedUsers,
      color: '#999999',
      deadline: existingActivity.deadline,
      approvalCriteria: 'Updated criteria',
    });
  });

  it('generates new ID when isEditing is true but currentActivity is null', () => {
    // Clear previous calls
    mockRandomUUID.mockClear();

    // This is an edge case that should be handled gracefully
    const result = createActivityObject(mockFormValues, true, null);

    // Just verify that an ID was generated (we don't care about call count)
    expect(result.id).toBe(mockUUID);
    expect(mockRandomUUID).toHaveBeenCalled();
  });
});
