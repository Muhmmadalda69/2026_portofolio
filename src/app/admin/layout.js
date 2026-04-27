"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHome, FiBriefcase, FiFolder, FiStar, FiUser, FiLogOut, FiExternalLink, FiAward } from "react-icons/fi";
import "./admin.css";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <FiHome /> },
  { label: "Experiences", href: "/admin/experiences", icon: <FiBriefcase /> },
  { label: "Projects", href: "/admin/projects", icon: <FiFolder /> },
  { label: "Skills", href: "/admin/skills", icon: <FiStar /> },
  { label: "Certifications", href: "/admin/certifications", icon: <FiAward /> },
  { label: "Profile", href: "/admin/profile", icon: <FiUser /> },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
    checkUser();
  }, [pathname, router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Login page - no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="loading-skeleton" style={{ width: 200, height: 20 }} />
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") {
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

          <button className="admin-nav-item" onClick={handleSignOut}>
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
