import Device from '../models/Device.js';
import AgentTestRun from '../models/AgentTestRun.js';
import { buildCashifyProductUrlCandidates } from '../config/cashify.js';
import { calculateLaptopPrice } from '../utils/laptopPriceCalculator.js';
import { calculateMobilePrice } from '../utils/mobilePriceCalculator.js';
import { buildAgentTestRunsWorkbook, serializeAgentTestRuns } from '../utils/agentTestRunExport.js';
import { computeOurOfferFromSettings } from '../utils/offerMarkup.js';

/** Lazy-load Playwright stack so the rest of the API keeps running if it is missing on the VPS. */
async function getCashifyServices() {
  try {
    const [session, laptop, mobile] = await Promise.all([
      import('../services/cashify/sessionManager.js'),
      import('../services/cashify/laptopFlow.js'),
      import('../services/cashify/mobileFlow.js'),
    ]);
    return {
      getStatus: session.getStatus,
      verifySessionAlive: session.verifySessionAlive,
      requestOtp: session.requestOtp,
      verifyOtp: session.verifyOtp,
      logoutCashify: session.logoutCashify,
      runLaptopFlow: laptop.runLaptopFlow,
      runMobileFlow: mobile.runMobileFlow,
    };
  } catch (error) {
    throw new Error(
      `Cashify agent unavailable. On the VPS run: npm install && npx playwright install chromium. (${error.message})`,
    );
  }
}

function cleanPlaywrightError(message) {
  return String(message || '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');
}

function yesNoToBool(val) {
  if (val === true || val === false) return val;
  if (val === 'yes') return true;
  if (val === 'no') return false;
  return null;
}

function normalizeLaptopQuiz(body) {
  const hasGpuRaw = body.hasGpu;
  const hasGpu = yesNoToBool(hasGpuRaw);
  const isGpuWorking = hasGpu === true ? yesNoToBool(body.isGpuWorking) : false;

  return {
    slug: body.slug,
    processor: body.processor || '',
    ram: body.ram || '',
    storage: body.storage || '',
    powerStatus: body.powerStatus || 'on',
    screenSize: body.screenSize || '14-15',
    hasGpu,
    isGpuWorking,
    functionalIssues: body.functionalIssues || body.issuesList || [],
    screenIssues: body.screenIssues || body.screenIssuesList || [],
    bodyIssues: body.bodyIssues || body.bodyIssuesList || [],
    accessories: Array.isArray(body.accessories)
      ? body.accessories
      : body.accessories
        ? [body.accessories]
        : [],
    yearBracket: body.yearBracket || body.age || 'oneToTwo',
    age: body.age || body.yearBracket || 'oneToTwo',
    issuesList: body.issuesList || body.functionalIssues || [],
    screenIssuesList: body.screenIssuesList || body.screenIssues || [],
    bodyIssuesList: body.bodyIssuesList || body.bodyIssues || [],
  };
}

function normalizeMobileQuiz(body) {
  const accessories = body.accessories || [];
  const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
  return {
    slug: body.slug,
    storage: body.storage || '',
    deviceAge: body.deviceAge || 'Above 11 Months',
    ableToMakeCalls: body.ableToMakeCalls !== false,
    isTouchScreenWorking: body.isTouchScreenWorking !== false,
    isScreenOriginal: body.isScreenOriginal !== false,
    underWarranty: body.underWarranty === true,
    eSIMSupport: body.eSIMSupport || 'physical+esim',
    physicalIssues: body.physicalIssues || [],
    technicalIssues: body.technicalIssues || [],
    hasCharger: accList.some((a) => /charger/i.test(String(a))),
    hasBox: accList.some((a) => /box/i.test(String(a))),
    accessories: accList,
  };
}

function resolveVariantBasePrice(device, storage, ram) {
  const variants = device.variants || [];
  if (!variants.length) return 0;
  const match = variants.find((v) => {
    const storageMatch = !storage || v.storage === storage;
    const ramMatch = !ram || !v.ram || v.ram === ram;
    return storageMatch && ramMatch;
  });
  return match?.basePrice ?? variants[0]?.basePrice ?? 0;
}

