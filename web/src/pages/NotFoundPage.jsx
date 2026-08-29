import NotFound from '../components/NotFound';
import { usePageTitle } from '../utils/seo';

export default function NotFoundPage() {
  usePageTitle('Page Not Found — RISHTA24');
  return <NotFound />;
}
