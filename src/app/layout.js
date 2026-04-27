import "./globals.css";

export const metadata = {
  title: "Portfolio | Full Stack Developer",
  description: "Personal portfolio website showcasing projects, skills, and experience. Built with Next.js, Prisma, and Framer Motion.",
  keywords: "portfolio, developer, full stack, web development, react, next.js",
  openGraph: {
    title: "Portfolio | Full Stack Developer",
    description: "Personal portfolio website showcasing projects, skills, and experience.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="grid-bg" />
        {children}
      </body>
    </html>
  );
}
