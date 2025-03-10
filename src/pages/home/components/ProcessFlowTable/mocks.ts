import type { SavedFlow } from '@/context';

export const preloadedFlows: SavedFlow[] = [
  {
    id: '1',
    projectName: 'Content Approval Process',
    createdAt: '2025-02-15',
    lastModified: '2025-03-01',
    activities: [
      {
        id: 'content-1',
        activityName: 'Content Creation',
        description: 'Create initial content based on requirements',
        inputs: ['Content Brief', 'Brand Guidelines', 'Target Audience'],
        outputs: ['Draft Content', 'Source References'],
        color: '#1890ff',
        assignedUsers: ['Content Writer', 'Subject Matter Expert'],
      },
      {
        id: 'content-2',
        activityName: 'Editorial Review',
        description: 'Review content for quality, accuracy and style',
        inputs: ['Draft Content', 'Style Guide'],
        outputs: ['Revision Notes', 'Edited Content'],
        color: '#52c41a',
        assignedUsers: ['Editor'],
      },
    ],
  },
  {
    id: '2',
    projectName: 'Service Request Handling',
    createdAt: '2025-02-20',
    lastModified: '2025-02-28',
    activities: [
      {
        id: 'content-3',
        activityName: 'Legal Review',
        description: 'Ensure content meets legal and compliance requirements',
        inputs: ['Edited Content', 'Compliance Guidelines'],
        outputs: ['Legal Approval', 'Compliance Notes'],
        color: '#faad14',
        assignedUsers: ['Legal Advisor'],
      },
    ],
  },
  {
    id: '2',
    projectName: 'Service Request Handling',
    createdAt: '2025-02-20',
    lastModified: '2025-02-28',
    activities: [
      {
        id: 'content-3',
        activityName: 'Legal Review',
        description: 'Ensure content meets legal and compliance requirements',
        inputs: ['Edited Content', 'Compliance Guidelines'],
        outputs: ['Legal Approval', 'Compliance Notes'],
        color: '#faad14',
        assignedUsers: ['Legal Advisor'],
      },
    ],
  },
];
