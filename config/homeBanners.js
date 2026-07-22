/** Default homepage banner slides (admin can edit/upload/toggle). */
export const DEFAULT_HOME_BANNERS = [
  {
    id: 'sell-phone',
    title: 'Sell old phone',
    subtitle: 'From your doorstep across India — fair price, instant payment.',
    ctaText: 'Sell Now',
    ctaLink: '/sell-old-mobile-phones/brand',
    imageUrl: '',
    enabled: true,
    sortOrder: 1,
  },
  {
    id: 'buy-refurb',
    title: 'Buy refurbished devices',
    subtitle: 'Certified quality phones, laptops and more with warranty.',
    ctaText: 'Shop Now',
    ctaLink: '/buy',
    imageUrl: '',
    enabled: true,
    sortOrder: 2,
  },
  {
    id: 'sell-laptop',
    title: 'Sell old laptop',
    subtitle: 'Get the best price for your laptop with free doorstep pickup.',
    ctaText: 'Sell Now',
    ctaLink: '/sell-old-laptops/brand',
    imageUrl: '',
    enabled: true,
    sortOrder: 3,
  },
];

export function defaultHomeBanners() {
  return DEFAULT_HOME_BANNERS.map((b) => ({ ...b }));
}
