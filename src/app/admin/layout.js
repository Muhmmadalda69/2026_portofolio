"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FiHome, FiBriefcase, FiFolder, FiStar, FiUser, FiLogOut, FiExternalLink, FiAward } from "react-icons/fi";
import "./admin.css";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <FiHome /> },
  { label: "Experiences", href: "/admin/experiences", icon: <FiBriefcase /> },
  { label: "Projects", href: "/admin/projects", icon: <FiFolder /> },
  { label: "Skills", href: "/admin/skills", icon: <FiStar /> },
  { label: "Profile", href: "/admin/profile", icon: <FiUser /> },
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  // Login page - no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="loading-skeleton" style={{ width: 200, height: 20 }} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar-logo">
          Porto<span style={{ color: "var(--accent-pink)" }}>.</span> Admin
        </Link>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`admin-nav-item ${pathname === item.href ? "active" : ""}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="admin-nav-divider" />

          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item">
            <span className="icon">
              <FiExternalLink />
            </span>
            View Site
          </a>

          <button className="admin-nav-item" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            <span className="icon">
              <FiLogOut />
            </span>
            Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
