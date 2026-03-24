export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Last updated: March 24, 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing and using DSSRT (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p>
            DSSRT is an internal analytics dashboard that displays TikTok account metrics
            and performance data for authorized accounts. The Service aggregates publicly
            available data from TikTok through their official API.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">3. Authorization and Access</h2>
          <p>
            Access to the Service is restricted to authorized users only. By connecting your
            TikTok account, you authorize the Service to access your account metrics through
            the TikTok API in accordance with TikTok&apos;s Platform Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">4. Data Usage</h2>
          <p>
            The Service collects and displays account metrics including but not limited to:
            views, likes, comments, shares, follower counts, and video performance data.
            This data is used solely for analytics and reporting purposes within the dashboard.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">5. Third-Party Services</h2>
          <p>
            The Service integrates with TikTok&apos;s API. Your use of TikTok is governed by
            TikTok&apos;s own Terms of Service and Privacy Policy. We are not responsible for
            the availability or accuracy of data provided by third-party services.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">6. Disclaimer</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. We do not
            guarantee the accuracy, completeness, or timeliness of the analytics data displayed.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">7. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            Service after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">8. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact the application administrator.
          </p>
        </section>
      </div>
    </div>
  );
}
