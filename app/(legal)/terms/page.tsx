export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="lead">
        Welcome to Brainy. These Terms of Service ("Terms") govern your use of the Brainy platform, 
        services, and website. By accessing or using Brainy, you agree to be bound by these Terms.
      </p>

      <h2>1. Introduction</h2>
      <p>
        Brainy is a comprehensive academic assessment ecosystem designed for institutions, tutors, and students. 
        These terms establish a legal agreement between Brainy OS ("we," "us," or "our") and you as a user 
        ("User," "you," or "your").
      </p>

      <h2>2. Definitions</h2>
      <ul>
        <li><strong>Platform:</strong> The Brainy website, application, and underlying infrastructure.</li>
        <li><strong>Institution:</strong> A verified academic body (school, university, college) registered on the platform.</li>
        <li><strong>Tutor:</strong> An individual authorized by an institution to create and manage assessments.</li>
        <li><strong>Student:</strong> An individual enrolled in an institution and participating in assessments on Brainy.</li>
      </ul>

      <h2>3. Eligibility</h2>
      <p>
        To use Brainy, you must be at least 13 years of age. If you are representing an Institution, 
        you warrant that you have the legal authority to bind that entity to these Terms.
      </p>

      <h2>4. Account Registration</h2>
      <p>
        Users are required to register for an account to access certain features. You agree to provide 
        accurate, current, and complete information. You are solely responsible for maintaining the 
        confidentiality of your account credentials and for all activities that occur under your account.
      </p>

      <h2>5. Roles & Access</h2>
      <p>
        Access to Brainy is role-based. Your permissions and toolsets are determined by your assigned 
        role (Student, Tutor, Institution Admin, or Platform Admin). Misuse of role permissions or 
        attempting to gain unauthorized access to other roles is a violation of these Terms.
      </p>

      <h2>6. Platform Usage</h2>
      <p>
        Brainy is intended for educational and academic assessment purposes only. You agree not to:
      </p>
      <ul>
        <li>Use the platform for any illegal or unauthorized purpose.</li>
        <li>Interfere with or disrupt the integrity or performance of the platform.</li>
        <li>Attempt to scrape, automate, or extract data without express permission.</li>
      </ul>

      <h2>7. Institution Registration</h2>
      <p>
        Institutions must go through a verification process. Brainy reserves the right to approve or 
        reject any registration request at its sole discretion. Verified institutions are responsible 
        for the conduct of their assigned Tutors and Students.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        Brainy OS owns all rights, title, and interest in the platform, including branding, software, 
        and design. Institutions and Tutors retain ownership of the original academic content they upload, 
        but grant Brainy a license to host and process such content for platform functionality.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your account at any time if we believe you have breached these Terms. 
        Institutions may be removed for verified reports of academic malpractice or failure to maintain 
        verification standards.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        Brainy is provided "as is" without warranties of any kind. We are not liable for any indirect, 
        incidental, or consequential damages arising from your use of the platform or the accuracy 
        of academic data managed by users.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to its 
        conflict of laws principles. Any disputes shall be resolved in the competent courts of that jurisdiction.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          If you have questions about these Terms, please contact our legal team.
        </p>
      </div>
    </>
  );
}
