export default function CookiePolicyPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p className="lead">
        Brainy uses cookies and similar technologies to provide a secure and efficient 
        experience. This policy explains what these technologies are and why we use them.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help us remember your 
        preferences and keep your session secure. They are essential for the role-based 
        navigation and academic integrity features of Brainy.
      </p>

      <h2>2. Categories of Cookies Used</h2>
      <p>
        We use the following types of cookies:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Critical for login, session persistence, and security verification. The platform cannot function without these.</li>
        <li><strong>Preference Cookies:</strong> Remember your theme choices, language settings, and dashboard layouts.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform to improve our tools for tutors and students.</li>
      </ul>

      <h2>3. Third-Party Tracking</h2>
      <p>
        We use limited third-party services that may set their own cookies:
      </p>
      <ul>
        <li><strong>Communication:</strong> Email verification services to ensure secure onboarding.</li>
        <li><strong>Performance:</strong> Analytics providers to monitor platform uptime and responsiveness.</li>
      </ul>

      <h2>4. Managing Your Preferences</h2>
      <p>
        Most web browsers allow you to control cookie settings. You can choose to block 
        or delete cookies through your browser settings, but please note that this will 
        prevent you from logging in and participating in assessments on Brainy.
      </p>

      <h2>5. Local Storage</h2>
      <p>
        In addition to cookies, we use browser "Local Storage" and "Session Storage" to 
        temporarily cache assessment progress and ensure that your data is not lost 
        during an unexpected network disconnection.
      </p>

      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this policy as we implement new technical features. We will notify 
        users of any significant changes via the platform dashboard.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          For further questions about our use of cookies, please contact the site 
          administrator.
        </p>
      </div>
    </>
  );
}
