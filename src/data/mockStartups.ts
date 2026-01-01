export interface Startup {
    id: string;
    name: string;
    description: string;
    industry: string;
    stage: string;
    traction: string;
    founder: string;
}

export const mockStartups: Startup[] = [
    {
        id: 's1',
        name: 'QuantumFlow AI',
        description: 'Next-gen optimization for quantum-resistant cryptography.',
        industry: 'GenAI Infrastructure',
        stage: 'Seed',
        traction: '$200k ARR',
        founder: 'Sarah Chen'
    },
    {
        id: 's2',
        name: 'NeoBanker',
        description: 'Autonomous financial agents for cross-border settlements.',
        industry: 'Fintech',
        stage: 'Pre-Seed',
        traction: 'Waitlist: 50k users',
        founder: 'James Wilson'
    },
    {
        id: 's3',
        name: 'BioSynthetix',
        description: 'Using LLMs to design new protein structures for anti-aging.',
        industry: 'BioTech',
        stage: 'Series A',
        traction: 'Clinical Trial Phase 1',
        founder: 'Dr. Elena Rossi'
    },
    {
        id: 's4',
        name: 'SkyNode',
        description: 'Decentralized drone delivery network for remote areas.',
        industry: 'Logistics',
        stage: 'Seed',
        traction: '10,000 deliveries completed',
        founder: 'Marcus Thorne'
    },
    {
        id: 's5',
        name: 'EtherShield',
        description: 'Real-time threat detection for decentralized applications.',
        industry: 'Security',
        stage: 'Series A',
        traction: '$1.2M ARR',
        founder: 'Anya Volk'
    }
];
