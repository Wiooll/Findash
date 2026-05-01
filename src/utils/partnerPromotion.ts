export interface PartnerPromotionConfig {
  name: string;
  description: string;
  url: string;
  ctaLabel: string;
  disclosure: string;
}

interface PartnerPromotionEnv {
  VITE_PARTNER_APP_NAME?: string;
  VITE_PARTNER_APP_DESCRIPTION?: string;
  VITE_PARTNER_APP_URL?: string;
  VITE_PARTNER_APP_CTA_LABEL?: string;
}

const DEFAULT_DESCRIPTION = 'Conheça uma solução parceira que pode complementar sua organização financeira.';
const DEFAULT_CTA_LABEL = 'Conhecer app parceiro';
const DEFAULT_DISCLOSURE = 'Conteúdo parceiro';

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getPartnerPromotionConfig = (env: PartnerPromotionEnv): PartnerPromotionConfig | null => {
  const name = env.VITE_PARTNER_APP_NAME?.trim() || '';
  const url = env.VITE_PARTNER_APP_URL?.trim() || '';

  if (!name || !isValidHttpUrl(url)) {
    return null;
  }

  return {
    name,
    url,
    description: env.VITE_PARTNER_APP_DESCRIPTION?.trim() || DEFAULT_DESCRIPTION,
    ctaLabel: env.VITE_PARTNER_APP_CTA_LABEL?.trim() || DEFAULT_CTA_LABEL,
    disclosure: DEFAULT_DISCLOSURE,
  };
};

