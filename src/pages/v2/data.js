import blogPosts from '../../data/blog.json';

export const AVAILABILITY = 'Backend engineer with DevOps focus';

export const PROOF = [
  { value: 43, suffix: '', label: 'Repositories', note: 'Public on GitHub since 2022' },
  { value: 5, suffix: '', label: 'Spring Boot systems', note: 'POS, banking, quizzes, booking, Midas' },
  { value: 3, suffix: '', label: 'Certifications', note: 'NPTEL Java · Android · soft skills' },
  { value: 2, suffix: '', label: 'Job simulations', note: 'JPMC Midas · Deloitte Tech (Forage)' },
];

export const WORK = [
  {
    id: 'w-restrosuite',
    num: '01',
    title: 'RestroSuite — Restaurant POS',
    blurb: 'Full-stack restaurant management: orders move from counter to kitchen in real time, and the books stay right.',
    tech: ['Java', 'Spring Boot', 'React', 'WebSocket', 'JWT', 'RBAC'],
    metrics: [
      { v: 'Live', k: 'order tracking' },
      { v: 'RBAC', k: 'per-role access' },
      { v: 'PDF', k: 'invoicing' },
    ],
    problem:
      'A restaurant floor is a realtime system: orders change state constantly, the kitchen and the counter see different slices of it, and stock quietly drains with every dish. Paper tickets and page refreshes both fall over at rush hour.',
    architecture:
      'Spring Boot backend with a React front. WebSockets push order-state changes to every station the moment they happen. JWT authentication with role-based access separates cashier, kitchen and owner views. Inventory auto-deducts per order, invoices render to PDF, and an analytics dashboard rolls it all up with multi-outlet support.',
    tradeoff:
      'WebSockets over polling for order state: more moving parts on the server, but the kitchen sees an order the second it lands instead of on the next refresh — which is the entire point of a POS.',
    repo: 'https://github.com/123yogin/petpooja-java-backend',
  },
  {
    id: 'w-bank',
    num: '02',
    title: 'Bank Application with REST APIs',
    blurb: 'A secure banking backend — accounts, balances and transfers behind properly protected endpoints.',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Spring Email'],
    metrics: [
      { v: 'JWT', k: 'stateless auth' },
      { v: '3', k: 'transaction types' },
      { v: 'PDF', k: 'statements' },
    ],
    problem:
      'Money endpoints are where sloppy APIs go to die. Account creation, balance inquiry and transfers all mutate state that has to stay consistent — and every one of them is a target.',
    architecture:
      'Spring Boot REST APIs for account creation, balance inquiries and transaction management — credit, debit and transfers. Spring Security with JWT-based authentication guards every sensitive endpoint. Spring Email pushes real-time notifications, and users can download their transaction history as a generated PDF.',
    tradeoff:
      'JWT over server-side sessions: token revocation gets harder, but the API stays stateless and horizontal scaling stays trivial — the right default for a REST-first service.',
    repo: 'https://github.com/123yogin/banking-application',
  },
  {
    id: 'w-midas',
    num: '03',
    title: 'Midas System',
    blurb: "An investment-banking workflow simulator built to JPMorgan Chase's Advanced Software Engineering (Forage) spec.",
    tech: ['Java', 'Spring Boot', 'Apache Kafka', 'SQL', 'H2'],
    metrics: [
      { v: 'Kafka', k: 'async messaging' },
      { v: 'REST', k: 'client APIs' },
      { v: 'H2', k: 'in-memory store' },
    ],
    problem:
      'Trading workflows are bursty and order matters. Synchronous request chains buckle when volume spikes — the system had to ingest transactions, process them, and stay responsive while doing it.',
    architecture:
      'Java and Spring Boot services wired together through Apache Kafka: transactions arrive as messages, get validated and processed asynchronously, and land in a SQL store — H2 in-memory for the simulation. RESTful APIs expose results for client interactions.',
    tradeoff:
      'Kafka between services instead of direct calls: eventual consistency and more infrastructure, in exchange for burst tolerance and clean decoupling between ingestion and processing.',
    repo: 'https://github.com/123yogin/forage-midas',
  },
];

