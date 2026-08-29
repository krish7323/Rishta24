import LegalLayout from '../components/LegalLayout';
import { usePageTitle } from '../utils/seo';

export default function TermsPage() {
  usePageTitle(
    'Terms of Use — RISHTA24 Matrimonial App',
    'Official Terms of Use for RISHTA24 covering user eligibility, profile accuracy, acceptable conduct, VIP subscription terms, and platform disclaimers.'
  );

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By creating an account, downloading, accessing, or using the RISHTA24 (रिश्ता २४) mobile application or web portal, you agree to be bound by these Terms of Use and our Privacy Policy.

If you do not agree to all terms and conditions set forth in this agreement, you must immediately cease accessing and using the platform.`,
    },
    {
      id: 'eligibility',
      title: '2. Eligibility & Member Conduct',
      content: `To register as a member of RISHTA24 or create a profile on behalf of a family member, you must meet the following legal requirements:
- You must be at least 18 years of age (for females) or 21 years of age (for males), or meet the legal age of marriage in your jurisdiction.
- You must be legally competent to enter into a binding contract and currently seeking a lawful matrimonial alliance.
- All information provided in your profile payload (name, age, education, marital status, community, verification documents) must be truthful, accurate, and kept updated.`,
    },
    {
      id: 'user-responsibilities',
      title: '3. User Responsibilities & Profile Integrity',
      content: `Members are solely responsible for maintaining the confidentiality of their login credentials and for all activities that occur under their account.

You agree to:
- Provide authentic photographs and accurate demographic information.
- Submit genuine government identification (Aadhaar/Passport) if applying for a blue Verified Badge.
- Treat other members, candidates, and support staff with courtesy, respect, and dignity.`,
    },
    {
      id: 'prohibited-activities',
      title: '4. Prohibited Activities & Zero Tolerance Policy',
      content: `RISHTA24 maintains a strict zero-tolerance policy against fraudulent activities, harassment, and abuse.

The following behaviors are strictly prohibited:
- Posting false, misleading, defamatory, obscene, or fraudulent profile information.
- Soliciting money, financial assistance, investments, or commercial favors from other members.
- Harassing, stalking, or sending offensive media attachments in chat rooms.
- Using automated bots, scrapers, or scripts to extract user data.
- Attempting to bypass room authorization security or hijack socket connections.

Violation of these rules will result in immediate account suspension, permanent ban, and forfeiture of any active VIP memberships.`,
    },
    {
      id: 'vip-memberships',
      title: '5. VIP Memberships & Razorpay Subscription Terms',
      content: `RISHTA24 offers optional VIP Gold membership tiers (Monthly ₹1,499, Quarterly ₹3,499, Yearly ₹7,999) unlocking direct phone contacts, priority placement, and enhanced search.

Subscription & Billing Rules:
- Payments are processed securely via Razorpay with HMAC-SHA256 signature verification.
- All fee amounts are stated in Indian Rupees (INR) inclusive of applicable taxes.
- Memberships are non-transferable and non-refundable once activated, except as required by applicable consumer protection laws.`,
    },
    {
      id: 'verification-disclaimer',
      title: '6. Identity Verification & Verified Badges',
      content: `While RISHTA24 offers an optional Govt ID inspection desk (issuing Verified Badges upon inspecting Aadhaar/Passport documents), members are strongly advised to exercise independent due diligence and family background checks before finalizing any matrimonial alliance.

RISHTA24 does not guarantee the moral character or personal background of any member beyond verifying submitted document metadata.`,
    },
    {
      id: 'intellectual-property',
      title: '7. Intellectual Property Rights',
      content: `All design elements, brand logos, codebases, 7-vector matching algorithms, graphics, and visual design assets associated with RISHTA24 (रिश्ता २४) are the exclusive property of the application owners.

You may not copy, modify, distribute, or reverse-engineer any portion of the application without prior written permission.`,
    },
    {
      id: 'third-party-links',
      title: '8. Third-Party Services & Links',
      content: `The application may integrate third-party payment gateways (Razorpay) or cloud services. RISHTA24 is not responsible for the privacy practices, uptime, or performance of external third-party services.`,
    },
    {
      id: 'limitation-of-liability',
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by applicable law, RISHTA24 and its developers shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use of the application, communications with other members, or inability to find a match.

` + '`[UPDATE: Add specific jurisdiction liability limits here if required]`',
    },
    {
      id: 'modifications',
      title: '10. Modifications to Terms',
      content: `We reserve the right to modify these Terms of Use at any time. Continued use of the platform following the posting of updated terms constitutes your acceptance of the revised agreement.`,
    },
    {
      id: 'contact-legal',
      title: '11. Contact Information & Legal Inquiries',
      content: `For legal notices, complaints, or questions regarding these Terms of Use, please contact our Legal Desk:

Email: \`legal@rishta24.test\` or \`support@rishta24.test\`
Support Desk: RISHTA24 Customer Care
Address: ` + '`[YOUR OFFICIAL BUSINESS ADDRESS]`',
    },
  ];

  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Terms and conditions governing your use of the RISHTA24 matrimonial application."
      lastUpdated="August 2026"
      sections={sections}
    />
  );
}
