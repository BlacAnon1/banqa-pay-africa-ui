
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex gap-4">
          <Link 
            to="/privacy-policy" 
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms-of-service" 
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <Link 
            to="/contact-us" 
            className="hover:text-foreground transition-colors"
          >
            Contact Us
          </Link>
        </div>
        <p>&copy; 2025 Banqa. All rights reserved.</p>
      </div>
    </footer>
  );
}