export const ROLES = [
  {
    id: 'backend',
    num: '01',
    name: 'Backend',
    note: 'Java, Spring Boot, and the APIs between',
    skills: [
      { name: 'Java / Spring Boot', evidence: 'The day job at UpVision, plus five public Spring services — POS, banking, quizzes, booking, Midas.', depth: 'Primary' },
      { name: 'REST & microservices', evidence: 'Service APIs at UpVision; JWT-secured, versioned CRUD across the public projects.', depth: 'Primary' },
      { name: 'Spring Security', evidence: 'JWT with role-based access on the banking app and the POS.', depth: 'Strong' },
      { name: 'Python / Flask', evidence: 'The Line internship, plus nine public Flask backends from billing to fitness tracking.', depth: 'Strong' },
      { name: 'Django', evidence: 'Backend internship at iTechBrains on real-world projects.', depth: 'Working' },
      { name: 'Node.js / Express', evidence: 'Full-stack blog platform and a realtime collaborative-workspace backend.', depth: 'Working' },
    ],
  },
  {
    id: 'devops',
    num: '02',
    name: 'DevOps & Cloud',
    note: 'Tested, containerised, deployed',
    skills: [
      { name: 'CI/CD', evidence: 'Pipelines at UpVision that take every change through test, build and deploy.', depth: 'Strong' },
      { name: 'Docker', evidence: 'Containerised deployments at work; POS backend and Postgres automation containerised on GitHub.', depth: 'Strong' },
      { name: 'AWS / OCI', evidence: 'Cloud deployments at UpVision across both platforms.', depth: 'Working' },
      { name: 'Git / GitHub', evidence: '43 public repositories; trunk-based with short-lived branches day to day.', depth: 'Primary' },
      { name: 'Vercel', evidence: 'Static and SSG deploys — this site ships through it.', depth: 'Working' },
    ],
  },
  {
    id: 'data',
    num: '03',
    name: 'Data & ML',
    note: 'Where the state lives',
    skills: [
      { name: 'SQL / MySQL', evidence: 'Relational schemas behind the POS and banking systems — a LinkedIn top skill.', depth: 'Strong' },
      { name: 'PostgreSQL', evidence: 'Expense-tracker backend on Postgres, plus Dockerised provisioning automation.', depth: 'Strong' },
      { name: 'WebSockets', evidence: 'Live order tracking in the POS; Socket.io collaboration in Collab AI.', depth: 'Strong' },
      { name: 'Apache Kafka', evidence: 'Async transaction pipeline in the Midas system.', depth: 'Working' },
      { name: 'Machine learning', evidence: 'Fake-news classifier in Python, Flask and scikit-learn; deepfake-detection ensemble.', depth: 'Working' },
    ],
  },
  {
    id: 'frontend',
    num: '04',
    name: 'Frontend',
    note: 'Enough to ship the whole thing',
    skills: [
      { name: 'React', evidence: 'This portfolio, the POS front, IntelliHire, and three restaurant sites.', depth: 'Strong' },
      { name: 'JavaScript / TypeScript', evidence: 'From vanilla DOM work to typed React apps.', depth: 'Strong' },
      { name: 'HTML / CSS', evidence: 'Hand-written design systems; no framework dependency.', depth: 'Strong' },
      { name: 'Tailwind / Bootstrap', evidence: 'POS frontend on Tailwind; Bootstrap across the earlier apps.', depth: 'Working' },
      { name: 'React Native', evidence: 'Expense-tracker mobile app on Expo, backed by a Flask API.', depth: 'Working' },
    ],
  },
];

export const SHIP = [
  {
    num: '01',
    title: 'Branch, review, merge',
    body: 'Short-lived branches off trunk, a pull request for anything touching a service boundary, and no merge without the pipeline green.',
    tools: 'Git · GitHub',
  },
  {
    num: '02',
    title: 'The pipeline runs it',
    body: 'Every change gets tested, containerised and deployed by CI/CD — not by hand. "Works on my machine" never enters the conversation.',
    tools: 'CI/CD · Docker',
  },
  {
    num: '03',
    title: 'Same box everywhere',
    body: 'Docker images so dev, staging and production run the same bits, on cloud infrastructure that can be rebuilt from scratch.',
    tools: 'Docker · AWS / OCI',
  },
  {
    num: '04',
    title: 'Secure by default',
    body: 'Auth is not a feature to bolt on later. JWT with role-based access on the POS, Spring Security on the banking APIs — protected endpoints everywhere state changes.',
    tools: 'Spring Security · JWT · RBAC',
  },
];

