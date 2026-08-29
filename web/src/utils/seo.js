import { useEffect } from 'react';

export function usePageTitle(title, description) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | RISHTA24 (रिश्ता २४)`
      : 'RISHTA24 — Har Rishta, Ek Nayi Shuruaat | Official Matrimonial Application';
    document.title = fullTitle;

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
