import type {
  Job, Application, Applicant, Notification, Skill,
  SkillGap, Conversation, Message, SystemLog, Testimonial,
  PricingPlan, User, MetricCard
} from '@/types';

// ─── USERS ──────────────────────────────────────────────
export const MOCK_CURRENT_STUDENT: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  joinedAt: '2024-09-15',
  status: 'active',
};

export const MOCK_CURRENT_RECRUITER: User = {
  id: 'u2',
  name: 'Sarah Chen',
  email: 'sarah.chen@techcorp.com',
  role: 'recruiter',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  joinedAt: '2024-06-01',
  status: 'active',
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex.rivera@uni.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-09-15', status: 'active' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@techcorp.com', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-06-01', status: 'active' },
  { id: 'u3', name: 'Jordan Lee', email: 'jordan@startup.io', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-07-20', status: 'active' },
  { id: 'u4', name: 'Maya Patel', email: 'maya.p@college.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-10-03', status: 'active' },
  { id: 'u5', name: 'Ethan Brooks', email: 'ethan@bigco.com', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-05-12', status: 'active' },
  { id: 'u6', name: 'Priya Sharma', email: 'priya@uni.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-11-01', status: 'active' },
  { id: 'u7', name: 'Chris Taylor', email: 'chris@design.co', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-08-15', status: 'inactive' },
  { id: 'u8', name: 'Nina Kowalski', email: 'nina.k@college.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-09-28', status: 'active' },
  { id: 'u9', name: 'Dev Anand', email: 'dev@enterprise.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-01-10', status: 'active' },
  { id: 'u10', name: 'Lisa Wong', email: 'lisa@startup.io', role: 'student', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-10-20', status: 'suspended' },
  { id: 'u11', name: 'Marcus Johnson', email: 'marcus@bigco.com', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-04-05', status: 'active' },
  { id: 'u12', name: 'Aisha Mbeki', email: 'aisha@uni.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-12-01', status: 'active' },
  { id: 'u13', name: 'Tom Hardy', email: 'tom@agency.com', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-03-18', status: 'active' },
  { id: 'u14', name: 'Zara Okonkwo', email: 'zara@college.edu', role: 'student', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-11-15', status: 'active' },
  { id: 'u15', name: 'Raj Patel', email: 'raj@platform.ai', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face', joinedAt: '2024-01-01', status: 'active' },
];

// ─── SKILLS ─────────────────────────────────────────────
export const MOCK_SKILLS: Skill[] = [
  { id: 's1', name: 'React', level: 85, category: 'Frontend' },
  { id: 's2', name: 'TypeScript', level: 78, category: 'Languages' },
  { id: 's3', name: 'Node.js', level: 72, category: 'Backend' },
  { id: 's4', name: 'Python', level: 65, category: 'Languages' },
  { id: 's5', name: 'Figma', level: 88, category: 'Design' },
  { id: 's6', name: 'SQL', level: 70, category: 'Data' },
  { id: 's7', name: 'AWS', level: 55, category: 'Cloud' },
  { id: 's8', name: 'Docker', level: 60, category: 'DevOps' },
  { id: 's9', name: 'GraphQL', level: 45, category: 'Backend' },
  { id: 's10', name: 'Tailwind CSS', level: 90, category: 'Frontend' },
];

// ─── JOBS ───────────────────────────────────────────────
export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Frontend Engineer', company: 'TechCorp', companyLogo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=60&h=60&fit=crop', location: 'San Francisco, CA', type: 'full-time', salary: '$95K – $130K', description: 'Build scalable UI components for our enterprise SaaS platform using React and TypeScript.', requirements: ['3+ years React', 'TypeScript proficiency', 'CI/CD experience'], skills: ['React', 'TypeScript', 'Tailwind CSS'], postedAt: '2025-01-08', deadline: '2025-02-15', applicants: 47, aiMatchScore: 92, status: 'active' },
  { id: 'j2', title: 'Data Analyst Intern', company: 'DataFlow', companyLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=60&h=60&fit=crop', location: 'Remote', type: 'internship', salary: '$25/hr', description: 'Analyze datasets and build dashboards to support business intelligence decisions.', requirements: ['SQL proficiency', 'Python basics', 'Excel/Sheets expertise'], skills: ['SQL', 'Python', 'Tableau'], postedAt: '2025-01-10', deadline: '2025-02-28', applicants: 82, aiMatchScore: 74, status: 'active' },
  { id: 'j3', title: 'UX Designer', company: 'DesignHub', companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop', location: 'New York, NY', type: 'full-time', salary: '$85K – $115K', description: 'Lead user research and create high-fidelity prototypes for mobile and web products.', requirements: ['Figma expert', 'User research experience', 'Design systems knowledge'], skills: ['Figma', 'User Research', 'Prototyping'], postedAt: '2025-01-05', deadline: '2025-02-10', applicants: 34, aiMatchScore: 88, status: 'active' },
  { id: 'j4', title: 'Backend Developer', company: 'CloudScale', companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop', location: 'Austin, TX', type: 'full-time', salary: '$100K – $140K', description: 'Design and implement microservices architecture using Node.js and AWS.', requirements: ['Node.js 4+ years', 'AWS certified preferred', 'Microservices pattern'], skills: ['Node.js', 'AWS', 'Docker', 'PostgreSQL'], postedAt: '2025-01-12', deadline: '2025-03-01', applicants: 29, aiMatchScore: 68, status: 'active' },
  { id: 'j5', title: 'Product Manager', company: 'InnovateLab', companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&h=60&fit=crop', location: 'Seattle, WA', type: 'full-time', salary: '$110K – $150K', description: 'Own product roadmap and work cross-functionally with engineering and design teams.', requirements: ['3+ years PM experience', 'Agile methodology', 'Data-driven mindset'], skills: ['Product Strategy', 'Agile', 'Analytics'], postedAt: '2025-01-06', deadline: '2025-02-20', applicants: 56, aiMatchScore: 45, status: 'active' },
  { id: 'j6', title: 'Machine Learning Engineer', company: 'AI Dynamics', companyLogo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=60&h=60&fit=crop', location: 'Boston, MA', type: 'full-time', salary: '$120K – $170K', description: 'Develop and deploy ML models for recommendation systems and NLP pipelines.', requirements: ['Python/PyTorch proficiency', 'MLOps experience', 'Research background preferred'], skills: ['Python', 'PyTorch', 'MLOps', 'NLP'], postedAt: '2025-01-03', deadline: '2025-02-18', applicants: 41, aiMatchScore: 52, status: 'active' },
  { id: 'j7', title: 'DevOps Engineer', company: 'ScaleUp Inc', companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop', location: 'Denver, CO', type: 'contract', salary: '$75/hr', description: 'Build and maintain CI/CD pipelines and cloud infrastructure on AWS/GCP.', requirements: ['Terraform/Pulumi', 'Kubernetes', 'Monitoring/observability'], skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'], postedAt: '2025-01-09', deadline: '2025-02-25', applicants: 18, aiMatchScore: 61, status: 'active' },
  { id: 'j8', title: 'Marketing Coordinator', company: 'BrandForce', companyLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=60&h=60&fit=crop', location: 'Chicago, IL', type: 'part-time', salary: '$35K – $45K', description: 'Coordinate marketing campaigns across digital channels and manage content calendar.', requirements: ['Social media expertise', 'Content creation', 'Analytics tools'], skills: ['Content Marketing', 'Social Media', 'Analytics'], postedAt: '2025-01-11', deadline: '2025-03-05', applicants: 63, aiMatchScore: 38, status: 'active' },
  { id: 'j9', title: 'Full Stack Developer', company: 'WebNova', companyLogo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=60&h=60&fit=crop', location: 'Remote', type: 'full-time', salary: '$90K – $125K', description: 'Build end-to-end features across React frontend and Node.js backend.', requirements: ['React + Node.js', 'Database design', 'API development'], skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'], postedAt: '2025-01-07', deadline: '2025-02-22', applicants: 55, aiMatchScore: 86, status: 'active' },
  { id: 'j10', title: 'iOS Developer', company: 'AppWorks', companyLogo: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop', location: 'Los Angeles, CA', type: 'full-time', salary: '$100K – $135K', description: 'Develop and maintain iOS applications using Swift and SwiftUI.', requirements: ['Swift 3+ years', 'SwiftUI', 'App Store deployment'], skills: ['Swift', 'SwiftUI', 'iOS', 'Xcode'], postedAt: '2025-01-04', deadline: '2025-02-14', applicants: 22, aiMatchScore: 30, status: 'active' },
];

// ─── APPLICATIONS ────────────────────────────────────────
export const MOCK_APPLICATIONS: Application[] = [
  { id: 'a1', jobId: 'j1', jobTitle: 'Frontend Engineer', company: 'TechCorp', appliedAt: '2025-01-09', status: 'shortlisted', aiScore: 92 },
  { id: 'a2', jobId: 'j3', jobTitle: 'UX Designer', company: 'DesignHub', appliedAt: '2025-01-06', status: 'interview', aiScore: 88 },
  { id: 'a3', jobId: 'j9', jobTitle: 'Full Stack Developer', company: 'WebNova', appliedAt: '2025-01-08', status: 'reviewing', aiScore: 86 },
  { id: 'a4', jobId: 'j2', jobTitle: 'Data Analyst Intern', company: 'DataFlow', appliedAt: '2025-01-11', status: 'applied', aiScore: 74 },
  { id: 'a5', jobId: 'j4', jobTitle: 'Backend Developer', company: 'CloudScale', appliedAt: '2025-01-13', status: 'rejected', aiScore: 68 },
];

// ─── APPLICANTS (Recruiter view) ─────────────────────────
export const MOCK_APPLICANTS: Applicant[] = [
  { id: 'ap1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', email: 'alex@uni.edu', title: 'Computer Science Student', skills: ['React', 'TypeScript', 'Tailwind CSS'], experience: '2 years', aiMatchScore: 92, appliedAt: '2025-01-09', status: 'shortlisted', resumeUrl: '#' },
  { id: 'ap2', name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', email: 'maya@college.edu', title: 'Software Engineering Major', skills: ['React', 'Node.js', 'Python'], experience: '1.5 years', aiMatchScore: 87, appliedAt: '2025-01-10', status: 'new', resumeUrl: '#' },
  { id: 'ap3', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', email: 'priya@uni.edu', title: 'Full Stack Bootcamp Grad', skills: ['JavaScript', 'React', 'SQL'], experience: '1 year', aiMatchScore: 81, appliedAt: '2025-01-11', status: 'reviewing', resumeUrl: '#' },
  { id: 'ap4', name: 'Nina Kowalski', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', email: 'nina@college.edu', title: 'CS & Design Double Major', skills: ['Figma', 'React', 'CSS'], experience: '2 years', aiMatchScore: 78, appliedAt: '2025-01-12', status: 'new', resumeUrl: '#' },
  { id: 'ap5', name: 'Lisa Wong', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', email: 'lisa@uni.edu', title: 'Frontend Developer', skills: ['Vue.js', 'TypeScript', 'Sass'], experience: '3 years', aiMatchScore: 75, appliedAt: '2025-01-08', status: 'interview', resumeUrl: '#' },
  { id: 'ap6', name: 'Aisha Mbeki', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', email: 'aisha@uni.edu', title: 'Data Science Student', skills: ['Python', 'SQL', 'TensorFlow'], experience: '1 year', aiMatchScore: 71, appliedAt: '2025-01-13', status: 'new', resumeUrl: '#' },
  { id: 'ap7', name: 'Zara Okonkwo', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face', email: 'zara@college.edu', title: 'UX Research Intern', skills: ['User Research', 'Figma', 'Miro'], experience: '6 months', aiMatchScore: 65, appliedAt: '2025-01-14', status: 'rejected', resumeUrl: '#' },
  { id: 'ap8', name: 'Marcus Johnson', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face', email: 'marcus@uni.edu', title: 'Backend Engineering Student', skills: ['Java', 'Spring Boot', 'AWS'], experience: '2.5 years', aiMatchScore: 58, appliedAt: '2025-01-07', status: 'reviewing', resumeUrl: '#' },
];

// ─── NOTIFICATIONS ───────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New AI Match', message: 'TechCorp — Frontend Engineer is a 92% match for your profile.', type: 'match', read: false, createdAt: '2025-01-14T10:30:00Z' },
  { id: 'n2', title: 'Application Update', message: 'DesignHub has moved your application to Interview stage.', type: 'success', read: false, createdAt: '2025-01-14T08:15:00Z' },
  { id: 'n3', title: 'Skill Recommendation', message: 'Complete a GraphQL course to improve your backend match score by 12%.', type: 'info', read: true, createdAt: '2025-01-13T14:00:00Z' },
  { id: 'n4', title: 'Deadline Approaching', message: 'DataFlow — Data Analyst Intern application closes in 3 days.', type: 'warning', read: true, createdAt: '2025-01-13T09:00:00Z' },
  { id: 'n5', title: 'Profile Viewed', message: 'A recruiter from CloudScale viewed your portfolio.', type: 'info', read: true, createdAt: '2025-01-12T16:45:00Z' },
];

// ─── SKILL GAPS ──────────────────────────────────────────
export const MOCK_SKILL_GAPS: SkillGap[] = [
  { skill: 'GraphQL', currentLevel: 45, requiredLevel: 75, recommendations: ['Complete "GraphQL Fundamentals" on Udemy', 'Build a GraphQL API project', 'Read Apollo Client documentation'] },
  { skill: 'AWS', currentLevel: 55, requiredLevel: 80, recommendations: ['AWS Cloud Practitioner certification', 'Deploy a project on AWS Lambda', 'Practice with free tier services'] },
  { skill: 'Docker', currentLevel: 60, requiredLevel: 78, recommendations: ['Docker for Developers course', 'Containerize an existing project', 'Learn Docker Compose orchestration'] },
  { skill: 'Python', currentLevel: 65, requiredLevel: 85, recommendations: ['Complete Python advanced patterns course', 'Build a Flask REST API', 'Contribute to an open-source Python project'] },
  { skill: 'System Design', currentLevel: 40, requiredLevel: 70, recommendations: ['Read "Designing Data-Intensive Applications"', 'Practice system design interviews', 'Watch ByteByteGo videos'] },
];

// ─── CONVERSATIONS ───────────────────────────────────────
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', participantName: 'Sarah Chen', participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', participantRole: 'Recruiter at TechCorp', lastMessage: 'Looking forward to our call on Thursday!', lastMessageTime: '2025-01-14T11:00:00Z', unreadCount: 2, online: true,
    messages: [
      { id: 'm1', senderId: 'u2', senderName: 'Sarah Chen', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', content: 'Hi Alex! I reviewed your application for Frontend Engineer.', timestamp: '2025-01-13T14:00:00Z', read: true },
      { id: 'm2', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', content: 'Thank you so much for reaching out, Sarah! I am very excited about this opportunity.', timestamp: '2025-01-13T14:30:00Z', read: true },
      { id: 'm3', senderId: 'u2', senderName: 'Sarah Chen', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', content: 'Your React skills are impressive. Would you be available for a technical interview this week?', timestamp: '2025-01-14T09:00:00Z', read: true },
      { id: 'm4', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', content: 'Absolutely! Thursday afternoon works best for me.', timestamp: '2025-01-14T09:15:00Z', read: true },
      { id: 'm5', senderId: 'u2', senderName: 'Sarah Chen', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', content: 'Looking forward to our call on Thursday!', timestamp: '2025-01-14T11:00:00Z', read: false },
    ],
  },
  {
    id: 'c2', participantName: 'Jordan Lee', participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', participantRole: 'Hiring Manager at WebNova', lastMessage: 'Can you share your portfolio link?', lastMessageTime: '2025-01-13T16:00:00Z', unreadCount: 1, online: false,
    messages: [
      { id: 'm6', senderId: 'u3', senderName: 'Jordan Lee', senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', content: 'Hi Alex, great application! Can you share your portfolio link?', timestamp: '2025-01-13T16:00:00Z', read: false },
    ],
  },
  {
    id: 'c3', participantName: 'Ethan Brooks', participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', participantRole: 'Tech Lead at DesignHub', lastMessage: 'The design challenge is attached.', lastMessageTime: '2025-01-12T10:30:00Z', unreadCount: 0, online: true,
    messages: [
      { id: 'm7', senderId: 'u5', senderName: 'Ethan Brooks', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', content: 'Hi Alex, as part of the interview, we have a design challenge. The design challenge is attached.', timestamp: '2025-01-12T10:30:00Z', read: true },
    ],
  },
];

// ─── SYSTEM LOGS (Admin) ────────────────────────────────
export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', action: 'User Login', user: 'alex.rivera@uni.edu', timestamp: '2025-01-14T10:32:00Z', type: 'auth', details: 'Successful login from 192.168.1.1' },
  { id: 'l2', action: 'Job Posted', user: 'sarah.chen@techcorp.com', timestamp: '2025-01-14T09:15:00Z', type: 'data', details: 'New job: Frontend Engineer at TechCorp' },
  { id: 'l3', action: 'Account Suspended', user: 'system', timestamp: '2025-01-14T08:00:00Z', type: 'security', details: 'User lisa.wong@startup.io flagged for policy violation' },
  { id: 'l4', action: 'AI Model Updated', user: 'system', timestamp: '2025-01-13T22:00:00Z', type: 'system', details: 'Matching algorithm v2.4.1 deployed successfully' },
  { id: 'l5', action: 'Bulk Data Export', user: 'dev.anand@enterprise.com', timestamp: '2025-01-13T17:30:00Z', type: 'data', details: 'Exported 1,200 user records for analytics' },
  { id: 'l6', action: 'Password Reset', user: 'nina.kowalski@college.edu', timestamp: '2025-01-13T14:20:00Z', type: 'auth', details: 'Password reset requested and completed' },
  { id: 'l7', action: 'Rate Limit Triggered', user: 'unknown', timestamp: '2025-01-13T11:45:00Z', type: 'security', details: 'IP 203.0.113.42 exceeded 100 requests/min' },
  { id: 'l8', action: 'Database Backup', user: 'system', timestamp: '2025-01-13T03:00:00Z', type: 'system', details: 'Automated daily backup completed (2.4GB)' },
  { id: 'l9', action: 'User Registration', user: 'zara.okonkwo@college.edu', timestamp: '2025-01-12T19:00:00Z', type: 'auth', details: 'New student account created' },
  { id: 'l10', action: 'API Key Rotated', user: 'raj.patel@platform.ai', timestamp: '2025-01-12T15:00:00Z', type: 'security', details: 'Production API keys rotated per schedule' },
  { id: 'l11', action: 'Feature Flag Updated', user: 'dev.anand@enterprise.com', timestamp: '2025-01-12T12:30:00Z', type: 'system', details: 'Enabled "skill-gap-v2" for 50% rollout' },
  { id: 'l12', action: 'User Login Failed', user: 'marcus@bigco.com', timestamp: '2025-01-12T10:00:00Z', type: 'auth', details: '3 failed login attempts from new IP' },
];

// ─── TESTIMONIALS ────────────────────────────────────────
export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Emily Carter', role: 'Computer Science Graduate', company: 'Stanford University', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', quote: 'SkillBridge matched me with my dream job at a startup. The AI scoring helped me focus my applications on roles where I was truly competitive.', rating: 5 },
  { id: 't2', name: 'David Kim', role: 'Head of Talent', company: 'Stripe', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', quote: 'We reduced our time-to-hire by 40% after integrating SkillBridge. The AI matching surfaced candidates we would have otherwise missed.', rating: 5 },
  { id: 't3', name: 'Anika Desai', role: 'Engineering Student', company: 'MIT', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', quote: 'The Skill Gap Analyzer showed me exactly what to learn next. I went from 0 interviews to 5 in one month after following its recommendations.', rating: 5 },
  { id: 't4', name: 'James Wright', role: 'VP Engineering', company: 'Figma', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', quote: 'The quality of candidates on SkillBridge is remarkable. Their skill verification and AI matching saves our team countless hours.', rating: 4 },
];

// ─── PRICING ─────────────────────────────────────────────
export const MOCK_PRICING: PricingPlan[] = [
  { id: 'p1', name: 'Student', price: 'Free', period: '', description: 'Everything you need to launch your career.', features: ['AI job matching', 'Skill gap analysis', 'Portfolio builder', '5 applications / month', 'Basic messaging'], highlighted: false, cta: 'Get Started Free' },
  { id: 'p2', name: 'Pro', price: '$12', period: '/month', description: 'Unlimited access for serious job seekers.', features: ['Everything in Student', 'Unlimited applications', 'Priority AI matching', 'Advanced analytics', 'Resume builder', 'Interview prep AI'], highlighted: true, cta: 'Start Pro Trial' },
  { id: 'p3', name: 'Recruiter', price: '$49', period: '/month', description: 'Smart hiring tools for teams of all sizes.', features: ['AI candidate matching', 'Unlimited job postings', 'Applicant tracking', 'Team collaboration', 'Analytics dashboard', 'API access'], highlighted: false, cta: 'Start Recruiting' },
  { id: 'p4', name: 'Enterprise', price: 'Custom', period: '', description: 'Tailored solutions for large organizations.', features: ['Everything in Recruiter', 'Custom integrations', 'Dedicated support', 'SLA guarantees', 'On-premise option', 'Bulk seat pricing'], highlighted: false, cta: 'Contact Sales' },
];

// ─── ADMIN METRICS ───────────────────────────────────────
export const MOCK_ADMIN_METRICS: MetricCard[] = [
  { label: 'Total Users', value: '12,847', change: 12.5, trend: 'up' },
  { label: 'Active Jobs', value: '1,234', change: 8.2, trend: 'up' },
  { label: 'Applications Today', value: '847', change: -3.1, trend: 'down' },
  { label: 'AI Match Rate', value: '78.4%', change: 2.8, trend: 'up' },
  { label: 'Avg. Time to Hire', value: '18 days', change: -15.2, trend: 'up' },
  { label: 'Platform Uptime', value: '99.97%', change: 0.02, trend: 'up' },
];

// ─── STUDENT METRICS ────────────────────────────────────
export const MOCK_STUDENT_METRICS: MetricCard[] = [
  { label: 'Profile Views', value: 142, change: 23, trend: 'up' },
  { label: 'AI Matches', value: 28, change: 5, trend: 'up' },
  { label: 'Applications', value: 12, change: 3, trend: 'up' },
  { label: 'Interviews', value: 4, change: 1, trend: 'up' },
];

// ─── RECRUITER METRICS ──────────────────────────────────
export const MOCK_RECRUITER_METRICS: MetricCard[] = [
  { label: 'Open Positions', value: 8, change: 2, trend: 'up' },
  { label: 'Total Applicants', value: 347, change: 45, trend: 'up' },
  { label: 'Shortlisted', value: 24, change: 6, trend: 'up' },
  { label: 'Avg. Match Score', value: '76%', change: 4, trend: 'up' },
];
