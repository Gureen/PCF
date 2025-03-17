import type { Activity } from '@/interfaces';

/**
 * Predefined activity templates for common workflow steps
 * These templates can be dragged onto the flow canvas to create new activities
 * Each template has a unique ID, name, and color
 */
export const activityTemplates: Activity[] = [
  {
    id: '8f7e6d5c-4b3a-2d1e-0f9g-8h7i6j5k4l3m',
    activityName: 'Content Creation',
    color: '#1890ff',
  },
  {
    id: '7e6d5c4b-3a2d-1e0f-9g8h-7i6j5k4l3m2n',
    activityName: 'Editorial Review',
    color: '#52c41a',
  },
  {
    id: '6d5c4b3a-2d1e-0f9g-8h7i-6j5k4l3m2n1o',
    activityName: 'Legal Review',
    color: '#fa8c16',
  },
  {
    id: '5c4b3a2d-1e0f-9g8h-7i6j-5k4l3m2n1o0p',
    activityName: 'Final Approval',
    color: '#f5222d',
  },
  {
    id: '4b3a2d1e-0f9g-8h7i-6j5k-4l3m2n1o0p9q',
    activityName: 'Request Submission',
    color: '#722ed1',
  },
];