function computeInternalPrice(device, quiz, category) {
  if (category === 'laptop' || category === 'mac') {
    const deviceObj = device.toObject ? device.toObject() : device;
    const result = calculateLaptopPrice(deviceObj, {
      ram: quiz.ram || deviceObj.variants?.[0]?.ram || '',
      storage: quiz.storage || deviceObj.variants?.[0]?.storage || '',
      processor: quiz.processor || deviceObj.variants?.[0]?.processor || deviceObj.processorFamily || '',
      yearBracket: quiz.yearBracket,
      powerStatus: quiz.powerStatus || 'on',
      screenSize: quiz.screenSize || '14-15',
      hasGpu: !!quiz.hasGpu,
      isGpuWorking: !!quiz.isGpuWorking,
      functionalIssues: quiz.functionalIssues,
      screenIssues: quiz.screenIssues,
      bodyIssues: quiz.bodyIssues,
      accessories: quiz.accessories?.length ? quiz.accessories : ['none'],
    });
    if (!result) return null;
    return {
      finalPrice: result.internalPrice ?? result.componentFinalPrice ?? result.finalPrice,
      offerPrice: result.finalPrice,
      basePrice: result.basePrice,
      cashifyEstimate: result.cashifyEstimate ?? null,
      breakdown: {
        ageAdjustment: result.ageAdjustment || 0,
        powerDeduction: result.powerDeduction || 0,
        functionalDeduction: result.functionalDeduction || 0,
        screenDeduction: result.screenDeduction || 0,
        bodyDeduction: result.bodyDeduction || 0,
        accessoriesBonus: result.accessoriesBonus || 0,
        priceSource: result.priceSource || 'calculator',
        internalPrice: result.internalPrice ?? null,
        cashifyEstimate: result.cashifyEstimate ?? null,
        pricingMethod: result.pricingMethod ?? null,
        specTier: result.specTier ?? null,
      },
      priceSource: result.priceSource || 'calculator',
    };
  }

  if (category === 'mobile') {
    const basePrice = resolveVariantBasePrice(device, quiz.storage);
    const result = calculateMobilePrice({
      brand: device.brand,
      modelName: device.modelName,
      basePrice,
      deviceAge: quiz.deviceAge,
      ableToMakeCalls: quiz.ableToMakeCalls,
      isTouchScreenWorking: quiz.isTouchScreenWorking,
      isScreenOriginal: quiz.isScreenOriginal,
      underWarranty: quiz.underWarranty,
      eSIMSupport: quiz.eSIMSupport,
      physicalIssues: quiz.physicalIssues,
      technicalIssues: quiz.technicalIssues,
      hasCharger: quiz.hasCharger,
      hasBox: quiz.hasBox,
    });
    return {
      finalPrice: result.finalPrice,
      basePrice: result.basePrice,
      breakdown: result.breakdown,
      priceSource: result.priceSource,
    };
  }

  return null;
}

