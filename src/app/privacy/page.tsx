export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Last updated: March 24, 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            When you connect your TikTok account to DSSRT, we collect the following information
            through the TikTok API:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Basic profile information (display name, avatar)</li>
            <li>Account statistics (follower count, following count, likes count, video count)</li>
            <li>Video performance data (views, likes, comments, shares per video)</li>
            <li>OAuth tokens required to access your TikTok data</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use the collected data exclusively to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Display analytics and performance metrics on your dashboard</li>
            <li>Generate trend reports and account comparisons</li>
            <li>Maintain your authenticated session with TikTok</li>
          </ul>
          <p className="mt-2">
            We do not sell, share, or distribute your data to any third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">3. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Supabase, a hosted database service with
            encryption at rest and in transit. OAuth tokens are stored server-side and are
            never exposed to the client browser. Access tokens are automatically refreshed
            and old tokens are overwritten.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">4. Data Retention</h2>
          <p>
            We retain your analytics data for as long as your account is connected to the
            Service. You may disconnect your TikTok account at any time through the Settings
            page, after which your OAuth tokens will be removed from our systems.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">5. Third-Party Services</h2>
          <p>
            This application integrates with the following third-party services:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>TikTok API</strong> &mdash; to retrieve account metrics and video data.
              Subject to{" "}
              <a
                href="https://www.tiktok.com/legal/terms-of-service"
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok&apos;s Privacy Policy
              </a>
            </li>
            <li>
              <strong>Supabase</strong> &mdash; for secure data storage and authentication
            </li>
            <li>
              <strong>Vercel</strong> &mdash; for application hosting
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Access the data we hold about your TikTok account</li>
            <li>Disconnect your TikTok account and revoke access at any time</li>
            <li>Request deletion of your stored data</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected
            on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">8. Contact</h2>
          <p>
            For questions or concerns about this Privacy Policy or your data, please contact
            the application administrator.
          </p>
        </section>
      </div>
    </div>
  );
}
