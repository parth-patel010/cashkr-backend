/** Default homepage banners — image-only (same creatives as the mobile app). */
export const DEFAULT_HOME_BANNERS = [
  {
    id: 'app-banner-1',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '/sell-old-mobile-phones/brand',
    imageUrl: '',
    enabled: true,
    sortOrder: 1,
  },
  {
    id: 'app-banner-2',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '/buy',
    imageUrl: '',
    enabled: true,
    sortOrder: 2,
  },
];

export function defaultHomeBanners() {
  return DEFAULT_HOME_BANNERS.map((b) => ({ ...b }));
}
