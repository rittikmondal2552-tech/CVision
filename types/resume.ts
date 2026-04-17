export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    website?: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    graduationYear: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    link?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}
