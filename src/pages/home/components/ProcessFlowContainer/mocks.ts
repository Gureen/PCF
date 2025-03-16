import type { SavedFlow } from '@/interfaces';

// Define priority and user options
export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const USER_OPTIONS = [
  { value: 'john.doe', label: 'John Doe (Project Manager)' },
  { value: 'jane.smith', label: 'Jane Smith (Developer)' },
  { value: 'sarah.williams', label: 'Sarah Williams (QA Engineer)' },
  { value: 'mike.johnson', label: 'Mike Johnson (Designer)' },
  { value: 'alex.taylor', label: 'Alex Taylor (Content Manager)' },
  { value: 'emma.davis', label: 'Emma Davis (Marketing Specialist)' },
  { value: 'david.wilson', label: 'David Wilson (Legal Advisor)' },
  { value: 'olivia.brown', label: 'Olivia Brown (Department Head)' },
];

export const preloadedFlows: SavedFlow[] = [
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
        inputs: [],
        outputs: ['Design Phase', 'Development Planning'],
        color: '#722ed1',
        assignedUsers: ['Product Manager', 'Business Analyst'],
        deadline: '2025-04-05',
        approvalCriteria:
          'All stakeholders must sign off on requirements document',
      },
      {
        id: '9c5e1a7f-4b2d-48e3-a6c9-7f5e3d2b1a8c',
        activityName: 'Design Phase',
        description:
          'Create wireframes and design mockups based on requirements',
        inputs: ['Requirements Gathering'],
        outputs: ['Development Planning'],
        color: '#eb2f96',
        assignedUsers: ['UX Designer', 'UI Designer'],
        deadline: '2025-04-20',
        approvalCriteria:
          'Design must align with brand guidelines and pass accessibility review',
      },
      {
        id: '2a7e9c5b-1f4d-43e8-b6a2-9d5f1e3c7b4a',
        activityName: 'Development Planning',
        description:
          'Break down requirements into development tasks and estimate effort',
        inputs: ['Requirements Gathering', 'Design Phase'],
        outputs: [],
        color: '#13c2c2',
        assignedUsers: ['Tech Lead', 'Development Team'],
        deadline: '2025-05-01',
        approvalCriteria:
          'Sprint plan must be approved by Product Owner and Development Manager',
      },
    ],
  },
  {
    id: '5c8a2b1d-7e6f-49a3-bc5d-8f2a1c9b7e6d',
    projectName: 'Software Testing Workflow',
    createdAt: '2025-03-01',
    lastModified: '2025-03-09',
    activities: [
      {
        id: '7d9e5c2b-1a3f-48d6-b7c9-5e2d1a3f4b8c',
        activityName: 'Test Planning',
        description: 'Create comprehensive test plans and strategies',
        inputs: [],
        outputs: ['Test Case Development', 'Test Environment Setup'],
        color: '#1890ff',
        assignedUsers: ['Test Manager', 'Test Lead'],
        deadline: '2025-03-25',
        approvalCriteria:
          'Test plan must cover all functional and non-functional requirements',
      },
      {
        id: '3b7c9e5a-2d1f-47b6-a3c7-9e5d2b1f4a8c',
        activityName: 'Test Case Development',
        description: 'Create detailed test cases and scenarios',
        inputs: ['Test Planning'],
        outputs: ['Test Execution'],
        color: '#13c2c2',
        assignedUsers: ['Test Analysts', 'Test Engineers'],
        deadline: '2025-04-05',
        approvalCriteria:
          'Test cases must cover 100% of user stories and acceptance criteria',
      },
      {
        id: '9c5e3b7a-1d2f-48c6-b9c5-e3b7a1d2f4c8',
        activityName: 'Test Environment Setup',
        description: 'Prepare testing environments and tools',
        inputs: ['Test Planning'],
        outputs: ['Test Execution'],
        color: '#52c41a',
        assignedUsers: ['Test Environment Specialist', 'DevOps Engineer'],
        deadline: '2025-04-10',
        approvalCriteria:
          'Environment must mirror production and include all integrations',
      },
      {
        id: '5b9c7e3a-1f2d-47b6-a5b9-c7e3a1f2d4b6',
        activityName: 'Test Execution',
        description: 'Execute test cases and record results',
        inputs: ['Test Case Development', 'Test Environment Setup'],
        outputs: ['Test Closure'],
        color: '#faad14',
        assignedUsers: ['Test Engineers', 'Automation Engineers'],
        deadline: '2025-04-25',
        approvalCriteria:
          '95% of test cases must pass with no critical issues remaining',
      },
      {
        id: '1f3d5b7c-9e2a-48d6-b1f3-d5b7c9e2a4d6',
        activityName: 'Test Closure',
        description: 'Analyze test results and prepare final reports',
        inputs: ['Test Execution'],
        outputs: [],
        color: '#eb2f96',
        assignedUsers: [
          'Test Manager',
          'Test Lead',
          'Quality Assurance Manager',
        ],
        deadline: '2025-05-05',
        approvalCriteria:
          'Test report must be signed off by QA Manager and Project Manager',
      },
    ],
  },
  {
    id: '5e7g9i1k-4f6h-49a0-b5e7-g9i1k4f6h8j0',
    projectName: 'Request Approval Workflow',
    createdAt: '2025-03-02',
    lastModified: '2025-03-11',
    activities: [
      {
        id: '9k1m3o5q-7s9u-47w3-b9k1-m3o5q7s9u1w3',
        activityName: 'Request Submission',
        description: 'Submit initial request with required documentation',
        inputs: [],
        outputs: ['Initial Review'],
        color: '#722ed1',
        assignedUsers: ['Requester', 'Department Manager'],
        deadline: '2025-03-20',
        approvalCriteria:
          'Request must include all required documentation and approvals',
      },
      {
        id: '3o5q7s9u-1w3y-47a5-b3o5-q7s9u1w3y5a7',
        activityName: 'Initial Review',
        description: 'Preliminary review of request validity and completeness',
        inputs: ['Request Submission'],
        outputs: ['Content Creation', 'Editorial Review'],
        color: '#eb2f96',
        assignedUsers: ['Review Specialist', 'Department Coordinator'],
        deadline: '2025-03-25',
        approvalCriteria:
          'Request must be complete and valid according to department guidelines',
      },
      {
        id: '7s9u1w3y-5a7c-47e9-b7s9-u1w3y5a7c9e1',
        activityName: 'Content Creation',
        description: 'Create content based on request requirements',
        inputs: ['Initial Review'],
        outputs: ['Editorial Review'],
        color: '#1890ff',
        assignedUsers: ['Content Creator', 'Subject Matter Expert'],
        deadline: '2025-04-05',
        approvalCriteria:
          'Content must address all request requirements and follow guidelines',
      },
      {
        id: '1w3y5a7c-9e1g-47i3-b1w3-y5a7c9e1g3i5',
        activityName: 'Editorial Review',
        description: 'Review content and request documentation',
        inputs: ['Initial Review', 'Content Creation'],
        outputs: ['Final Approval'],
        color: '#52c41a',
        assignedUsers: ['Editor', 'Compliance Specialist'],
        deadline: '2025-04-15',
        approvalCriteria:
          'Content must meet quality standards and comply with policies',
      },
      {
        id: '5a7c9e1g-3i5k-47m7-b5a7-c9e1g3i5k7m9',
        activityName: 'Final Approval',
        description: 'Final decision on request approval',
        inputs: ['Editorial Review'],
        outputs: [],
        color: '#f5222d',
        assignedUsers: ['Department Director', 'Approvals Committee'],
        deadline: '2025-04-25',
        approvalCriteria:
          'Request must receive majority approval from committee members',
      },
    ],
  },
];

// Updated Activity type definition to include the new fields
export type Activity = {
  id: string;
  activityName?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  color?: string;
  assignedUsers?: string[];
  isEmpty?: boolean;
  position?: {
    x: number;
    y: number;
  };
  deadline?: string;
  approvalCriteria?: string;
};

// Type definition for SavedFlow if needed
export type SavedFlowType = {
  id: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  activities: Activity[];
};
