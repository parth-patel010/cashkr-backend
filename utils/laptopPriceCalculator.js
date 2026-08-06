import { RAM_PRICES, STORAGE_PRICES, CPU_PRICES, CPU_GEN_FACTORS } from './laptopPricingData.js';
import { findLenovoOverridePrice } from './lenovoPriceOverrides.js';
import { findZbookPowerOverridePrice } from './hpZbookPowerOverrides.js';
import { findRogChromebookOverridePrice } from './rogChromebookOverrides.js';
import { findMacbookOverridePrice } from './macbookPriceOverrides.js';
/** Apple MacBook / iMac â€” never use Windows CPU/RAM/GPU component pricing. */
export function isAppleMacDevice(device) {
  if (!device) return false;
  const brand = (device.brand || '').toLowerCase().trim();
  const category = (device.category || '').toLowerCase();
  const model = (device.modelName || '').toLowerCase();
  const family = (device.processorFamily || '').toLowerCase();
  return (
    brand === 'apple' ||
    category === 'mac' ||
    model.includes('macbook') ||
    model.includes('imac') ||
    family.startsWith('apple m')
  );
}

/**
 * Relative CPU value for Mac catalog pricing (i5 / M1 = 1.0).
 * Used so Intel i3 quotes land below i5 (Cashify-style), without Windows CPU_PRICES.
 */
function getMacCpuFactor(processorStr) {
  const p = (processorStr || '').toLowerCase();
  if (!p) return 1;

  // Apple Silicon (relative to M1)
  if (p.includes('m4 max')) return 1.55;
  if (p.includes('m4 pro')) return 1.40;
  if (p.includes('m4')) return 1.25;
  if (p.includes('m3 max')) return 1.45;
  if (p.includes('m3 pro')) return 1.30;
  if (p.includes('m3')) return 1.18;
  if (p.includes('m2 max')) return 1.35;
  if (p.includes('m2 pro')) return 1.22;
  if (p.includes('m2')) return 1.10;
  if (p.includes('m1 max')) return 1.25;
  if (p.includes('m1 pro')) return 1.12;
  if (p.includes('m1') || p.includes('apple m')) return 1.00;

  // Intel â€” absolute vs i5 (=1.0), Cashify: i3â‰ˆ13k, i5â‰ˆ20k, i7â‰ˆ24k
  if (p.includes('i9')) return 1.35;
  if (p.includes('i7')) return 1.20; // 24/20
  if (p.includes('i5')) return 1.00;
  if (p.includes('i3')) return 0.65; // 13/20

  return 1;
}

function isIntelMacProcessor(processorStr) {
  const p = (processorStr || '').toLowerCase();
  return p.includes('intel') || /\bi[3579]\b/.test(p);
}

/** Align Intel Mac catalog quotes with Cashify (~â‚¹30k listed i5 path â†’ ~â‚¹20k). */
const MAC_INTEL_MARKET_FACTOR = 20 / 30;

