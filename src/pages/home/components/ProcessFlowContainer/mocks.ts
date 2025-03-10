import type { SavedFlow } from '@/interfaces';

export const preloadedFlows: SavedFlow[] = [
  {
    id: '3f7b8f9c-d423-4ee0-a431-b0f11a392eb5',
    projectName: 'Content Approval Process',
    createdAt: '2025-02-15',
    lastModified: '2025-03-01',
    activities: [
      {
        id: 'fd8c1a4b-7361-48e9-bcf4-0a73e429f71d',
        activityName: 'Content Creation',
        description: 'Create initial content based on requirements',
        inputs: ['Content Brief', 'Brand Guidelines', 'Target Audience'],
        outputs: ['Draft Content', 'Source References'],
        color: '#1890ff',
        assignedUsers: ['Content Writer', 'Subject Matter Expert'],
      },
      {
        id: '67a9e5c3-8e2f-4b07-9f53-6d7cd8b92a1e',
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
    id: '25df9a76-5d6c-48ae-94eb-327d87cb189a',
    projectName: 'Service Request Handling',
    createdAt: '2025-02-20',
    lastModified: '2025-02-28',
    activities: [
      {
        id: 'c2e8df91-7f52-4ae1-b0d9-5e71f8a4c632',
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
    id: '9876a432-bf17-48c1-9dd5-3a6e8f91c45b',
    projectName: 'Service Request Handling',
    createdAt: '2025-02-20',
    lastModified: '2025-02-28',
    activities: [
      {
        id: 'e4f23a1c-6b95-47d8-8a32-9cd1f6e8b074',
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
    id: 'b3a7e5c9-d412-46f9-8e23-71d9a4b8f5c6',
    projectName: 'Service Request Handling',
    createdAt: '2025-02-20',
    lastModified: '2025-02-28',
    activities: [
      {
        id: '8f2a1e7d-3c96-45b8-9a0f-6d5c2b7e4a3f',
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
    id: '4e2d8c1a-6f57-49b3-ae85-7c9f2b3d1a0e',
    projectName: 'Product Development Workflow',
    createdAt: '2025-03-05',
    lastModified: '2025-03-08',
    activities: [
      {
        id: 'f5a3e7c9-2b8d-41e6-9f5a-3c7b8d2e1a4f',
        activityName: 'Requirements Gathering',
        description:
          'Collect and document product requirements from stakeholders',
        inputs: [
          'Market Research',
          'Customer Feedback',
          'Stakeholder Interviews',
        ],
        outputs: ['Requirements Document', 'Feature List'],
        color: '#722ed1',
        assignedUsers: ['Product Manager', 'Business Analyst'],
      },
      {
        id: '9c5e1a7f-4b2d-48e3-a6c9-7f5e3d2b1a8c',
        activityName: 'Design Phase',
        description:
          'Create wireframes and design mockups based on requirements',
        inputs: ['Requirements Document', 'Brand Style Guide'],
        outputs: ['Wireframes', 'UI Mockups', 'Design Specifications'],
        color: '#eb2f96',
        assignedUsers: ['UX Designer', 'UI Designer'],
      },
      {
        id: '2a7e9c5b-1f4d-43e8-b6a2-9d5f1e3c7b4a',
        activityName: 'Development Planning',
        description:
          'Break down requirements into development tasks and estimate effort',
        inputs: ['Requirements Document', 'Design Specifications'],
        outputs: [
          'Development Tasks',
          'Sprint Plan',
          'Technical Specifications',
        ],
        color: '#13c2c2',
        assignedUsers: ['Tech Lead', 'Development Team'],
      },
    ],
  },
  {
    id: '8d2f6a1c-5e9b-47d3-8a2f-6c9e3b5d1a7f',
    projectName: 'Marketing Campaign Launch',
    createdAt: '2025-03-01',
    lastModified: '2025-03-09',
    activities: [
      {
        id: '3a7d9f2e-6b5c-48a1-9d7e-2b5a8f3c1d6e',
        activityName: 'Campaign Strategy',
        description:
          'Define marketing objectives, target audience, and key messages',
        inputs: [
          'Market Analysis',
          'Product Information',
          'Budget Constraints',
        ],
        outputs: ['Campaign Brief', 'Marketing Strategy Document'],
        color: '#f5222d',
        assignedUsers: ['Marketing Director', 'Campaign Manager'],
      },
      {
        id: '7f2e5a9c-1d8b-46f3-a7d9-2e5c8b3f1a6d',
        activityName: 'Creative Development',
        description: 'Create visual assets and copy for the campaign',
        inputs: ['Campaign Brief', 'Brand Guidelines'],
        outputs: ['Campaign Visuals', 'Campaign Copy', 'Social Media Assets'],
        color: '#fa8c16',
        assignedUsers: ['Graphic Designer', 'Copywriter'],
      },
      {
        id: '1d9f7a3e-5c2b-48f6-9d3a-7f5c2e1b8a4d',
        activityName: 'Media Planning',
        description: 'Select channels and plan media buys for the campaign',
        inputs: ['Campaign Brief', 'Audience Insights', 'Budget Allocation'],
        outputs: ['Media Plan', 'Channel Strategy', 'Timeline'],
        color: '#a0d911',
        assignedUsers: ['Media Planner', 'Digital Marketing Specialist'],
      },
      {
        id: '6b3f9d2a-7e5c-41f8-b3d7-9f2a5e1c6b4d',
        activityName: 'Performance Tracking',
        description: 'Set up analytics and track campaign performance metrics',
        inputs: ['Campaign KPIs', 'Analytics Access', 'Reporting Templates'],
        outputs: [
          'Dashboard Setup',
          'Performance Reports',
          'Optimization Recommendations',
        ],
        color: '#1677ff',
        assignedUsers: ['Analytics Specialist', 'Campaign Manager'],
      },
    ],
  },
];
