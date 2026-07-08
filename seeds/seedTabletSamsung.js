import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  SAMSUNG — Galaxy Tab All Series
    // ══════════════════════════════════════════════════════
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 7.0 (2018) LTE",
        slug: "samsung-galaxy-tab-a-7-0-2018-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-70-2016-.jpg",
        variants: [
            { storage: "1.5 GB/8 GB", basePrice: 1970 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S3 LTE",
        slug: "samsung-galaxy-tab-s3-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s3-97-sm-t825.jpg",
        variants: [
            { storage: "4 GB/32 GB", basePrice: 3870 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 10.5 LTE",
        slug: "samsung-galaxy-tab-a-10-5-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-105-.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 5320 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S 8.4 LTE",
        slug: "samsung-galaxy-tab-s-8-4-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s-8.4.jpg",
        variants: [
            { storage: "3 GB/16 GB", basePrice: 2300 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S 10.5 LTE",
        slug: "samsung-galaxy-tab-s-10-5-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s-105.jpg",
        variants: [
            { storage: "3 GB/16 GB", basePrice: 3330 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 8.0 (2015) Wi-Fi",
        slug: "samsung-galaxy-tab-a-8-0-2015-wi-fi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-80.jpg",
        variants: [
            { storage: "1.5 GB/16 GB", basePrice: 2220 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S2 9.7 LTE",
        slug: "samsung-galaxy-tab-s2-9-7-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s2-97.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2940 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 9.7 WiFi",
        slug: "samsung-galaxy-tab-a-9-7-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-80.jpg",
        variants: [
            { storage: "1.5 GB/16 GB", basePrice: 2460 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S 8.4 WiFi",
        slug: "samsung-galaxy-tab-s-8-4-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s-8.4.jpg",
        variants: [
            { storage: "3 GB/16 GB", basePrice: 2110 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 8.0 (2017) LTE",
        slug: "samsung-galaxy-tab-a-8-0-2017-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-8-0-2017-t385-sm-t385.jpg",
        variants: [
            { storage: "2 GB/16 GB", basePrice: 2900 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy J Max",
        slug: "samsung-galaxy-j-max",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j-max.jpg",
        variants: [
            { storage: "1.5 GB/16 GB", basePrice: 1430 },
            { storage: "1.5 GB/8 GB", basePrice: 1230 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S5e LTE",
        slug: "samsung-galaxy-tab-s5e-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s5e-sm-t725.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6470 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 10.1 (2019) WiFi",
        slug: "samsung-galaxy-tab-a-10-1-2019-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-101-2019.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2730 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 LTE",
        slug: "samsung-galaxy-tab-s6-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9210 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 8.0 (2019) LTE",
        slug: "samsung-galaxy-tab-a-8-0-2019-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-80-2019-r.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2950 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 8.0 (2019) WiFi",
        slug: "samsung-galaxy-tab-a-8-0-2019-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-80-2019-r.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2960 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 WiFi",
        slug: "samsung-galaxy-tab-s6-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8920 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S5e WiFi",
        slug: "samsung-galaxy-tab-s5e-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s5e-sm-t725.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5980 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 10.1 (2019) LTE",
        slug: "samsung-galaxy-tab-a-10-1-2019-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-101-2019.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 3070 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 Lite WiFi",
        slug: "samsung-galaxy-tab-s6-lite-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7140 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 Lite LTE",
        slug: "samsung-galaxy-tab-s6-lite-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s6-lite-2024.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7980 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 WiFi",
        slug: "samsung-galaxy-tab-s7-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 12940 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 LTE",
        slug: "samsung-galaxy-tab-s7-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 15680 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 Plus LTE",
        slug: "samsung-galaxy-tab-s7-plus-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7-plus.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 17740 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A7 10.4 (2020) LTE",
        slug: "samsung-galaxy-tab-a7-10-4-2020-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a7-104-2020.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 4770 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A7 10.4 (2020) WiFi",
        slug: "samsung-galaxy-tab-a7-10-4-2020-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a7-104-2020.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 4040 },
            { storage: "3 GB/64 GB", basePrice: 4530 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 Plus WiFi",
        slug: "samsung-galaxy-tab-s7-plus-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7-plus.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 16560 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 FE WiFi",
        slug: "samsung-galaxy-tab-s7-fe-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7-fe.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 10680 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S7 FE LTE",
        slug: "samsung-galaxy-tab-s7-fe-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s7-fe.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 12940 },
            { storage: "6 GB/128 GB", basePrice: 15280 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A7 Lite WiFi",
        slug: "samsung-galaxy-tab-a7-lite-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a7-lite.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 4230 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A7 Lite LTE",
        slug: "samsung-galaxy-tab-a7-lite-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a7-lite.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 5020 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 7.0 (2016) WiFi",
        slug: "samsung-galaxy-tab-a-7-0-2016-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-70-2016-.jpg",
        variants: [
            { storage: "1.5 GB/8 GB", basePrice: 1230 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S4 10.5 WiFi",
        slug: "samsung-galaxy-tab-s4-10-5-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s4-2018-r.jpg",
        variants: [
            { storage: "4 GB/256 GB", basePrice: 5630 },
            { storage: "4 GB/64 GB", basePrice: 5340 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S4 10.5 LTE",
        slug: "samsung-galaxy-tab-s4-10-5-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s4-2018-r.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5980 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A8 10.5 (2021) WiFi Only",
        slug: "samsung-galaxy-tab-a8-10-5-2021-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a8.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 5520 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Samsung Galaxy Tab A8 10.5 (2021) WiFi Only",
        slug: "samsung-samsung-galaxy-tab-a8-10-5-2021-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a8.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6010 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Samsung Galaxy Tab A8 10.5 (2021) LTE",
        slug: "samsung-samsung-galaxy-tab-a8-10-5-2021-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a8.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 6890 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A8 10.5 (2021) LTE",
        slug: "samsung-galaxy-tab-a8-10-5-2021-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a8.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7290 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 WiFi Only",
        slug: "samsung-galaxy-tab-s8-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18370 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 5G",
        slug: "samsung-galaxy-tab-s8-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 21120 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 Plus WiFi Only",
        slug: "samsung-galaxy-tab-s8-plus-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8-plus.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 23660 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 Plus 5G",
        slug: "samsung-galaxy-tab-s8-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8-plus.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 27090 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 Ultra WiFi",
        slug: "samsung-galaxy-tab-s8-ultra-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 33460 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S8 Ultra 5G",
        slug: "samsung-galaxy-tab-s8-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 36310 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A 7.0 (2016) WiFi+4G",
        slug: "samsung-galaxy-tab-a-7-0-2016-wifi-4g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a-70-2016-.jpg",
        variants: [
            { storage: "1.5 GB/8 GB", basePrice: 1320 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 Lite (2022) LTE",
        slug: "samsung-galaxy-tab-s6-lite-2022-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/galaxy-tab-s6-lite-2022-lte-sm-p619-.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 9320 },
            { storage: "4 GB/128 GB", basePrice: 10190 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 Lite (2022) WiFi",
        slug: "samsung-galaxy-tab-s6-lite-2022-wifi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/galaxy-tab-s6-lite-2022-lte-sm-p619-.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7450 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 Wi-Fi Only",
        slug: "samsung-galaxy-tab-s9-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18660 },
            { storage: "12 GB/256 GB", basePrice: 25230 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 5G",
        slug: "samsung-galaxy-tab-s9-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 29640 },
            { storage: "12 GB/256 GB", basePrice: 34540 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 Plus Wi-Fi Only",
        slug: "samsung-galaxy-tab-s9-plus-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-plus.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 26210 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 Plus 5G",
        slug: "samsung-galaxy-tab-s9-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-plus.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 35030 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 Ultra Wi-Fi Only",
        slug: "samsung-galaxy-tab-s9-ultra-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 45320 },
            { storage: "12 GB/512 GB", basePrice: 47240 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 Ultra 5G",
        slug: "samsung-galaxy-tab-s9-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 49310 },
            { storage: "12 GB/512 GB", basePrice: 51980 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 FE Wi-Fi Only",
        slug: "samsung-galaxy-tab-s9-fe-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-fe-10-.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 13670 },
            { storage: "8 GB/256 GB", basePrice: 17260 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 FE Plus Wi-Fi Only",
        slug: "samsung-galaxy-tab-s9-fe-plus-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-fe-plus-10-.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15530 },
            { storage: "12 GB/256 GB", basePrice: 19260 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 FE Plus 5G",
        slug: "samsung-galaxy-tab-s9-fe-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-fe-plus-10-.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 20240 },
            { storage: "12 GB/256 GB", basePrice: 22980 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A9 Wi-Fi Only",
        slug: "samsung-galaxy-tab-a9-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4040 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A9 LTE",
        slug: "samsung-galaxy-tab-a9-lte",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4880 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A9 Plus Wi-Fi Only",
        slug: "samsung-galaxy-tab-a9-plus-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5810 },
            { storage: "8 GB/128 GB", basePrice: 7520 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A9 Plus 5G",
        slug: "samsung-galaxy-tab-a9-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a9-plus.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6800 },
            { storage: "8 GB/128 GB", basePrice: 8140 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S6 Lite (2022) Wi-Fi",
        slug: "samsung-galaxy-tab-s6-lite-2022-wi-fi",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/galaxy-tab-s6-lite-2022-lte-sm-p619-.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8040 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 Ultra WiFi Only",
        slug: "samsung-galaxy-tab-s10-ultra-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 46500 },
            { storage: "12 GB/512 GB", basePrice: 50420 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 Ultra 5G",
        slug: "samsung-galaxy-tab-s10-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 51400 },
            { storage: "12 GB/512 GB", basePrice: 56790 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy S10 Plus WiFi Only",
        slug: "samsung-galaxy-s10-plus-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-plus.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 39150 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy S10 Plus 5G",
        slug: "samsung-galaxy-s10-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-plus.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 44540 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 FE Wi-Fi Only",
        slug: "samsung-galaxy-tab-s10-fe-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-fe.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 22200 },
            { storage: "12 GB/256 GB", basePrice: 26900 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 FE 5G",
        slug: "samsung-galaxy-tab-s10-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-fe.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 26610 },
            { storage: "12 GB/256 GB", basePrice: 30600 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 FE Plus 5G",
        slug: "samsung-galaxy-tab-s10-fe-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-fe-plus.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 32780 },
            { storage: "12 GB/256 GB", basePrice: 37620 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 Lite Wi-Fi Only",
        slug: "samsung-galaxy-tab-s10-lite-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-lite.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 17690 },
            { storage: "8 GB/256 GB", basePrice: 21340 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S10 Lite 5G",
        slug: "samsung-galaxy-tab-s10-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s10-lite.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 20820 },
            { storage: "8 GB/256 GB", basePrice: 24330 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S11 Wi-Fi Only",
        slug: "samsung-galaxy-tab-s11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s11.jpg",
        variants: [
            { storage: "12 GB/128 GB", basePrice: 49650 },
            { storage: "12 GB/256 GB", basePrice: 51410 },
            { storage: "12 GB/512 GB", basePrice: 55170 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S11 5G",
        slug: "samsung-galaxy-tab-s11-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s11.jpg",
        variants: [
            { storage: "12 GB/128 GB", basePrice: 54640 },
            { storage: "12 GB/256 GB", basePrice: 59150 },
            { storage: "12 GB/512 GB", basePrice: 61140 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S11 Ultra Wi-Fi Only",
        slug: "samsung-galaxy-tab-s11-ultra-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s11-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 65620 },
            { storage: "12 GB/512 GB", basePrice: 69100 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S11 Ultra 5G",
        slug: "samsung-galaxy-tab-s11-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s11-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 74070 },
            { storage: "12 GB/512 GB", basePrice: 79050 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab S9 FE 5G",
        slug: "samsung-galaxy-tab-s9-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9-fe-10-.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 16810 },
            { storage: "8 GB/256 GB", basePrice: 20150 },
            { storage: "6 GB/128 GB", basePrice: 14650 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A11 Wi-Fi Only",
        slug: "samsung-galaxy-tab-a11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a11.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 8030 },
            { storage: "8 GB/128 GB", basePrice: 9210 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A11 Wi-Fi + 4G",
        slug: "samsung-galaxy-tab-a11-wi-fi-4g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a11.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 10780 },
            { storage: "8 GB/128 GB", basePrice: 11580 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A11 Plus Wi-Fi Only",
        slug: "samsung-galaxy-tab-a11-plus-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a11-plus.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 13150 },
            { storage: "8 GB/256 GB", basePrice: 15120 }
        ]
    },
    {
        category: "tablet",
        brand: "Samsung",
        modelName: "Galaxy Tab A11 Plus 5G",
        slug: "samsung-galaxy-tab-a11-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-a11-plus.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 15610 },
            { storage: "8 GB/256 GB", basePrice: 16110 }
        ]
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "tablet", brand: "Samsung" });
        console.log("Cleared existing Samsung tablet devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Samsung tablet devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();