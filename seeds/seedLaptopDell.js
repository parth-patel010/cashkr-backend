import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

const commonFunctionalDeductions = {
  keyboard: 7,
  cdDrive: 7,
  trackpad: 18,
  battery: 6,
  speakers: 3,
  wifi: 5,
  ports: 8,
  webcam: 6,
  charging: 8,
  hardDisk: 10,
  motherboard: 35,
  bluetooth: 6,
};

const commonScreenDeductions = {
  screenCracked: 18,
  lineDiscolour: 18,
};

const commonBodyDeductions = {
  minorDentTop: 8,
  minorDentBase: 8,
  majorDentTop: 35,
  majorDentBase: 40,
  minorScratch: 5,
  majorScratch: 8,
};

const ageMultipliers = {
  lessThan3: 1.0, threeToEleven: 0.88, aboveEleven: 0.75,
  lessThan1: 0.92, oneToTwo: 0.78, twoToThree: 0.62,
  threeToFour: 0.48, fourToFive: 0.36, moreThan5: 0.22,
};

const screenMultipliers = {
  noIssue: 1.0, minorScratch: 0.96, deadPixels: 0.82,
  crackedWorks: 0.68, crackedBroken: 0.45,
};

const conditionMultipliers = { likenew: 1.0, good: 0.88, fair: 0.72, poor: 0.50 };

const accessoriesBonus = { bill: 300, box: 500, charger: 800, withBoxAndCharger: 800, originalCharger: 500, thirdPartyCharger: 200, none: 0 };

function mkDevice({ brand, modelName, slug, processorFamily, generation, tier, variants, gpuType, isGaming, imageUrl }) {
  return {
    category: 'laptop',
    brand,
    modelName,
    slug,
    imageUrl: imageUrl || '',
    processorFamily: processorFamily || '',
    generation: generation || '',
    gpuType: gpuType || '',
    isGamingLaptop: !!isGaming,
    tier: tier || 'Mid-range',
    variants: variants.map(v => ({
      processor: v.processor || processorFamily || '',
      generation: v.generation || generation || '',
      ram: v.ram || '',
      storage: v.storage || 'Standard',
      storageType: v.storage?.includes('HDD') ? 'HDD' : 'SSD',
      basePrice: v.basePrice,
    })),
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true,
  };
}

