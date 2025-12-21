import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Status */}
      <h1
        className="mb-4 text-7xl font-bold"
        style={{ color: "var(--primary)" }}
      >
        404
      </h1>

      {/* Message */}
      <h2 className="mb-2 text-2xl font-semibold">
        Page not found
      </h2>

      <p
        className="mb-8 max-w-md text-sm"
        style={{ color: "var(--muted-foreground)" }}
      >
        The page you’re looking for doesn’t exist or may have been moved.
        Don’t worry — you’re still in the right place.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-md px-5 py-2.5 text-sm font-medium transition"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          Go to Homepage
        </Link>

        <Link
          href="/login"
          className="rounded-md border px-5 py-2.5 text-sm font-medium transition"
          style={{
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          Login
        </Link>
      </div>

      {/* Branding */}
      <p
        className="mt-10 text-xs"
        style={{ color: "var(--muted-foreground)" }}
      >
        Brainy • Powered by Ctrotech Tutor Insights
      </p>
    </main>
  );
}
