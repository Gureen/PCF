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
        notifyUsers: ['john.doe', 'mike.johnson'],
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
        notifyUsers: ['jane.smith', 'alex.taylor'],
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
        notifyUsers: ['sarah.williams', 'olivia.brown'],
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
        notifyUsers: ['john.doe', 'sarah.williams'],
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
        notifyUsers: ['jane.smith', 'olivia.brown'],
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
        notifyUsers: ['jane.smith', 'mike.johnson'],
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
        notifyUsers: ['sarah.williams', 'john.doe'],
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
        notifyUsers: ['olivia.brown', 'alex.taylor'],
      },
    ],
  },
  {
    id: '2b4d6f8a-1c3e-49a7-b2d4-6f8a1c3e5d7b',
    projectName: 'Marketing Campaign Workflow',
    createdAt: '2025-02-15',
    lastModified: '2025-03-07',
    activities: [
      {
        id: '6e8c0a2d-4f9b-47a5-b6e8-c0a2d4f9b7a5',
        activityName: 'Campaign Strategy',
        description: 'Define marketing campaign objectives and strategy',
        inputs: [],
        outputs: ['Content Creation', 'Channel Setup'],
        color: '#722ed1',
        assignedUsers: ['Marketing Director', 'Brand Strategist'],
        deadline: '2025-03-30',
        approvalCriteria:
          'Strategy must align with annual marketing goals and budget constraints',
        notifyUsers: ['emma.davis', 'olivia.brown'],
      },
      {
        id: '0a2c4e6g-8i1k-47m5-b0a2-c4e6g8i1k3m5',
        activityName: 'Content Creation',
        description: 'Develop marketing content for various channels',
        inputs: ['Campaign Strategy'],
        outputs: ['Campaign Launch'],
        color: '#eb2f96',
        assignedUsers: ['Copywriter', 'Graphic Designer', 'Content Manager'],
        deadline: '2025-04-15',
        approvalCriteria:
          'Content must follow brand guidelines and be approved by Marketing Director',
        notifyUsers: ['alex.taylor', 'mike.johnson'],
      },
      {
        id: '4g6i8k0m-2c4e-47g6-b4g6-i8k0m2c4e6g8',
        activityName: 'Channel Setup',
        description: 'Prepare marketing channels for campaign launch',
        inputs: ['Campaign Strategy'],
        outputs: ['Campaign Launch'],
        color: '#fa541c',
        assignedUsers: ['Digital Marketing Specialist', 'Social Media Manager'],
        deadline: '2025-04-20',
        approvalCriteria:
          'All channels must be properly configured and tested before launch',
        notifyUsers: ['emma.davis', 'jane.smith'],
      },
      {
        id: '8k0m2o4q-6s8u-47w6-b8k0-m2o4q6s8u0w2',
        activityName: 'Campaign Launch',
        description: 'Launch campaign across all planned channels',
        inputs: ['Content Creation', 'Channel Setup'],
        outputs: ['Performance Analysis'],
        color: '#fa8c16',
        assignedUsers: ['Campaign Manager', 'Marketing Team'],
        deadline: '2025-04-30',
        approvalCriteria:
          'Final go/no-go decision requires Marketing Director approval',
        notifyUsers: ['olivia.brown', 'emma.davis'],
      },
      {
        id: '2o4q6s8u-0w2y-47a6-b2o4-q6s8u0w2y4a6',
        activityName: 'Performance Analysis',
        description: 'Monitor and analyze campaign performance',
        inputs: ['Campaign Launch'],
        outputs: [],
        color: '#52c41a',
        assignedUsers: ['Marketing Analyst', 'Marketing Director'],
        deadline: '2025-05-15',
        approvalCriteria:
          'Report must include KPI metrics and recommendations for future campaigns',
        notifyUsers: ['john.doe', 'alex.taylor'],
      },
    ],
  },
  {
    id: '3c5e7g9i-2d4f-49a8-b3c5-e7g9i2d4f6h8',
    projectName: 'Content Publishing Workflow',
    createdAt: '2025-02-10',
    lastModified: '2025-03-01',
    activities: [
      {
        id: '7i9k1m3o-5q7s-47u9-b7i9-k1m3o5q7s9u1',
        activityName: 'Content Creation',
        description: 'Create content based on strategy and requirements',
        inputs: [],
        outputs: ['Editorial Review'],
        color: '#1890ff',
        assignedUsers: ['Content Creator', 'Copywriter'],
        deadline: '2025-03-25',
        approvalCriteria:
          'Content must follow editorial style guide and content strategy',
        notifyUsers: ['alex.taylor', 'emma.davis'],
      },
      {
        id: '1m3o5q7s-9u1w-47y3-b1m3-o5q7s9u1w3y5',
        activityName: 'Editorial Review',
        description: 'Review and refine content for quality and messaging',
        inputs: ['Content Creation'],
        outputs: ['Legal Review'],
        color: '#52c41a',
        assignedUsers: ['Editor', 'Content Manager'],
        deadline: '2025-04-05',
        approvalCriteria:
          'Content must be free of errors and align with brand voice',
        notifyUsers: ['alex.taylor', 'mike.johnson'],
      },
      {
        id: '5q7s9u1w-3y5a-47c7-b5q7-s9u1w3y5a7c9',
        activityName: 'Legal Review',
        description: 'Review content for legal compliance and brand risks',
        inputs: ['Editorial Review'],
        outputs: ['Final Approval'],
        color: '#fa8c16',
        assignedUsers: ['Legal Counsel', 'Compliance Officer'],
        deadline: '2025-04-15',
        approvalCriteria:
          'Content must comply with legal requirements and pose no risk to the company',
        notifyUsers: ['david.wilson', 'olivia.brown'],
      },
      {
        id: '9u1w3y5a-7c9e-47g9-b9u1-w3y5a7c9e1g3',
        activityName: 'Final Approval',
        description: 'Final review and approval before publication',
        inputs: ['Legal Review'],
        outputs: [],
        color: '#f5222d',
        assignedUsers: ['Content Director', 'Brand Manager'],
        deadline: '2025-04-20',
        approvalCriteria:
          'Content must receive sign-off from department head and stakeholders',
        notifyUsers: ['olivia.brown', 'john.doe'],
      },
    ],
  },
  {
    id: '4d6f8h0j-3e5g-49a9-b4d6-f8h0j3e5g7i9',
    projectName: 'Research Project Workflow',
    createdAt: '2025-02-28',
    lastModified: '2025-03-06',
    activities: [
      {
        id: '8j0l2n4p-6r8t-47u1-b8j0-l2n4p6r8t0u2',
        activityName: 'Research Proposal',
        description: 'Define research questions and methodology',
        inputs: [],
        outputs: ['Experimental Design'],
        color: '#722ed1',
        assignedUsers: ['Principal Investigator', 'Research Team'],
        deadline: '2025-04-10',
        approvalCriteria:
          'Proposal must be approved by research committee and meet ethical standards',
        notifyUsers: ['john.doe', 'david.wilson'],
      },
      {
        id: '2n4p6r8t-0u2w-47y4-b2n4-p6r8t0u2w4y6',
        activityName: 'Experimental Design',
        description: 'Design experiments and data collection procedures',
        inputs: ['Research Proposal'],
        outputs: ['Data Collection'],
        color: '#1890ff',
        assignedUsers: ['Research Scientists', 'Statistician'],
        deadline: '2025-04-25',
        approvalCriteria:
          'Experimental design must be methodologically sound and statistically valid',
        notifyUsers: ['sarah.williams', 'jane.smith'],
      },
      {
        id: '6r8t0u2w-4y6a-47c8-b6r8-t0u2w4y6a8c0',
        activityName: 'Data Collection',
        description: 'Gather data according to experimental protocol',
        inputs: ['Experimental Design'],
        outputs: ['Data Analysis'],
        color: '#13c2c2',
        assignedUsers: ['Research Assistants', 'Lab Technicians'],
        deadline: '2025-05-20',
        approvalCriteria:
          'Data collection must follow approved protocols and documentation standards',
        notifyUsers: ['sarah.williams', 'olivia.brown'],
      },
      {
        id: '0u2w4y6a-8c0e-47g2-b0u2-w4y6a8c0e2g4',
        activityName: 'Data Analysis',
        description: 'Process and analyze collected data',
        inputs: ['Data Collection'],
        outputs: ['Research Publication'],
        color: '#52c41a',
        assignedUsers: ['Data Analysts', 'Statistician'],
        deadline: '2025-06-10',
        approvalCriteria:
          'Analysis must use appropriate statistical methods and be peer-reviewed',
        notifyUsers: ['jane.smith', 'john.doe'],
      },
      {
        id: '4y6a8c0e-2g4i-47k6-b4y6-a8c0e2g4i6k8',
        activityName: 'Research Publication',
        description: 'Prepare and publish research findings',
        inputs: ['Data Analysis'],
        outputs: [],
        color: '#eb2f96',
        assignedUsers: ['Principal Investigator', 'Research Team'],
        deadline: '2025-07-01',
        approvalCriteria:
          'Publication must pass internal review and meet journal submission standards',
        notifyUsers: ['david.wilson', 'olivia.brown'],
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
        notifyUsers: ['john.doe', 'jane.smith'],
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
        notifyUsers: ['sarah.williams', 'alex.taylor'],
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
        notifyUsers: ['mike.johnson', 'emma.davis'],
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
        notifyUsers: ['alex.taylor', 'david.wilson'],
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
        notifyUsers: ['olivia.brown', 'john.doe'],
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
  notifyUsers?: string[];
};

// Type definition for SavedFlow if needed
export type SavedFlowType = {
  id: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  activities: Activity[];
};
