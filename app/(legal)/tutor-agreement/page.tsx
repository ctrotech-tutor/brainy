export default function TutorAgreementPage() {
  return (
    <>
      <h1>Tutor & Lecturer Agreement</h1>
      <p className="lead">
        As a Tutor on Brainy, you play a vital role in our ecosystem. This agreement 
        governs your responsibilities, the content you create, and the professional 
        conduct expected on the platform.
      </p>

      <h2>1. Authorization & Eligibility</h2>
      <p>
        Tutor accounts are established through institution-verified onboarding or direct 
        invitation by an Institution Admin. By accepting this role, you confirm that you 
        are authorized by your institution to manage academic assessments.
      </p>

      <h2>2. Professional Responsibilities</h2>
      <p>
        As a Tutor, you agree to:
      </p>
      <ul>
        <li>Create fair and accurate assessments for your students.</li>
        <li>Maintain the confidentiality of assessment questions and student response data.</li>
        <li>Ensure that grades and feedback are provided in a timely and professional manner.</li>
        <li>Avoid any conflict of interest that could compromise assessment integrity.</li>
      </ul>

      <h2>3. Content Ownership & Licensing</h2>
      <p>
        Original assessments created by you are subject to the intellectual property policies 
         of your employer (the Institution). Brainy serves as the platform for hosting 
        this content and provides you with the tools to manage it effectively.
      </p>

      <h2>4. Prohibited Actions</h2>
      <p>
        Tutors are strictly prohibited from:
      </p>
      <ul>
        <li>Manipulating student results or academic records for personal bias.</li>
        <li>Sharing or selling student data or assessment content to third parties.</li>
        <li>Using students' personal information for non-academic purposes.</li>
      </ul>

      <h2>5. Use of AI Tools</h2>
      <p>
        Tutors are encouraged to use Brainy's AI-assisted tools for quiz generation but 
        should always review and verify AI-generated content for accuracy and fairness 
        before deploying it to students.
      </p>

      <h2>6. Termination of Access</h2>
      <p>
        Your tutor status can be revoked at any time by your Institution Admin or by 
        Brainy OS in cases of verified professional misconduct. Upon termination, 
        your access to institutional records and student data will be immediately removed.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          Thank you for your dedication to education and for maintaining the high 
          standards of the Brainy platform.
        </p>
      </div>
    </>
  );
}
