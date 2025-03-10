import type { Activity } from '@/interfaces';

export const activityTemplates: Activity[] = [
  {
    id: 'template-1',
    activityName: 'Content Creation',
    description: 'Creating original content for the project',
    inputs: ['Brief', 'Research'],
    outputs: ['Draft Content', 'Assets'],
    color: '#1677ff',
    assignedUsers: ['John Doe'],
  },
  {
    id: 'template-2',
    activityName: 'Review Process',
    description: 'Reviewing and approving content',
    inputs: ['Draft Content'],
    outputs: ['Approved Content', 'Revision Notes'],
    color: '#52c41a',
    assignedUsers: ['Jane Smith', 'Alex Johnson'],
  },
  {
    id: 'template-3',
    activityName: 'Client Approval',
    description: 'Getting final client sign-off',
    inputs: ['Approved Content'],
    outputs: ['Final Content', 'Client Feedback'],
    color: '#fa8c16',
    assignedUsers: ['Jane Smith'],
  },
];
