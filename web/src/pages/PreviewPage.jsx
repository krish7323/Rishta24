import AppPreviewSimulator from '../components/AppPreviewSimulator';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { usePageTitle } from '../utils/seo';

export default function PreviewPage() {
  usePageTitle(
    'Interactive Mobile App Preview — RISHTA24',
    'Experience the live interactive mobile app preview of RISHTA24 including 7-vector matching, Socket.IO chat, profile wizard, and VIP memberships.'
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageHeader
        badge="Live Experience"
        title="Interactive RISHTA24 App Preview"
        subtitle="Click between screens to test 7-vector match dossiers, real-time socket chat, profile wizard, Aadhaar verification desk, and VIP memberships."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppPreviewSimulator />
      </section>

      <CTASection
        title="Like what you see on the application interface?"
        subtitle="Download the Android package directly or explore our full list of capabilities."
        buttonText="Explore Features"
        buttonTo="/features"
      />
    </div>
  );
}
