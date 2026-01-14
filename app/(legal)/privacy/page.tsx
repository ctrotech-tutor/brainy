export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="lead">
        At Brainy, we are committed to protecting your privacy and ensuring the security of your academic 
        and personal data. This policy explains how we collect, use, and safeguard your information.
      </p>

      <h2>1. Information Collected</h2>
      <p>
        We collect information that you provide directly to us, as well as information generated through 
        your use of the platform:
      </p>
      <ul>
        <li><strong>Personal Data:</strong> Name, email address, password, and profile image.</li>
        <li><strong>Institutional Data:</strong> Institution name, address, verification documents, and department structures.</li>
        <li><strong>Academic Data:</strong> Quiz results, assessment content, grading history, and student performance analytics.</li>
      </ul>

      <h2>2. How Data Is Used</h2>
      <p>
        Your data is processed to provide a seamless and secure academic experience:
      </p>
      <ul>
        <li><strong>Authentication:</strong> To verify your identity and manage account access.</li>
        <li><strong>Verification:</strong> To confirm the legitimacy of institutions and roles.</li>
        <li><strong>Academic Processes:</strong> To facilitate testing, grading, and result reporting.</li>
        <li><strong>Analytics:</strong> To provide insights into learning progress and institutional performance.</li>
      </ul>

      <h2>3. Legal Basis for Processing</h2>
      <p>
        We process your data based on:
      </p>
      <ul>
        <li><strong>Consent:</strong> Explicit permission you provide during registration.</li>
        <li><strong>Contractual Necessity:</strong> To fulfill our obligations to you and your institution.</li>
        <li><strong>Legitimate Interest:</strong> Maintaining platform security and improving our scoring algorithms.</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your personal data. We only share information with:
      </p>
      <ul>
        <li><strong>Your Institution:</strong> Tutors and Admins have access to relevant student performance data.</li>
        <li><strong>Service Providers:</strong> Secure third parties for email delivery (e.g., Resend) and cloud storage.</li>
      </ul>

      <h2>5. Data Storage & Security</h2>
      <p>
        We implement industry-standard security measures, including end-to-end encryption for sensitive data, 
        strict role-based access controls, and regular security audits. Your data is stored securely in 
        compliant cloud environments.
      </p>

      <h2>6. User Rights</h2>
      <p>
        You have the right to access your data, request corrections, and export your academic records. 
        Requests for data deletion should be coordinated through your institution admin if you are 
        currently enrolled.
      </p>

      <h2>7. Student Data Protection</h2>
      <p>
        We treat student data with the highest level of sensitivity. Institutions maintain primary 
        control over student records, and Brainy acts as a processor to ensure data integrity and security.
      </p>

      <h2>8. International Transfers</h2>
      <p>
        By using Brainy, you acknowledge that your data may be processed in countries where our cloud 
        infrastructure is located. We ensure all transfers comply with relevant data protection laws.
      </p>

      <h2>9. Contact Information</h2>
      <p>
        For any privacy-related concerns or to exercise your data rights, please contact our Data 
        Protection Officer at <a href="mailto:privacy@brainy.os">privacy@brainy.os</a>.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          Last Updated: Jan 2026. This policy is reviewed annually to ensure compliance with global data 
          protection standards (including GDPR and NDPR).
        </p>
      </div>
    </>
  );
}
