import Link from "next/link";

export const metadata = { title: "Post a job" };

export default function PostAJob() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "Georgia, serif" }}>Post a job on solveCV</h1>
      <p className="text-[15px] mb-4">
        Send the listing to <a href="mailto:jobs@solvecv.app" className="underline underline-offset-4">jobs@solvecv.app</a> with the role, location, link, and a one-line blurb. It goes live within two working days.
      </p>
      <p className="text-[15px] mb-4">Free for the first sixty days. No recruiter spam, no re-posting of listings that exist to farm resumes.</p>
      <p className="text-sm" style={{ color: "var(--mute)" }}>
        Job seekers do not need this page. <Link href="/jobs" className="underline underline-offset-4">The board</Link> is already open.
      </p>
    </div>
  );
}
