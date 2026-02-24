import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [profile, experiences, projects, skills] = await Promise.all([
      prisma.profile.findFirst().catch(() => null),
      prisma.experience.findMany({ orderBy: { order: "asc" } }).catch(() => []),
      prisma.project.findMany({ orderBy: { order: "asc" } }).catch(() => []),
      prisma.skill
        .findMany({
          orderBy: { order: "asc" },
          include: { categoryRel: true },
        })
        .catch(() => []),
    ]);

    return { profile, experiences, projects, skills };
  } catch (error) {
    console.error("Database fetch error:", error);
    return { profile: null, experiences: [], projects: [], skills: [] };
  }
}

export default async function Home() {
  const { profile, experiences, projects, skills } = await getData();

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} experienceCount={experiences.length} projectCount={projects.length} skillCount={skills.length} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