export function calculateLaptopPrice(device, selections) {
  const { ram, storage, yearBracket,
    functionalIssues = [], screenIssues = [], bodyIssues = [],
    accessories, powerStatus, screenSize } = selections;

  let basePrice = 0;

  if (isAppleMacDevice(device)) {
    // MacBook override table (Cashify + â‚¹1,000) â€” before catalog CPU/age math
    const macOverride = findMacbookOverridePrice(device, {
      ...selections,
      yearBracket,
      ram,
      storage,
    });
    if (macOverride != null) {
      let finalPrice = macOverride;
      if (powerStatus === 'off') {
        finalPrice = Math.max(Math.round((finalPrice * 0.05) / 10) * 10, 0);
      } else {
        finalPrice = Math.max(Math.round(finalPrice / 100) * 100, 0);
      }
      return {
        basePrice: macOverride,
        componentBase: macOverride,
        ageAdjustment: 0,
        powerDeduction: powerStatus === 'off' ? -(macOverride - finalPrice) : 0,
        functionalDeduction: 0,
        screenDeduction: 0,
        bodyDeduction: 0,
        accessoriesBonus: 0,
        finalPrice,
        priceSource: 'macbook_override',
      };
    }

    // â”€â”€ MacBook / Apple logic (catalog base â†’ CPU tier â†’ age â†’ deductions) â”€â”€
    const variants = device.variants || [];
    const selectedProcessor = selections.processor || '';

    // Prefer exact variant match including processor when catalog has CPU-specific rows
    let variant =
      variants.find(v =>
        v.processor &&
        selectedProcessor &&
        v.processor === selectedProcessor &&
        (!v.ram || v.ram === ram) &&
        (!v.storage || v.storage === storage)
      ) ||
      variants.find(v =>
        v.ram && v.storage && v.ram === ram && v.storage === storage
      );

    if (!variant && variants.length === 1) {
      variant = variants[0];
    }

    if (variant) {
      basePrice = variant.basePrice;
    } else if (variants.length > 0) {
      const baseline = variants[0];
      basePrice = baseline.basePrice;

      const ramVal = (r) => parseInt(r) || 8;
      basePrice += (ramVal(ram) - ramVal(baseline.ram)) * 200;

      const parseStorage = (s) => {
        if (!s) return 0;
        let totalGB = 0;
        const parts = s.split('+');
        parts.forEach(p => {
          const val = parseInt(p.trim()) || 0;
          const isTB = p.toUpperCase().includes('TB');
          totalGB += isTB ? val * 1024 : val;
        });
        return totalGB;
      };

      basePrice += (parseStorage(storage) - parseStorage(baseline.storage)) * 5;
    }

    // Intel Macs: catalog base is treated as i5-listed.
    // Cashify targets â€” i5 â‰ˆ â‚¹20k, i7 â‰ˆ â‚¹24k (1.2Ã—), i3 â‰ˆ â‚¹13k (0.65Ã—).
    // Apple Silicon: only relative chip tier vs listed family (no Intel market cut).
    const catalogCpu =
      (variant && variant.processor) ||
      device.processorFamily ||
      '';
    const selectedCpu = selectedProcessor || catalogCpu;

    if (isIntelMacProcessor(selectedCpu) || isIntelMacProcessor(catalogCpu)) {
      // Always scale vs i5=1.0 so selecting i7/i3 actually changes price
      const selectedFactor = getMacCpuFactor(selectedCpu) || 1;
      basePrice = Math.round(basePrice * MAC_INTEL_MARKET_FACTOR * selectedFactor);
    } else {
      const catalogFactor = getMacCpuFactor(catalogCpu) || 1;
      const selectedFactor = getMacCpuFactor(selectedCpu) || 1;
      if (catalogFactor > 0 && selectedFactor !== catalogFactor) {
        basePrice = Math.round(basePrice * (selectedFactor / catalogFactor));
      }
    }

    // Apple age multipliers & deductions
    const ageMult = device.ageMultipliers?.[yearBracket] || 1;
    let currentPrice = Math.round(basePrice * ageMult);
    const ageAdjustment = currentPrice - basePrice;

    let powerDeduction = 0;
    if (powerStatus === 'off') {
      powerDeduction = Math.round(basePrice * 0.95);
      currentPrice = Math.max(currentPrice - powerDeduction, 0);
    }

    let functionalDeduction = 0;
    const funcIssues = (functionalIssues || []).filter(i => i !== 'noIssues');
    for (const issue of funcIssues) {
      const pct = device.functionalDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        functionalDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let screenDeduction = 0;
    const scrIssues = (screenIssues || []).filter(i => i !== 'noIssue');
    for (const issue of scrIssues) {
      const pct = device.screenDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        screenDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let bodyDeduction = 0;
    for (const issue of (bodyIssues || [])) {
      const pct = device.bodyDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        bodyDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    const accList = Array.isArray(accessories) ? [...accessories] : [];
    if (yearBracket && yearBracket !== 'lessThan1' && !accList.includes('bill')) {
      accList.push('bill');
    }
    const accBonus = accList.reduce((sum, item) => sum + (device.accessoriesBonus?.[item] || 0), 0);
    currentPrice += accBonus;

    const finalPrice = Math.max(Math.round(currentPrice / 100) * 100, 0);

    return {
      basePrice,
      ageAdjustment,
      powerDeduction: -powerDeduction,
      functionalDeduction: -functionalDeduction,
      screenDeduction: -screenDeduction,
      bodyDeduction: -bodyDeduction,
      accessoriesBonus: accBonus,
      finalPrice,
    };
  } else {
    // â”€â”€ WINDOWS LAPTOPS ONLY â€” Component_Base algorithm (locked) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Final = (Component_Base Ã— Model Ã— Gen Ã— Gaming Ã— 1.72 Ã— Age Ã— Condition Ã— Screen) + Accessory
    // Component_Base is ALWAYS computed fresh from hardware tables â€” never reuse admin/catalog base.

    // Lenovo override table (Cashify + â‚¹1,000) â€” exact series/CPU/RAM/storage/age match
    const lenovoOverride = findLenovoOverridePrice(device, {
      ...selections,
      yearBracket,
      ram,
      storage,
    });
    if (lenovoOverride != null) {
      let finalPrice = lenovoOverride;
      if (powerStatus === 'off') {
        finalPrice = Math.max(Math.round((finalPrice * 0.05) / 10) * 10, 0);
      } else {
        finalPrice = Math.max(Math.round(finalPrice / 10) * 10, 0);
      }
      return {
        basePrice: lenovoOverride,
        componentBase: lenovoOverride,
        ageAdjustment: 0,
        powerDeduction: powerStatus === 'off' ? -(lenovoOverride - finalPrice) : 0,
        functionalDeduction: 0,
        screenDeduction: 0,
        bodyDeduction: 0,
        accessoriesBonus: 0,
        finalPrice,
        priceSource: 'lenovo_override',
      };
    }

    // ASUS ROG / Asus Chromebook override â€” i3 / i5 / i7 / i9 (Cashify + â‚¹1,000)
    const rogChromebookOverride = findRogChromebookOverridePrice(device, {
      ...selections,
      yearBracket,
      ram,
      storage,
    });
    if (rogChromebookOverride != null) {
      let finalPrice = rogChromebookOverride;
      if (powerStatus === 'off') {
        finalPrice = Math.max(Math.round((finalPrice * 0.05) / 10) * 10, 0);
      } else {
        finalPrice = Math.max(Math.round(finalPrice / 10) * 10, 0);
      }
      return {
        basePrice: rogChromebookOverride,
        componentBase: rogChromebookOverride,
        ageAdjustment: 0,
        powerDeduction: powerStatus === 'off' ? -(rogChromebookOverride - finalPrice) : 0,
        functionalDeduction: 0,
        screenDeduction: 0,
        bodyDeduction: 0,
        accessoriesBonus: 0,
        finalPrice,
        priceSource: 'rog_chromebook_override',
      };
    }

    // HP ZBook Power override â€” Intel Core i5 configs only
    const zbookOverride = findZbookPowerOverridePrice(device, {
      ...selections,
      yearBracket,
      ram,
      storage,
    });
    if (zbookOverride != null) {
      let finalPrice = zbookOverride;
      if (powerStatus === 'off') {
        finalPrice = Math.max(Math.round((finalPrice * 0.05) / 10) * 10, 0);
      } else {
        finalPrice = Math.max(Math.round(finalPrice / 10) * 10, 0);
      }
      return {
        basePrice: zbookOverride,
        componentBase: zbookOverride,
        ageAdjustment: 0,
        powerDeduction: powerStatus === 'off' ? -(zbookOverride - finalPrice) : 0,
        functionalDeduction: 0,
        screenDeduction: 0,
        bodyDeduction: 0,
        accessoriesBonus: 0,
        finalPrice,
        priceSource: 'zbook_power_override',
      };
    }

    const MARKET_MULTIPLIER = 1.72;
    const ACCESSORY_CHARGER_BONUS = 300;

    const totalIssueCount =
      (functionalIssues || []).filter((i) => i !== 'noIssues').length +
      (screenIssues || []).filter((i) => i !== 'noIssue').length +
      (bodyIssues || []).length;

    const normalizeRamKey = (r) => {
      if (!r) return '';
      if (RAM_PRICES[r] != null) return r;
      const spaced = String(r).replace(/^(\d+)\s*GB$/i, '$1 GB');
      if (RAM_PRICES[spaced] != null) return spaced;
      return r;
    };

    const normalizeStorageKey = (s) => {
      if (!s) return '';
      if (STORAGE_PRICES[s] != null) return s;
      const compact = String(s).replace(/\s+/g, ' ').trim();
      if (STORAGE_PRICES[compact] != null) return compact;
      return s;
    };

    // 1. Component_Base = CPU + RAM + Storage + GPU + Chassis (fresh every quote)
    const getCpuPrice = (cpu) => {
      if (!cpu) return 3000;
      if (CPU_PRICES[cpu] != null) return CPU_PRICES[cpu];
      // Tolerate "i5 12th Gen" vs "i5 - 12th Gen"
      const dashed = String(cpu).replace(/\s+(\d+(?:st|nd|rd|th)\s+Gen)/i, ' - $1');
      if (CPU_PRICES[dashed] != null) return CPU_PRICES[dashed];
      const c = cpu.toLowerCase();
      let base = 3000;
      if (c.includes('i3')) base = 3500;
      if (c.includes('i5') || c.includes('ryzen 5')) base = 6000;
      if (c.includes('i7') || c.includes('ryzen 7')) base = 9000;
      if (c.includes('i9') || c.includes('ryzen 9')) base = 12000;
      if (c.includes('11th')) base += 500;
      if (c.includes('12th')) base += 2000;
      if (c.includes('13th')) base += 4000;
      if (c.includes('14th')) base += 6000;
      return base;
    };

    const deviceProcessor =
      selections.processor ||
      (device.generation
        ? `${device.processorFamily || ''} - ${device.generation}`
        : device.processorFamily || '');

    const getRamPrice = (r) => {
      if (!r) return 1500;
      const key = normalizeRamKey(r);
      if (RAM_PRICES[key] != null) return RAM_PRICES[key];
      const num = parseInt(r, 10);
      if (num <= 4) return 800;
      if (num <= 8) return 1500;
      if (num <= 16) return 2800;
      if (num <= 32) return 5000;
      return 6000;
    };

    const getStoragePrice = (s) => {
      if (!s) return 1500;
      const key = normalizeStorageKey(s);
      if (STORAGE_PRICES[key] != null) return STORAGE_PRICES[key];
      const lower = String(s).toLowerCase();
      if (lower.includes('512') && lower.includes('ssd')) return 2800;
      if (lower.includes('1 tb') || lower.includes('1tb')) return 4000;
      if (lower.includes('256')) return 1500;
      return 1500;
    };

    // Integrated = 0; dedicated mid-range = 4000
    const getGpuPrice = (hasGpu, isGpuWorking) =>
      hasGpu && isGpuWorking ? 4000 : 0;

    // 12â€“14" class â†’ 5000; 15+ â†’ 6000
    const getChassisPrice = (size) => {
      if (size === 'above15' || size === '15' || size === '15+' || size === '16+') return 6000;
      return 5000;
    };

    const cpuPrice = getCpuPrice(deviceProcessor);
    const ramPrice = getRamPrice(ram);
    const storagePrice = getStoragePrice(storage);
    const gpuPrice = getGpuPrice(selections.hasGpu, selections.isGpuWorking);
    const chassisPrice = getChassisPrice(screenSize);
    const componentBase = cpuPrice + ramPrice + storagePrice + gpuPrice + chassisPrice;

    // 2. Generation Factor (per CPU)
    const getGenFactor = (cpuStr, gen) => {
      if (CPU_GEN_FACTORS[cpuStr] != null) return CPU_GEN_FACTORS[cpuStr];
      const dashed = String(cpuStr || '').replace(/\s+(\d+(?:st|nd|rd|th)\s+Gen)/i, ' - $1');
      if (CPU_GEN_FACTORS[dashed] != null) return CPU_GEN_FACTORS[dashed];
      const g = String(gen || cpuStr || '').toLowerCase();
      if (g.includes('10th')) return 0.95;
      if (g.includes('11th')) return 1.00;
      if (g.includes('12th')) return 1.08;
      if (g.includes('13th')) return 1.15;
      if (g.includes('14th')) return 1.25;
      return 1.00;
    };
    const genFactor = getGenFactor(deviceProcessor, device.generation || selections.generation);

    // 3. Gaming Factor â€” 1.02 for gaming series, else 1.00
    const seriesText = `${device.brand || ''} ${device.modelName || ''}`.toLowerCase();
    const isGamingSeries =
      !!device.isGamingLaptop ||
      /\b(victus|g15|g3|g5|g7|legion|tuf|rog|strix|predator|nitro|omen|alienware|inspiron\s+gaming|gaming)\b/.test(
        seriesText,
      );
    const gamingFactor = isGamingSeries ? 1.02 : 1.00;

    // 4. Model Factor (by series) â€” default 1.000
    const getModelFactor = (brand, series) => {
      const b = (brand || '').toLowerCase();
      const s = (series || '').toLowerCase();
      if (b === 'hp' && s.includes('15')) return 1.0;
      if (b === 'asus' && (s.includes('zenbook') || s.includes('vivobook s'))) return 1.0;
      if (b === 'hp' && s.includes('victus')) return 1.0;
      if (b === 'dell' && s.includes('vostro')) return 1.068;
      if (b === 'dell' && s.includes('g15')) return 1.027;
      if (b === 'lenovo' && s.includes('ideapad 5')) return 1.108;
      if (b === 'dell' && s.includes('inspiron') && s.includes('gaming')) return 1.3804;
      return 1.0;
    };
    const modelFactor = getModelFactor(device.brand, device.modelName);

    // 5â€“8. Age / Condition / Screen
    // Age: <1 = 0.90, 1â€“2 = 0.80, 2â€“3 = 0.70
    const getAgeFactor = (bracket) => {
      if (bracket === 'lessThan1') return 0.9;
      if (bracket === 'oneToTwo') return 0.8;
      if (bracket === 'twoToThree') return 0.7;
      return 0.6;
    };
    const ageFactor = getAgeFactor(yearBracket);

    // Perfect (no issues) = 0.95
    const getConditionFactor = (issueCount) => {
      if (issueCount === 0) return 0.95;
      if (issueCount <= 2) return 0.8;
      if (issueCount <= 4) return 0.65;
      return 0.5;
    };
    const conditionFactor = getConditionFactor(totalIssueCount);

    // 12â€“14" = 1.00, 15+ = 1.02
    const getScreenSizeFactor = (size) => {
      if (size === 'above15' || size === '15' || size === '15+' || size === '16+') return 1.02;
      return 1.0;
    };
    const screenFactor = getScreenSizeFactor(screenSize);

    // Final Price = (Component_Base Ã— Model Ã— Gen Ã— Gaming Ã— 1.72 Ã— Age Ã— Condition Ã— Screen) + Accessory
    let finalRaw =
      componentBase *
      modelFactor *
      genFactor *
      gamingFactor *
      MARKET_MULTIPLIER *
      ageFactor *
      conditionFactor *
      screenFactor;

    if (powerStatus === 'off') {
      finalRaw *= 0.05;
    }

    const accList = Array.isArray(accessories) ? accessories : [];
    const accessoryBonus = accList.includes('charger') ? ACCESSORY_CHARGER_BONUS : 0;
    const finalPrice = Math.max(Math.round((finalRaw + accessoryBonus) / 10) * 10, 0);

    const marketValue = componentBase * modelFactor * genFactor * gamingFactor * MARKET_MULTIPLIER;

    return {
      basePrice: Math.round(componentBase),
      componentBase: Math.round(componentBase),
      ageAdjustment: Math.round(marketValue * (ageFactor - 1)),
      powerDeduction: powerStatus === 'off' ? -Math.round(finalRaw) : 0,
      functionalDeduction: 0,
      screenDeduction: 0,
      bodyDeduction: 0,
      accessoriesBonus: accessoryBonus,
      finalPrice,
    };
  }
}
