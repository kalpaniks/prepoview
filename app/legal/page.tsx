export default function LegalPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="border-border/60 mx-auto flex w-full max-w-3xl flex-1 flex-col border-r border-l">
        <header className="bg-card/40 border-border/60 border-b">
          <div className="mx-auto flex h-16 w-full items-center justify-center px-4 sm:px-6">
            <h1 className="text-lg font-semibold">Legal, Privacy & Security</h1>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
          <section id="terms" aria-labelledby="terms-title" className="space-y-4">
            <h2 id="terms-title" className="text-lg font-semibold">
              Terms of Service
            </h2>
            <div className="text-muted-foreground space-y-3 text-base">
              <p>
                <strong>Service scope.</strong> Repofyi lets you share read-only views of private
                GitHub repositories you explicitly authorize. Access is time-boxed and view-limited.
              </p>
              <p>
                <strong>No repository writes.</strong> We never write to, modify, or commit to your
                repositories.
              </p>
              <p>
                <strong>Acceptable use.</strong> You agree not to scrape, bypass protections, or
                attempt to download or reproduce the full codebase by automated means.
              </p>
              <p>
                <strong>Availability.</strong> The service is provided on a best-effort basis
                without uptime guarantees. We may suspend access to protect security or comply with
                policy.
              </p>
              <p>
                <strong>Revocation.</strong> You can revoke shares at any time from your dashboard
                and revoke OAuth access from your GitHub account settings.
              </p>
            </div>
          </section>

          <div className="my-8 border-t" />

          <section id="privacy" aria-labelledby="privacy-title" className="space-y-4">
            <h2 id="privacy-title" className="text-lg font-semibold">
              Privacy Policy
            </h2>
            <div className="text-muted-foreground space-y-3 text-base">
              <p>
                <strong>Data we collect.</strong> Your GitHub profile (ID, login, name, email),
                share metadata (repo owner/name, expiration, view limits, view counts, recipient
                label), and viewer session IDs with expiry timestamps. Minimal operational logs
                (timestamps and error context) may be recorded for reliability and abuse prevention.
              </p>
              <p>
                <strong>Data we do not store.</strong> We do not persist raw repository contents in
                our database. File trees may be cached in memory briefly for performance; file
                contents are fetched from GitHub per request and streamed to the client without
                persistent storage.
              </p>
              <p>
                <strong>Tokens.</strong> OAuth access tokens are <em>encrypted at rest</em> and
                decrypted only when needed to call the GitHub API. We do not log tokens.
              </p>
              <p>
                <strong>Cookies.</strong> We set an httpOnly, path-scoped viewer session cookie for
                read-only access validation. Session cookies are not accessible to client-side
                scripts.
              </p>
              <p>
                <strong>Third parties.</strong> We call the GitHub API to read repository metadata
                and files. We do not share your data with advertising or analytics providers.
              </p>
              <p>
                <strong>Retention.</strong> Share records remain until you delete them. Viewer
                sessions auto-expire. You may delete shares and revoke GitHub access at any time.
              </p>
            </div>
          </section>

          <div className="my-8 border-t" />

          <section id="permissions" aria-labelledby="permissions-title" className="space-y-4">
            <h2 id="permissions-title" className="text-lg font-semibold">
              Security & Permissions
            </h2>
            <div className="text-muted-foreground space-y-3 text-base">
              <p>
                <strong>GitHub OAuth scopes.</strong> We request <code>repo</code> and{' '}
                <code>user:email</code> to read private repository content and your verified email.
                We only use read operations and never write to your repositories.
              </p>
              <p>
                <strong>Token handling.</strong> Tokens are encrypted using our server-side key and
                decrypted in-process when contacting GitHub. We avoid long-lived caches of sensitive
                data.
              </p>
              <p>
                <strong>Viewer sessions.</strong> Each viewer session is time-limited (typically 30
                minutes), httpOnly, and validated on every API call. Expiration and view limits are
                enforced server-side.
              </p>
              <p>
                <strong>Content controls.</strong> UI-level copy/download shortcuts are blocked as a
                deterrent; however, no client-side control can guarantee perfect prevention.
                Server-side policies (no repo checkout, no archives) reduce exfiltration vectors.
              </p>
              <p>
                <strong>Your controls.</strong> Delete shares in the dashboard to revoke access
                immediately and revoke GitHub authorization from your account settings to sever API
                access.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