const devices = [
  // ══════════════════════════════════════════════════════
  //  DELL — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'Dell', modelName: 'G15 Gaming Series', slug: 'dell-g15-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g15-5530/media-gallery/gray/non-touch/4-zone-rgb-kb/notebook-laptop-g15-5530-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=441&qlt=100,1&resMode=sharp2&size=441,320&chrss=full",
    variants: [{ basePrice: 22000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'G16 Gaming Series', slug: 'dell-g16-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g16-7630/media-gallery/black/notebook-g16-7630-nt-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=427&qlt=100,1&resMode=sharp2&size=427,320&chrss=full",
    variants: [{ basePrice: 20000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Vostro 3000 Series', slug: 'dell-vostro-3000-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/vostro/15-3500-non-touch/dv3500nt-cnb-05000ff090-yl.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=437&qlt=100,1&resMode=sharp2&size=437,320&chrss=full",
    variants: [{ basePrice: 12500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Vostro 5000 Series', slug: 'dell-vostro-5000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/vostro-notebooks/vostro-15-3530/media-gallery/bk-pl-fpr/notebook-vostro-15-3530-nt-plastic-fpr-black-gallery-7.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=450&qlt=100,1&resMode=sharp2&size=450,320&chrss=full",
    variants: [{ basePrice: 13500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Vostro 7000 Series', slug: 'dell-vostro-7000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/vostro-notebooks/15-7510-non-touch/media-gallery/dv7510nt_cnb_05000ff090_gy_fpr.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=467&qlt=100,1&resMode=sharp2&size=467,320&chrss=full",
    variants: [{ basePrice: 14000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 3000 2-in-1 Series', slug: 'dell-latitude-3000-2-in-1-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/14-3420/media-gallery/peripherals_laptop_latitude_3420nt_gallery_3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=457&qlt=100,1&resMode=sharp2&size=457,320&chrss=full",
    variants: [{ basePrice: 9000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 5000 2-in-1 Series', slug: 'dell-latitude-5000-2-in-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/5455/latitude-14-5455-laptop-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=469&qlt=100,1&resMode=sharp2&size=469,320&chrss=full",
    variants: [{ basePrice: 10500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 7000 2-in-1 Series', slug: 'dell-latitude-7000-2-in-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/7455/latitude-14-7455-laptop-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=469&qlt=100,1&resMode=sharp2&size=469,320&chrss=full",
    variants: [{ basePrice: 11500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 9000 2-in-1 Series', slug: 'dell-latitude-9000-2-in-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/uwaem/production-design-assets/en/CSG/lati-refresh/lati-3c.jpg?wid=768&fit=constrain",
    variants: [{ basePrice: 18500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Dell 15 Series', slug: 'dell-dell-15-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/inspiron/15-3593-non-touch/in3593nt-2sp-cnb-05000ff90-bk.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=320&qlt=100,1&resMode=sharp2&size=320,320&chrss=full",
    variants: [{ basePrice: 17000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron Series', slug: 'dell-inspiron-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/franchise/inspiron/inpsiron-franchise-migration/png/in5630t-in7430t-fnb-sl-nonfpr-1920x1440.png?qlt=95&fit=constrain,1&hei=900&wid=1200&fmt=png-alpha",
    variants: [{ basePrice: 12690 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 3000 Series', slug: 'dell-inspiron-3000-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/inspiron/15-3500-non-touch/in3500nt-cnb-05000ff090-wh.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=506&qlt=100,1&resMode=sharp2&size=506,320&chrss=full",
    variants: [{ basePrice: 10400 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 3000 2-in-1 Series', slug: 'dell-inspiron-3000-2-in-1-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRj7YJLNL_xvqSLmjPHmiajAQl4udMgkKtQ_JlcTlQlqoRSyJI9rZeqh3WjYxDgeJNhpDnGk5mEi9NasOkOg8hZcNhQr2QWakqu_8XabzQ",
    variants: [{ basePrice: 8500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 5000 Series', slug: 'dell-inspiron-5000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR7Od0um0eX_m5E8Mhtz-rm5DnsV3cYnW2EpgCE_jPY5Nu3D48wjnyjYqkltd5to_VWoWmxErbiD5FKSpkHph6-utSc_GdCH_RDdbD6lnPOdvj8GboKytYa_og",
    variants: [{ basePrice: 10600 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 5000 2-in-1 Series', slug: 'dell-inspiron-5000-2-in-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR7Od0um0eX_m5E8Mhtz-rm5DnsV3cYnW2EpgCE_jPY5Nu3D48wjnyjYqkltd5to_VWoWmxErbiD5FKSpkHph6-utSc_GdCH_RDdbD6lnPOdvj8GboKytYa_og",
    variants: [{ basePrice: 10800 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 7000 Series', slug: 'dell-inspiron-7000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/inspiron/15-7506-2n1/in7506t-ctb-00055lf110-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=524&qlt=100,1&resMode=sharp2&size=524,320&chrss=full",
    variants: [{ basePrice: 13200 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron 7000 2-in-1 Series', slug: 'dell-inspiron-7000-2-in-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/inspiron/15-7506-2n1/in7506t-ctb-00055lf110-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=524&qlt=100,1&resMode=sharp2&size=524,320&chrss=full",
    variants: [{ basePrice: 14000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron N5000 Series', slug: 'dell-inspiron-n5000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRgv_SFHT3N6BXTEW1lfUG3P36JXFS5GvTL8_-LHKula5GEEXtiHI6RSiXPQbcptt13SMze-gDqQuO74maqX_zhz4ZfoX2ICAnE2R-72hOpeKgY1egdvHzQHw",
    variants: [{ basePrice: 6500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Inspiron Gaming Series', slug: 'dell-inspiron-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcThCtK3HAEI-690EUi4FxNohRmmhBLcJQZCD8dRzzgNTDU-hTfIxrYakXydb996fXyLk0pA7sFXBA0gbAcrFKjPpUVL9sxqUA",
    variants: [{ basePrice: 9800 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Vostro Series', slug: 'dell-vostro-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/1000w/sites/csimages/Banner_Imagery/all/vostro-laptops-franchise-page-hero-5630nt-fpr-1920x1440_1.png",
    variants: [{ basePrice: 11590 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude Series', slug: 'dell-latitude-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/1000w/sites/csimages/Banner_Imagery/all/lati-compact-franchise-1920x1440-fy25-hero-module.png",
    variants: [{ basePrice: 9790 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude E3000 Series', slug: 'dell-latitude-e3000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://5.imimg.com/data5/BT/AL/GLADMIN-58171008/dell-latitude-13-3000-series-2-in-1-laptop-1000x1000.png",
    variants: [{ basePrice: 9000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude E4000 Series', slug: 'dell-latitude-e4000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/500x500/das/xa_____/global-site-design%20WEB/8d8a496f-eb6c-ddd7-44fe-f3e97a0329e7/1/OriginalJPG?id=Dell/Product_Images/Dell_Client_Products/Notebooks/Latitude_Notebooks/Latitude_E4310/relative_sized/laptop-latitude-e4310-overhead-relativesized-500.psd",
    variants: [{ basePrice: 7000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude E5000 Series', slug: 'dell-latitude-e5000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/41Ms40Qbw3S._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 12000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude E6000 Series', slug: 'dell-latitude-e6000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://guide-images.cdn.ifixit.com/igi/uHEHJEkZjuTVVnIM.medium",
    variants: [{ basePrice: 11000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude E7000 Series', slug: 'dell-latitude-e7000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/61s1xZpePIL._SX355_.jpg",
    variants: [{ basePrice: 12500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 3000 Series', slug: 'dell-latitude-3000-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/41v92xv3muL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 9500 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 5000 Series', slug: 'dell-latitude-5000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/31GfvJrvSuL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 11100 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 6000 Series', slug: 'dell-latitude-6000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://www.laptoparena.net/images/DELL_Latitude_6000_E6540_c53820.jpg",
    variants: [{ basePrice: 8000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 7000 Series', slug: 'dell-latitude-7000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/61s1xZpePIL._SX355_.jpg",
    variants: [{ basePrice: 13000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Latitude 9000 Series', slug: 'dell-latitude-9000-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/81t5koN7zDL._SY450_.jpg",
    variants: [{ basePrice: 19000 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Precision Series', slug: 'dell-precision-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/workstations/mobile-workstations/precision/17-5760/media-gallery/workstations_precision_17_5760_gallery_3.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3688&hei=2292&qlt=100,1&resMode=sharp2&size=3688,2292&chrss=full&imwidth=5000",
    variants: [{ basePrice: 22620 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Studio Series', slug: 'dell-studio-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/500x500/das/xa_____/global-site-design%20WEB/fec548b9-f6ab-adb4-74cf-457ee0680689/1/OriginalJPG?id=Dell/Product_Images/Dell_Client_Products/Notebooks/Studio_Notebooks/Studio_1555/front_facing/laptop-studio-1555-overhead-standard-500.png",
    variants: [{ basePrice: 5760 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Alienware Series', slug: 'dell-alienware-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://dellstatic.luroconnect.com/media/catalog/product/cache/3e13cd54424f3c497e84fce3a85b5570/a/l/alienware-ac16250-laptop-c-15000ff105-bl_1_3.png",
    variants: [{ basePrice: 17700 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Dell Chromebook Series', slug: 'dell-dell-chromebook-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/1000w/sites/csimages/App-Merchandizing_Images/all/chromebooks-franchise-1920x1440-hero-1.png",
    variants: [{ basePrice: 3070 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'G7 Gaming Series', slug: 'dell-g7-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/g-series/g7-15-7500-non-touch/dg7500nt-cnb-00000ff090-bk.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=472&qlt=100,1&resMode=sharp2&size=472,320&chrss=full",
    variants: [{ basePrice: 25220 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'G5 Gaming Series', slug: 'dell-g5-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/g-series/g5-15-5500-non-touch/dg5500nt-cnb-05000ff090-bk-upsell.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=320&qlt=100,1&resMode=sharp2&size=320,320&chrss=full",
    variants: [{ basePrice: 16920 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'G3 Gaming Series', slug: 'dell-g3-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/images/products/laptops-and-2-in-1s/g-series/g3-15-3500-non-touch/dg3500nt-cnb-00055lf110-bk-baseline.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=320&qlt=100,1&resMode=sharp2&size=320,320&chrss=full",
    variants: [{ basePrice: 16780 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'XPS Series', slug: 'dell-xps-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/das/dih.ashx/1000w/sites/csimages/Banner_Imagery/all/laptop-xps-franchise-page-16-9640-14-9440-13-9340-sl-1920x1440-hero-desktop.png",
    variants: [{ basePrice: 11840 }],
  }),
  mkDevice({
    brand: 'Dell', modelName: 'Other Dell Series', slug: 'dell-other-dell-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell/dell-15-intel-3530/media-gallery/laptop-dell-dc15250nt-bk-plastic-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1254&qlt=100,1&resMode=sharp2&size=1254,804&chrss=full",
    variants: [{ basePrice: 1270 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'Dell' });
    console.log('Cleared existing Dell laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Dell laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();