import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('footer.built_for')}
            </p>
          </div>
          
          <div className="flex space-x-6">
            <button
              onClick={() => console.log('Terms link clicked')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-terms"
            >
              {t('footer.terms')}
            </button>
            <button
              onClick={() => console.log('Privacy link clicked')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-privacy"
            >
              {t('footer.privacy')}
            </button>
            <button
              onClick={() => console.log('Accessibility link clicked')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-accessibility"
            >
              {t('footer.accessibility')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}