import { describe, expect, it } from 'vitest';
import { getPartnerPromotionConfig } from './partnerPromotion';

describe('partnerPromotion', () => {
  it('retorna configuracao quando nome e url sao validos', () => {
    const result = getPartnerPromotionConfig({
      VITE_PARTNER_APP_NAME: 'App Parceiro X',
      VITE_PARTNER_APP_URL: 'https://parceiro.example.com',
      VITE_PARTNER_APP_DESCRIPTION: 'Descricao customizada.',
      VITE_PARTNER_APP_CTA_LABEL: 'Acessar parceiro',
    });

    expect(result).toEqual({
      name: 'App Parceiro X',
      url: 'https://parceiro.example.com',
      description: 'Descricao customizada.',
      ctaLabel: 'Acessar parceiro',
      disclosure: 'Conteúdo parceiro',
    });
  });

  it('retorna null quando nome estiver vazio', () => {
    const result = getPartnerPromotionConfig({
      VITE_PARTNER_APP_NAME: '  ',
      VITE_PARTNER_APP_URL: 'https://parceiro.example.com',
    });

    expect(result).toBeNull();
  });

  it('retorna null quando url for invalida ou protocolo nao suportado', () => {
    expect(
      getPartnerPromotionConfig({
        VITE_PARTNER_APP_NAME: 'App Parceiro X',
        VITE_PARTNER_APP_URL: 'ftp://parceiro.example.com',
      }),
    ).toBeNull();

    expect(
      getPartnerPromotionConfig({
        VITE_PARTNER_APP_NAME: 'App Parceiro X',
        VITE_PARTNER_APP_URL: 'javascript:alert(1)',
      }),
    ).toBeNull();
  });

  it('aplica fallback para descricao e cta quando ausentes', () => {
    const result = getPartnerPromotionConfig({
      VITE_PARTNER_APP_NAME: 'App Parceiro X',
      VITE_PARTNER_APP_URL: 'http://parceiro.example.com',
    });

    expect(result?.description).toBe(
      'Conheça uma solução parceira que pode complementar sua organização financeira.',
    );
    expect(result?.ctaLabel).toBe('Conhecer app parceiro');
  });
});

