export const metadata = { title: "Terms" };

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Terms</h1>
      <p className="text-xs mb-8" style={{ color: "var(--mute)" }}>Last updated: 19 November 2026</p>
      <div className="text-[15px] space-y-4">
        <p>solveCV is a free tool. It is provided as is, with no warranty. It does not guarantee jobs, interviews, or hiring outcomes, and nothing it generates is legal, financial, or immigration advice.</p>
        <p>AI-generated output is a draft, not a fact-check. Verify every claim, number, and recommendation before you send or use it. You are responsible for what you submit under your name.</p>
        <p>Job listings come from third-party sources. We do not screen employers and are not party to anything between you and them.</p>
        <p>Do not paste other people's personal data into the tools, and do not use the site to spam, scrape aggressively, or misrepresent yourself.</p>
        <p>Employers posting jobs agree to listings that are real, current, and free of resume-harvesting. Listings that violate this are removed.</p>
      </div>
    </div>
  );
}
