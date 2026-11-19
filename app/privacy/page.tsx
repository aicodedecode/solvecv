export const metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Privacy</h1>
      <p className="text-xs mb-8" style={{ color: "var(--mute)" }}>Last updated: 19 November 2026</p>
      <div className="text-[15px] space-y-4">
        <p><strong>What we store about you: nothing by default.</strong> Your application tracker and tool history live in your browser's local storage on your device. We cannot read them, and clearing your browser clears them.</p>
        <p><strong>What leaves your browser.</strong> Text you paste into an AI tool is sent to the AI provider to generate the result, processed under that provider's terms, and not used by us. It is not stored on our servers.</p>
        <p><strong>Job listings.</strong> The board aggregates public job APIs and links to the original source. If you apply, you deal with the employer directly; we never receive your application.</p>
        <p><strong>Job alerts.</strong> If you subscribe, we store your email address for the weekly digest only. One click unsubscribes.</p>
        <p><strong>No accounts, no ads, no trackers.</strong> There is no signup, no analytics cookies, no cross-site tracking.</p>
        <p>Questions: hello@solvecv.app</p>
      </div>
    </div>
  );
}
