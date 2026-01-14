export default function AcceptableUsePage() {
  return (
    <>
      <h1>Acceptable Use Policy</h1>
      <p className="lead">
        This Acceptable Use Policy (AUP) outlines the rules and standards for using Brainy. 
        It is designed to ensure a safe, secure, and productive environment for all academic users.
      </p>

      <h2>1. Allowed Uses</h2>
      <p>
        Brainy is built for the advancement of education. acceptable uses include:
      </p>
      <ul>
        <li>Conducting valid academic assessments and examinations.</li>
        <li>Practicing skills through institutional quizzes.</li>
        <li>Performing institutional evaluations and student progress tracking.</li>
        <li>Collaborative learning within assigned institutional roles.</li>
      </ul>

      <h2>2. Prohibited Uses</h2>
      <p>
        To maintain the platform's integrity, users are strictly prohibited from:
      </p>
      <ul>
        <li><strong>Academic Malpractice:</strong> Cheating, sharing quiz answers, or using unauthorized aids during assessments.</li>
        <li><strong>Impersonation:</strong> Creating accounts with false identities or logging into another user's account.</li>
        <li><strong>Abuse:</strong> Harassing, threatening, or mistreating Students, Tutors, or Platform Admins.</li>
        <li><strong>Automation:</strong> Using bots, scrapers, or scripts to manipulate assessments or extract proprietary content.</li>
        <li><strong>Distribution:</strong> Sharing or selling questions and answers from institutional assessments.</li>
      </ul>

      <h2>3. Security Violations</h2>
      <p>
        Unauthorized attempts to compromise the platform are strictly forbidden, including:
      </p>
      <ul>
        <li>Attempting to bypass security safeguards or role-based access controls.</li>
        <li>Introducing malware, viruses, or any code designed to disrupt platform performance.</li>
        <li>Performing vulnerability scans or penetration tests without express written authorization.</li>
      </ul>

      <h2>4. Consequences of Misuse</h2>
      <p>
        Violations of this policy will result in disciplinary action. Depending on the severity, 
        actions may include:
      </p>
      <ul>
        <li><strong>Warnings:</strong> Informal notifications for minor or accidental infractions.</li>
        <li><strong>Suspension:</strong> Temporary removal of platform access for investigation.</li>
        <li><strong>Permanent Ban:</strong> Irrevocable termination of your account and platform access.</li>
        <li><strong>Legal Action:</strong> Reporting serious violations to law enforcement or your institution.</li>
      </ul>

      <h2>5. Reporting Violations</h2>
      <p>
        If you witness or suspect a violation of this policy, please report it immediately via the in-app 
        reporting tools or by emailing <a href="mailto:integrity@brainy.os">integrity@brainy.os</a>.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          Brainy reserves the right to update this policy at any time to adapt to emerging security 
          threats and academic standards.
        </p>
      </div>
    </>
  );
}
