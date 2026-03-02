export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  deadline: string;
  applicants: number;
  aiMatchScore?: number;
  status: 'active' | 'closed' | 'draft';
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interview' | 'offered' | 'rejected';
  aiScore: number;
}

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
  email: string;
  title: string;
  skills: string[];
  experience: string;
  aiMatchScore: number;
  appliedAt: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected';
  resumeUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'match';
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  recommendations: string[];
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'auth' | 'data' | 'system' | 'security';
  details: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