export const getValuationTestModels = async (req, res, next) => {
  try {
    const categories = ['mobile', 'laptop'];
    const summary = {};
    for (const category of categories) {
      const devices = await Device.find({ category, isActive: true })
        .select('brand modelName slug')
        .sort({ brand: 1, modelName: 1 })
        .lean();
      const brandMap = {};
      for (const d of devices) {
        brandMap[d.brand] = brandMap[d.brand] || [];
        brandMap[d.brand].push({ slug: d.slug, modelName: d.modelName });
      }
      summary[category] = {
        count: devices.length,
        brands: Object.entries(brandMap).map(([brand, models]) => ({
          brand,
          count: models.length,
          models,
        })),
      };
    }
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getValuationTestDevices = async (req, res, next) => {
  try {
    const { category, brand } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    const devices = await Device.find(filter)
      .select('category brand modelName slug imageUrl variants processorFamily generation cashifyProductUrl')
      .sort({ modelName: 1 })
      .lean();
    res.json({ devices });
  } catch (error) {
    next(error);
  }
};

export const cashifyStatus = async (req, res, next) => {
  try {
    const { getStatus } = await getCashifyServices();
    const status = await getStatus();
    res.json(status);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

export const cashifyVerifySession = async (req, res, next) => {
  try {
    const { verifySessionAlive } = await getCashifyServices();
    const status = await verifySessionAlive();
    res.json(status);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

export const cashifyRequestOtp = async (req, res, next) => {
  try {
    const { requestOtp } = await getCashifyServices();
    const { phone } = req.body;
    const result = await requestOtp(phone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cashifyVerifyOtp = async (req, res, next) => {
  try {
    const { verifyOtp } = await getCashifyServices();
    const { otp } = req.body;
    const result = await verifyOtp(otp);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cashifyLogout = async (req, res, next) => {
  try {
    const { logoutCashify } = await getCashifyServices();
    const result = await logoutCashify();
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

export const runValuationTestQuote = async (req, res, next) => {
  const started = Date.now();
  let device = null;
  let quizPayload = null;
  let category = null;

  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: 'Device slug is required.' });

    device = await Device.findOne({ slug, isActive: true });
    if (!device) return res.status(404).json({ error: 'Device not found.' });

    category = device.category;
    quizPayload = category === 'mobile'
      ? normalizeMobileQuiz(req.body)
      : normalizeLaptopQuiz(req.body);

    const internalResult = computeInternalPrice(device, quizPayload, category);
    if (!internalResult) {
      return res.status(400).json({ error: 'Unable to calculate internal price for this device.' });
    }

    let cashifyResult = null;
    let status = 'completed';
    let error = null;

    if (category === 'mobile' || category === 'laptop' || category === 'mac') {
      const productUrls = buildCashifyProductUrlCandidates(device, { storage: quizPayload.storage });
      const productUrl = productUrls[0] || '';
      if (!productUrl) {
        cashifyResult = {
          supported: false,
          message: 'No Cashify product URL could be resolved for this device.',
          cashifyPrice: null,
          ourOffer: null,
        };
        status = 'partial';
      } else {
        try {
          const { runLaptopFlow, runMobileFlow } = await getCashifyServices();
          const runFlow = category === 'mobile' ? runMobileFlow : runLaptopFlow;
          const flowResult = await runFlow(quizPayload, {
            productUrls,
            modelName: device.modelName,
          });
          const resolvedUrl = flowResult.productUrl || productUrl;
          const ourOffer = flowResult.cashifyPrice
            ? await computeOurOfferFromSettings(
              flowResult.cashifyPrice,
              category,
              internalResult.basePrice,
            )
            : null;
          cashifyResult = {
            supported: true,
            productUrl: resolvedUrl,
            productUrlsTried: productUrls,
            cashifyPrice: flowResult.cashifyPrice,
            ourOffer,
            loginRequired: !!flowResult.loginRequired,
            usedSession: !!flowResult.usedSession,
            note: flowResult.note || null,
            debugArtifacts: flowResult.debugArtifacts || null,
          };
          if (flowResult.loginRequired || flowResult.note) status = 'partial';
        } catch (flowError) {
          const msg = cleanPlaywrightError(flowError.message);
          const resolvedUrl = flowError.productUrl || productUrl;
          const urlsTried = flowError.productUrlsTried
            || flowError.debugArtifacts?.productUrlsTried
            || productUrls.map((url) => ({ url }));
          const failOffer = flowError.cashifyPrice
            ? await computeOurOfferFromSettings(
              flowError.cashifyPrice,
              category,
              internalResult.basePrice,
            )
            : null;
          cashifyResult = {
            supported: true,
            productUrl: resolvedUrl,
            productUrlsTried: urlsTried,
            cashifyPrice: flowError.cashifyPrice || null,
            ourOffer: failOffer,
            error: msg,
            note: flowError.note || null,
            debugArtifacts: flowError.debugArtifacts || null,
          };
          status = flowError.cashifyPrice ? 'partial' : 'partial';
          error = msg;
        }
      }
    }

    const internalPrice = internalResult.finalPrice;
    const cashifyOffer = cashifyResult?.ourOffer ?? null;
    const comparison = {
      internalPrice,
      cashifyPrice: cashifyResult?.cashifyPrice ?? null,
      ourOffer: cashifyOffer,
      difference: cashifyOffer != null ? internalPrice - cashifyOffer : null,
      markupInr: cashifyOffer != null && cashifyResult?.cashifyPrice != null
        ? cashifyOffer - cashifyResult.cashifyPrice
        : null,
    };

    const runDoc = await AgentTestRun.create({
      category,
      brand: device.brand,
      modelName: device.modelName,
      slug: device.slug,
      storage: quizPayload.storage || '',
      variant: {
        ram: quizPayload.ram || null,
        processor: quizPayload.processor || null,
      },
      quizPayload,
      internalResult,
      cashifyResult,
      comparison,
      status,
      error,
      debugArtifacts: cashifyResult?.debugArtifacts || null,
      runBy: req.admin?.email || '',
      durationMs: Date.now() - started,
    });

    res.json({
      runId: runDoc._id,
      status,
      device: {
        category,
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
      },
      internalResult,
      cashifyResult,
      comparison,
      durationMs: runDoc.durationMs,
      error,
    });
  } catch (error) {
    try {
      if (device && quizPayload) {
        await AgentTestRun.create({
          category: category || device.category,
          brand: device.brand,
          modelName: device.modelName,
          slug: device.slug,
          storage: quizPayload.storage || '',
          quizPayload,
          status: 'failed',
          error: error.message,
          runBy: req.admin?.email || '',
          durationMs: Date.now() - started,
        });
      }
    } catch {
      // ignore persistence failure
    }
    next(error);
  }
};

export const getLastAgentRun = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const runs = await AgentTestRun.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!runs.length) {
      return res.json({ runs: [], total: 0, message: 'No agent test runs yet.' });
    }

    res.json({
      runs: serializeAgentTestRuns(runs),
      total: runs.length,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadLastAgentRun = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 500, 1000);
    const runs = await AgentTestRun.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!runs.length) {
      return res.status(404).json({ error: 'No agent test runs to download.' });
    }

    const buffer = buildAgentTestRunsWorkbook(runs);
    const filename = `agent-test-runs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
