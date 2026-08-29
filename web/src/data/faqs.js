export const faqCategories = [
  { id: 'all', label: 'All FAQs' },
  { id: 'general', label: 'General' },
  { id: 'matching', label: 'Matching Algorithm' },
  { id: 'safety', label: 'Safety & Verification' },
  { id: 'membership', label: 'VIP Memberships' },
  { id: 'technical', label: 'Technical & Demo Accounts' },
];

export const faqs = [
  {
    id: 1,
    category: 'general',
    question: 'What is RISHTA24?',
    answer: 'RISHTA24 (रिश्ता २४) is a modern, production-ready matrimonial application built with Node.js, Express, MongoDB, Socket.IO, and React Native (Expo). It features a 7-vector compatibility matching algorithm, real-time 1-on-1 socket chat, Aadhaar/Passport document verification, and Razorpay VIP membership integration.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Who can use RISHTA24?',
    answer: 'RISHTA24 is built for individuals and families seeking serious matrimonial alliances across Indian cities and NRI communities worldwide. Profiles can be registered by candidates themselves or on behalf of a son, daughter, sibling, or relative.',
  },
  {
    id: 3,
    category: 'matching',
    question: 'How does the 7-Vector Compatibility Score work?',
    answer: 'Our algorithm computes a weighted percentage score based on 7 vectors: Age & Height Proximity (15%), Religion & Community (20%), Location Proximity (15%), Education & Profession (15%), Lifestyle & Diet (15%), Shared Hobbies (10%), and Profile Completeness/Verification (10%). Final scores are normalized between 60% and 98%.',
  },
  {
    id: 4,
    category: 'safety',
    question: 'How do I get the blue Verified Badge?',
    answer: 'You can request verification by submitting a photo of your Aadhaar Card or Passport. Our Admin Moderation Desk inspects document details against your profile payload and awards an official blue Verified Badge.',
  },
  {
    id: 5,
    category: 'safety',
    question: 'Is my personal phone number visible to everyone?',
    answer: 'No. RISHTA24 provides granular contact visibility settings. You can set your phone number visibility to "Public", "Verified Members Only", or "Mutual Matches Only". You can update these preferences anytime in profile settings.',
  },
  {
    id: 6,
    category: 'membership',
    question: 'What VIP Membership plans are available?',
    answer: 'We offer 3 plans: 1 Month Premium (₹1,499 - 25% OFF), 3 Months Gold (₹3,499 - 30% OFF, Most Popular), and 12 Months Platinum (₹7,999 - 50% OFF). Memberships unlock direct phone contact access, visitor tracking, incognito mode, and search profile boost.',
  },
  {
    id: 7,
    category: 'membership',
    question: 'How are payment orders processed?',
    answer: 'Payments are processed securely via Razorpay with HMAC-SHA256 signature verification supporting UPI, credit/debit cards, and net banking.',
  },
  {
    id: 8,
    category: 'chat',
    question: 'When does real-time Socket chat become active?',
    answer: 'Direct 1-on-1 real-time socket chat becomes active once a mutual match is formed (i.e., when an Express Interest request is accepted by the candidate).',
  },
  {
    id: 9,
    category: 'safety',
    question: 'What happens when I report or block a user?',
    answer: 'Blocking a user immediately prevents them from viewing your profile, sending messages, or connecting with you. Reports are routed to the 24/7 Admin Moderation Desk for investigation and immediate action.',
  },
  {
    id: 10,
    category: 'technical',
    question: 'Are there preloaded demo accounts available for testing?',
    answer: 'Yes! Super Admin account (`admin@rishta24.test` / `AdminPass123!`) grants access to the Admin Control Center. Demo Member account (`demo@rishta24.test` / `Password123!`) comes preloaded with mutual matches, incoming interests, and active chat history.',
  },
];
