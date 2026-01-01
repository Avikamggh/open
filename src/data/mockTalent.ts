export interface Talent {
    id: string;
    name: string;
    role: string;
    company: string;
    location: string;
    skills: string[];
    bio: string;
    linkedin: string;
}

export const mockTalents: Talent[] = [
    {
        id: 't1',
        name: 'Alex Rivera',
        role: 'Senior AI Engineer',
        company: 'Neuralink',
        location: 'Austin, TX',
        skills: ['PyTorch', 'Rust', 'LLM Ops'],
        bio: 'Spearheaded the integration of real-time neural decoding algorithms. Expert in low-latency AI.',
        linkedin: 'linkedin.com/in/arivera-ai',
    },
    {
        id: 't2',
        name: 'Jordan Smith',
        role: 'Founding Engineer',
        company: 'Scale AI',
        location: 'San Francisco, CA',
        skills: ['TypeScript', 'Kubernetes', 'Python'],
        bio: 'Built the core data pipeline that scales to millions of tasks per day. High-growth specialist.',
        linkedin: 'linkedin.com/in/jsmith-eng',
    },
    {
        id: 't3',
        name: 'Elena Varkova',
        role: 'Principal Security Researcher',
        company: 'OpenAI',
        location: 'San Francisco, CA',
        skills: ['Cybersecurity', 'C++', 'Go'],
        bio: 'Focused on alignment and adversarial robustnes. Former head of security at a top fintech.',
        linkedin: 'linkedin.com/in/evarkova',
    },
    {
        id: 't4',
        name: 'Chen Wei',
        role: 'Staff Product Engineer',
        company: 'Ramp',
        location: 'New York, NY',
        skills: ['React', 'PostgreSQL', 'Design Systems'],
        bio: 'Master of UX performance and product velocity. Lead architect for high-complexity financial dashboards.',
        linkedin: 'linkedin.com/in/cwei-ramp',
    }
];
