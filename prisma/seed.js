const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@portfolio.com" },
    update: {},
    create: {
      email: "admin@portfolio.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  // Create profile
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "John Doe",
      title: "Full Stack Developer",
      bio: "Passionate software developer with 5+ years of experience building modern web applications. I love creating elegant solutions to complex problems and continuously learning new technologies.",
      avatar: null,
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "hello@johndoe.dev",
      phone: "+62 812-3456-7890",
      resumeUrl: null,
    },
  });

  // Create experiences
  const experiences = [
    {
      company: "Tech Corp Indonesia",
      position: "Senior Full Stack Developer",
      startDate: "2023-01",
      endDate: null,
      description: "Leading development of microservices architecture. Building scalable APIs with Node.js and React frontends. Mentoring junior developers and conducting code reviews.",
      order: 1,
    },
    {
      company: "Digital Agency",
      position: "Full Stack Developer",
      startDate: "2021-03",
      endDate: "2022-12",
      description: "Developed e-commerce platforms and CMS solutions. Implemented payment gateway integrations and real-time notification systems using WebSocket.",
      order: 2,
    },
    {
      company: "Startup Hub",
      position: "Junior Web Developer",
      startDate: "2019-06",
      endDate: "2021-02",
      description: "Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components.",
      order: 3,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // Create projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking. Built with modern tech stack for optimal performance.",
      techStack: "Next.js,Node.js,PostgreSQL,Stripe,Redis",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 1,
    },
    {
      title: "Task Management App",
      description: "Real-time collaborative task management application with drag-and-drop kanban boards, team assignments, and progress analytics dashboard.",
      techStack: "React,Express,MongoDB,Socket.io,Chart.js",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 2,
    },
    {
      title: "AI Chat Assistant",
      description: "Intelligent chatbot powered by OpenAI API with context-aware responses, conversation history, and custom training capabilities.",
      techStack: "Next.js,OpenAI,Prisma,SQLite,Framer Motion",
      liveUrl: null,
      githubUrl: "https://github.com",
      featured: true,
      order: 3,
    },
    {
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and historical weather data visualization.",
      techStack: "React,D3.js,OpenWeather API,CSS Modules",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: false,
      order: 4,
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  // Create skills
  const skills = [
    { name: "JavaScript", category: "Frontend", level: 95, icon: "SiJavascript", order: 1 },
    { name: "React", category: "Frontend", level: 92, icon: "SiReact", order: 2 },
    { name: "Next.js", category: "Frontend", level: 88, icon: "SiNextdotjs", order: 3 },
    { name: "HTML/CSS", category: "Frontend", level: 95, icon: "SiHtml5", order: 4 },
    { name: "Node.js", category: "Backend", level: 90, icon: "SiNodedotjs", order: 5 },
    { name: "Express", category: "Backend", level: 85, icon: "SiExpress", order: 6 },
    { name: "Python", category: "Backend", level: 80, icon: "SiPython", order: 7 },
    { name: "PostgreSQL", category: "Database", level: 85, icon: "SiPostgresql", order: 8 },
    { name: "MongoDB", category: "Database", level: 82, icon: "SiMongodb", order: 9 },
    { name: "Git", category: "Tools", level: 90, icon: "SiGit", order: 10 },
    { name: "Docker", category: "Tools", level: 78, icon: "SiDocker", order: 11 },
    { name: "AWS", category: "Tools", level: 75, icon: "SiAmazonaws", order: 12 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
