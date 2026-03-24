import Link from "next/link";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  await connectMongo();
  const pages = await Page.find({}).sort({ slug: 1 }).lean();

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <strong>OWTC Admin</strong>
        <Link href="/">View site</Link>
        <Link href="/admin/site-global">Site global</Link>
        {pages.map((page) => (
          <Link key={String(page._id)} href={`/admin/pages/${page.slug}`}>
            Edit {page.slug}
          </Link>
        ))}
        <LogoutButton />
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Dashboard</h1>
        <p className="admin-muted">
          Signed in as <strong>{session.user.email}</strong>. Use the links above to edit content.
        </p>
        <p className="admin-muted">
          After editing page sections, use <strong>Publish</strong> on each page so visitors see
          changes.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {pages.map((page) => (
            <Link key={`${page.slug}-card`} href={`/admin/pages/${page.slug}`}>
              {page.title} ({page.slug})
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
