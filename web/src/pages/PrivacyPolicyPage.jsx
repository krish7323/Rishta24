import LegalLayout from '../components/LegalLayout';
import { usePageTitle } from '../utils/seo';

export default function PrivacyPolicyPage() {
  usePageTitle(
    'Privacy Policy — RISHTA24 Matrimonial App',
    'Official Privacy Policy for RISHTA24 detailing data collection, profile visibility controls, Govt ID document processing, storage security, and user rights.'
  );

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `RISHTA24 (रिश्ता २४) is committed to protecting your privacy and ensuring the security of your personal and matrimonial data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our mobile application, web services, and administrative support portals.

By using RISHTA24, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please adjust your privacy settings or discontinue using the application.`,
    },
    {
      id: 'info-we-collect',
      title: 'Information We Collect',
      content: `To provide accurate 7-vector compatibility matching and identity verification, RISHTA24 collects information that you provide directly to us as well as data collected automatically during app interactions.

We collect:
- **Registration Details**: Email address, mobile phone number, encrypted password hash, first name, last name, date of birth, gender, and mother tongue.
- **Matrimonial Profile Payload**: Height, religion, community/caste, gotra, marital status, current location (city, state, country), education degree, occupation, annual income range, family background (nuclear/joint, parents' occupations), and lifestyle/dietary preferences.
- **Photos & Media**: Profile avatar images and gallery photos uploaded by you.
- **Verification Documents**: Government identification (Aadhaar Card or Passport) submitted voluntarily for obtaining the blue Verified Badge.`,
    },
    {
      id: 'info-you-provide',
      title: 'Information You Provide Directly',
      content: `When you interact with the 10-step profile wizard, update your partner preferences, send Express Interest requests, or communicate via 1-on-1 real-time socket chat, you provide data directly to our secure database servers.

Your communications, custom interest messages, and photo attachments sent in private chat rooms are stored securely in encrypted databases to maintain your chat history across mobile sessions.`,
    },
    {
      id: 'automatically-collected',
      title: 'Automatically Collected Information',
      content: `When accessing the application, our servers automatically log operational metadata to ensure platform security and performance:
- Device information (mobile device model, operating system version, unique device identifiers).
- Network & IP details for rate limiting, DDoS protection, and audit logging.
- App usage statistics (profile view counts, shortlist additions, last active timestamps).`,
    },
    {
      id: 'how-we-use-info',
      title: 'How We Use Your Information',
      content: `We process your data strictly to deliver core matrimonial features:
1. **7-Vector Compatibility Scoring**: Calculating match percentages across Age, Religion/Caste, Location, Education, Family, Lifestyle, and Completeness.
2. **Real-Time Socket Messaging**: Connecting mutual matches in private 1-on-1 socket rooms.
3. **Identity Verification Desk**: Inspecting Aadhaar/Passport documents to issue blue Verified Badges.
4. **VIP Membership Processing**: Generating Razorpay payment orders and verifying HMAC-SHA256 signatures.
5. **Safety & Moderation**: Processing report/block requests and detecting unauthorized activities.`,
    },
    {
      id: 'how-we-store-info',
      title: 'How We Store & Protect Information',
      content: `All sensitive information is stored in hardened databases with strict network isolation. Passwords are salted and hashed using Bcrypt. Session tokens use JSON Web Tokens (JWT) signed with secure access and refresh secret keys.

Administrative access to user dossiers and verification documents is restricted to authorized support personnel via Role-Based Access Control (RBAC) and immutable audit logs.`,
    },
    {
      id: 'data-security',
      title: 'Data Security Standards',
      content: `We implement industry-standard administrative, physical, and technical safeguards. All API communications between mobile/web clients and backend servers are transmitted over HTTPS with SSL/TLS encryption.

` + '`[UPDATE: For specific data retention schedules or CMEK storage details, contact privacy@rishta24.test]`',
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing & Privacy Controls',
      content: `We DO NOT sell, rent, or trade your personal information to third-party advertisers. Your profile payload is only visible to other registered RISHTA24 members according to your configured privacy rules.

Granular Phone & Photo Visibility:
- **Public**: Visible to registered members.
- **Verified Members Only**: Visible only to members with blue Verified Badges.
- **Mutual Matches Only**: Visible only after an Express Interest request has been accepted.`,
    },
    {
      id: 'third-party-services',
      title: 'Third-Party Services & Payment Gateways',
      content: `RISHTA24 integrates with select third-party service providers for payment processing and cloud infrastructure:
- **Razorpay**: Handles payment gateway transactions for VIP Gold memberships. Payment card numbers or UPI PINs are processed directly by Razorpay in compliance with PCI-DSS standards.
- **Cloud Media Hosting**: Profile images are hosted securely with encrypted access tokens.`,
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Storage Technologies',
      content: `On web preview and web clients, we use local storage and essential session tokens to remember your authentication state across page navigations. We do not use third-party tracking cookies for targeted advertising.`,
    },
    {
      id: 'location-info',
      title: 'Location Information',
      content: `Location details (City, State, Country) provided during profile setup are used solely for location-based search filtering and distance proximity calculations in our matching algorithm. Precise GPS tracking is not performed in the background.`,
    },
    {
      id: 'user-rights',
      title: 'User Rights & Control Options',
      content: `As a RISHTA24 member, you retain full rights over your data:
- **Edit & Update**: Modify your profile dossier, photo gallery, or partner preferences anytime.
- **Privacy Settings**: Adjust contact number and photo gallery visibility with one click.
- **Account Deletion**: Request account deactivation or full dossier removal by submitting a request to \`support@rishta24.test\`.`,
    },
    {
      id: 'data-retention',
      title: 'Data Retention Schedule',
      content: `We retain your profile data and chat history as long as your account remains active. Upon account deletion request, your personal profile payload and submitted verification documents are permanently purged from active production databases.

` + '`[UPDATE: Specify your actual legal retention timeframe here, e.g., 30 days post-deletion]`',
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy Protection",
      content: `RISHTA24 is strictly intended for individuals seeking matrimonial alliances who are at least 18 years of age (or the legal age of marriage in their jurisdiction). We do not knowingly collect or process data from individuals under 18.`,
    },
    {
      id: 'changes-to-policy',
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy periodically to reflect enhancements in security standards or new features. When changes are made, the "Last Updated" date at the top of this document will be updated accordingly.`,
    },
    {
      id: 'contact-info',
      title: 'Privacy Contact Information',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to our Privacy & Moderation Officer:

Email: \`privacy@rishta24.test\` or \`support@rishta24.test\`
Support Portal: RISHTA24 Help Desk
Address: ` + '`[YOUR OFFICIAL BUSINESS ADDRESS]`',
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How RISHTA24 collects, protects, and handles your personal matrimonial information."
      lastUpdated="August 2026"
      sections={sections}
    />
  );
}
