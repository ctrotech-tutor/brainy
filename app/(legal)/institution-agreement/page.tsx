export default function InstitutionAgreementPage() {
  return (
    <>
      <h1>Institution Agreement</h1>
      <p className="lead">
        This agreement outlines the relationship between Brainy OS and the verified academic 
        entities that use our platform. It defines the responsibilities for data management, 
        user verification, and academic standards.
      </p>

      <h2>1. Institution Eligibility</h2>
      <p>
        To register as an Institution, you must be a legally recognized educational entity. 
        You are required to provide valid documentation for verification. Brainy reserves 
        the right to verify the identity and authority of the registering administrator.
      </p>

      <h2>2. Administrative Responsibilities</h2>
      <p>
        Verified institutions are responsible for:
      </p>
      <ul>
        <li>Defining and managing faculties and department structures.</li>
        <li>Assigning Tutors and ensuring they have the authority to create content.</li>
        <li>Validating the enrollment status of Students registered under the institution.</li>
        <li>Maintaining the confidentiality of institutional administrative accounts.</li>
      </ul>

      <h2>3. Data Ownership & Management</h2>
      <p>
        The Institution retains all intellectual property rights to the academic content 
        created by its staff and students. Brainy acts as a service provider for the 
        management, hosting, and secure processing of this data.
      </p>

      <h2>4. Compliance & Standards</h2>
      <p>
        Institutions agree to use Brainy in compliance with all relevant local and 
        international education laws and regulations. You are responsible for ensuring 
        that assessments conducted through Brainy meet your own internal academic standards.
      </p>

      <h2>5. Verification of Content</h2>
      <p>
        Brainy does not audit the academic accuracy of the quizzes or assessments provided 
        by institutions. The accuracy and fairness of content are the sole responsibility 
        of the respective institution and its assigned Tutors.
      </p>

      <h2>6. Termination of Agreement</h2>
      <p>
        Breaking institutional standards or verified reports of systemic malpractice 
        may result in the suspension or termination of the Institution's platform access. 
        In the event of termination, Brainy will provide a 30-day window for the 
        institution to export its academic records.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm italic text-muted-foreground">
          This agreement ensures that Brainy remains a powerful and trusted extension 
          of your institution's digital infrastructure.
        </p>
      </div>
    </>
  );
}
