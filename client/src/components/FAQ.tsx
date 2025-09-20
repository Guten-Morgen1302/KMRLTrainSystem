import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RevealItem } from '@/components/animations/SectionReveal';
import { useTranslation } from 'react-i18next';


export default function FAQ() {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: 'data_sources',
      question: t('faq.questions.data_sources.question'),
      answer: t('faq.questions.data_sources.answer')
    },
    {
      id: 'deployment',
      question: t('faq.questions.deployment.question'),
      answer: t('faq.questions.deployment.answer')
    },
    {
      id: 'security',
      question: t('faq.questions.security.question'),
      answer: t('faq.questions.security.answer')
    },
    {
      id: 'audit_trails',
      question: t('faq.questions.audit_trails.question'),
      answer: t('faq.questions.audit_trails.answer')
    },
    {
      id: 'override_governance',
      question: t('faq.questions.override_governance.question'),
      answer: t('faq.questions.override_governance.answer')
    },
    {
      id: 'maximo_integration',
      question: t('faq.questions.maximo_integration.question'),
      answer: t('faq.questions.maximo_integration.answer')
    }
  ];

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <RevealItem key={faq.id}>
              <Card className="hover-elevate transition-all duration-200 overflow-hidden">
                <CardHeader className="pb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto text-left hover:bg-transparent items-start gap-3 whitespace-normal"
                    onClick={() => toggleFaq(faq.id)}
                    data-testid={`button-faq-${faq.id}`}
                  >
                    <CardTitle 
                      className="text-lg font-semibold text-left leading-relaxed flex-1 min-w-0 pr-2"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {faq.question}
                    </CardTitle>
                    <div className="flex-shrink-0 mt-1">
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </Button>
                </CardHeader>
                
                {expandedFaq === faq.id && (
                  <CardContent className="pt-0">
                    <p 
                      className="text-muted-foreground leading-relaxed"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}