export const JOURNEY = [
  {
    title: 'Associate Software Engineer',
    badge: 'Current',
    dot: '#ec3013',
    badgeColor: '#ae1800',
    org: 'UpVision Software Services Private Limited',
    place: 'Ahmedabad, Gujarat',
    dates: '2026 — Present',
    body: 'Backend and DevOps across the stack: building REST APIs and microservices in Java and Spring Boot, then automating how they get tested, containerised and deployed. The part I enjoy most is closing the gap between "code works on my machine" and "code runs reliably in production".',
    points: [
      'REST APIs and microservices in Java + Spring Boot',
      'CI/CD pipelines that test, containerise and deploy every change',
      'Cloud deployments on AWS and OCI',
    ],
    tags: ['Java', 'Spring Boot', 'Microservices', 'CI/CD', 'Docker', 'AWS/OCI'],
  },
  {
    title: 'Jr. AI Developer',
    badge: 'Internship',
    dot: '#201e1d',
    badgeColor: '#605d5d',
    org: 'The Line Tech Solutions Limited',
    place: 'Ahmedabad, Gujarat',
    dates: 'Aug 2025 — 2026',
    body: 'AI development internship under the mentorship of Poonam Pratik Patel — Python, AI-assisted workflows, and web & mobile application integration.',
    points: [
      'Python services and AI-assisted development workflows',
      'Web and mobile application integration on real projects',
      'First production codebase, in a collaborative team environment',
    ],
    tags: ['Python', 'Flask', 'AI workflows', 'Mobile', 'Git'],
  },
  {
    title: 'Python / Django Intern',
    badge: 'Internship',
    dot: '#201e1d',
    badgeColor: '#605d5d',
    org: 'iTechBrains',
    place: 'Gujarat',
    dates: 'May — Jun 2025',
    body: 'A 30-day backend internship — Django on real-world projects, taking classroom concepts to shipped code under the guidance of the iTechBrains team.',
    points: [
      'Real-world back-end projects in Python + Django',
      'Mentored by Nishant Kansagara and the iTechBrains team',
    ],
    tags: ['Python', 'Django', 'Backend'],
  },
  {
    title: 'BE Computer Engineering',
    badge: 'Class of 2026',
    dot: '#201e1d',
    badgeColor: '#201e1d',
    org: 'LDRP Institute of Technology & Research, GTU',
    place: 'Gandhinagar, Gujarat',
    dates: '2022 — 2026',
    body: 'Systems-heavy coursework alongside a portfolio built in parallel — the theory and the shipping happening at the same time rather than in sequence.',
    points: [
      '43 public repositories built while studying full-time',
      'Certified: Programming in Java (NPTEL), Android development (1Stop), soft skills (NPTEL)',
      'Coursework in OS, networks, DBMS and distributed systems',
    ],
    tags: ['Data Structures', 'OOP', 'Operating Systems', 'Networks', 'DBMS'],
  },
];

/* Writing rows come from the real blog data so every link resolves. */
const WRITING_SLUGS = [
  'react-native-vs-flutter-architecture-comparison',
  'cross-platform-app-architecture-design',
  'xamarin-architecture-ios-development',
  'fastapi-cognito-jwt-verification',
];

const CATEGORY_SHORT = {
  'Mobile Development': 'Mobile',
  'Software Architecture': 'Architecture',
  'Backend Development': 'Backend',
  'Database Design': 'Database',
  'Database Optimization': 'Database',
};

export const WRITING = WRITING_SLUGS.map((slug, i) => {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return {
    num: String(i + 1).padStart(2, '0'),
    slug: post.slug,
    title: post.title,
    meta: `${(post.readTime || '').replace(' read', '')} · ${CATEGORY_SHORT[post.category] || post.category}`,
  };
}).filter(Boolean);

export const CLUSTER_NODES = [
  { idx: 0, name: 'node-01', meta: 'c5.xlarge · ap-south-1a' },
  { idx: 1, name: 'node-02', meta: 'c5.xlarge · ap-south-1b' },
  { idx: 2, name: 'node-03', meta: 'c5.xlarge · ap-south-1c' },
];

export const CLUSTER_LEGEND = [
  { label: 'v2.4.0', border: '#201e1d', bg: 'transparent' },
  { label: 'Draining', border: '#605d5d', bg: 'repeating-linear-gradient(45deg,#d7d3d3,#d7d3d3 2px,#f3f2f2 2px,#f3f2f2 5px)' },
  { label: 'Pulling', border: '#ae1800', bg: '#fff2ef' },
  { label: 'Starting', border: '#ec3013', bg: '#ffe0d9' },
  { label: 'v2.4.1 Ready', border: '#ec3013', bg: '#ec3013' },
  { label: 'Failed', border: '#201e1d', bg: '#201e1d' },
];
