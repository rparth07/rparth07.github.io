export const SURVEY_VERSION = "2026-10-30.1";
export const variants = {
  "global": {
    "currency": "USD",
    "fields": {
      "businessName": {
        "type": "text",
        "required": false
      },
      "responderName": {
        "type": "text",
        "required": false
      },
      "country": {
        "type": "enum",
        "required": false,
        "values": [
          "AF",
          "AL",
          "DZ",
          "AS",
          "AD",
          "AO",
          "AI",
          "AG",
          "AR",
          "AM",
          "AW",
          "AU",
          "AT",
          "AZ",
          "BS",
          "BH",
          "BD",
          "BB",
          "BY",
          "BE",
          "BZ",
          "BJ",
          "BM",
          "BT",
          "BO",
          "BQ",
          "BA",
          "BW",
          "BR",
          "IO",
          "VG",
          "BN",
          "BG",
          "BF",
          "BI",
          "CV",
          "KH",
          "CM",
          "CA",
          "029",
          "KY",
          "CF",
          "TD",
          "CL",
          "CN",
          "CX",
          "CC",
          "CO",
          "KM",
          "CG",
          "CD",
          "CK",
          "CR",
          "HR",
          "CU",
          "CW",
          "CY",
          "CZ",
          "CI",
          "DK",
          "DJ",
          "DM",
          "DO",
          "EC",
          "EG",
          "SV",
          "GQ",
          "ER",
          "EE",
          "SZ",
          "ET",
          "150",
          "FK",
          "FO",
          "FJ",
          "FI",
          "FR",
          "GF",
          "PF",
          "GA",
          "GM",
          "GE",
          "DE",
          "GH",
          "GI",
          "GR",
          "GL",
          "GD",
          "GP",
          "GU",
          "GT",
          "GG",
          "GN",
          "GW",
          "GY",
          "HT",
          "HN",
          "HK",
          "HU",
          "IS",
          "IN",
          "ID",
          "IR",
          "IQ",
          "IE",
          "IM",
          "IL",
          "IT",
          "JM",
          "JP",
          "JE",
          "JO",
          "KZ",
          "KE",
          "KI",
          "KR",
          "XK",
          "KW",
          "KG",
          "LA",
          "419",
          "LV",
          "LB",
          "LS",
          "LR",
          "LY",
          "LI",
          "LT",
          "LU",
          "MO",
          "MG",
          "MW",
          "MY",
          "MV",
          "ML",
          "MT",
          "MH",
          "MQ",
          "MR",
          "MU",
          "YT",
          "MX",
          "FM",
          "MD",
          "MC",
          "MN",
          "ME",
          "MS",
          "MA",
          "MZ",
          "MM",
          "NA",
          "NR",
          "NP",
          "NL",
          "NC",
          "NZ",
          "NI",
          "NE",
          "NG",
          "NU",
          "NF",
          "KP",
          "MK",
          "MP",
          "NO",
          "OM",
          "PK",
          "PW",
          "PS",
          "PA",
          "PG",
          "PY",
          "PE",
          "PH",
          "PN",
          "PL",
          "PT",
          "PR",
          "QA",
          "RO",
          "RU",
          "RW",
          "RE",
          "WS",
          "SM",
          "SA",
          "SN",
          "RS",
          "SC",
          "SL",
          "SG",
          "SX",
          "SK",
          "SI",
          "SB",
          "SO",
          "ZA",
          "SS",
          "ES",
          "LK",
          "SH",
          "BL",
          "KN",
          "LC",
          "MF",
          "PM",
          "VC",
          "SD",
          "SR",
          "SJ",
          "SE",
          "CH",
          "SY",
          "ST",
          "TW",
          "TJ",
          "TZ",
          "TH",
          "TL",
          "TG",
          "TK",
          "TO",
          "TT",
          "TN",
          "TM",
          "TC",
          "TV",
          "TR",
          "UM",
          "VI",
          "UG",
          "UA",
          "AE",
          "GB",
          "US",
          "UY",
          "UZ",
          "VU",
          "VA",
          "VE",
          "VN",
          "WF",
          "YE",
          "ZM",
          "ZW",
          "001",
          "AX",
          "Other / not listed",
          "Prefer not to say"
        ]
      },
      "currentSituation": {
        "type": "enum",
        "required": true,
        "values": [
          "No website",
          "Outdated website",
          "Missing features",
          "Good website, all features",
          "Improve good website",
          "Full replacement"
        ]
      },
      "businessType": {
        "type": "enum",
        "required": true,
        "values": [
          "Retail / Shop",
          "Manufacturer",
          "Wholesaler / Distributor",
          "Professional services",
          "Restaurant / Food",
          "Hotel / Travel",
          "Beauty / Salon / Wellness",
          "Healthcare",
          "Education / Coaching",
          "Construction / Real estate",
          "Artist / Handicraft / Creative business",
          "Other"
        ]
      },
      "businessTypeOtherText": {
        "type": "text",
        "required": false
      },
      "goals": {
        "type": "multiple",
        "required": false,
        "values": [
          "Professional image",
          "Show products",
          "Explain services",
          "More enquiries",
          "Calls / email / messages",
          "Sell online",
          "Bookings",
          "Reach wider market",
          "Portfolio",
          "Customer information",
          "Need guidance"
        ]
      },
      "customerActions": {
        "type": "multiple",
        "required": false,
        "values": [
          "Read about business",
          "See products/services",
          "See prices",
          "View media",
          "Search",
          "Filter",
          "Call",
          "Messaging apps",
          "Enquiry form",
          "Map",
          "Bookings",
          "Cart",
          "Online ordering",
          "Online payment",
          "Account",
          "Order history",
          "Save items"
        ]
      },
      "content": {
        "type": "multiple",
        "required": false,
        "values": [
          "About",
          "Products",
          "Services",
          "Prices",
          "Gallery",
          "Projects",
          "Reviews",
          "Contact",
          "Map",
          "FAQ",
          "Offers",
          "News",
          "Policies"
        ]
      },
      "catalogSize": {
        "type": "enum",
        "required": false,
        "values": [
          "1-10",
          "11-25",
          "26-50",
          "51-100",
          "101-500",
          "500+",
          "Not needed",
          "Unsure"
        ]
      },
      "buyFlow": {
        "type": "enum",
        "required": false,
        "values": [
          "No online sales",
          "Call or message",
          "Send enquiry",
          "Send order then contact",
          "Full online checkout",
          "Unsure"
        ]
      },
      "designLevel": {
        "type": "enum",
        "required": false,
        "values": [
          "Simple",
          "Modern",
          "Premium",
          "Unique",
          "Need recommendation"
        ]
      },
      "selfManage": {
        "type": "multiple",
        "required": false,
        "values": [
          "Nothing",
          "Text/photos",
          "Products/services",
          "Prices",
          "Offers",
          "Enquiries",
          "Orders",
          "News",
          "Unsure"
        ]
      },
      "assets": {
        "type": "multiple",
        "required": false,
        "values": [
          "Logo",
          "Brand style",
          "Domain",
          "Business copy",
          "Descriptions",
          "Prices",
          "Photos",
          "Videos",
          "Reviews",
          "Existing site",
          "Need help"
        ]
      },
      "extras": {
        "type": "multiple",
        "required": false,
        "values": [
          "Messaging apps",
          "Google Maps",
          "Reviews",
          "Booking",
          "Payments",
          "Shipping",
          "Coupons",
          "Customer accounts",
          "Order tracking",
          "Multiple languages",
          "Social media",
          "None",
          "Unsure"
        ]
      },
      "googleImportance": {
        "type": "enum",
        "required": false,
        "values": [
          "Very important",
          "Somewhat important",
          "Not very important",
          "Not important",
          "Unsure"
        ]
      },
      "timeline": {
        "type": "enum",
        "required": false,
        "values": [
          "ASAP",
          "2 weeks",
          "1 month",
          "2-3 months",
          "No deadline",
          "Exploring"
        ]
      },
      "budget": {
        "type": "enum",
        "required": true,
        "values": [
          "USD <250",
          "USD 250-<500",
          "USD 500-<1000",
          "USD 1000-<2000",
          "USD 2000-<5000",
          "USD 5000-<10000",
          "USD 10000+",
          "Unsure",
          "Prefer not to say"
        ]
      },
      "budgetFlexibility": {
        "type": "enum",
        "required": false,
        "values": [
          "Increase budget",
          "Phase build",
          "Reduce features",
          "Cheaper option",
          "Do not build",
          "Discuss first"
        ]
      },
      "hasExistingWebsite": {
        "type": "enum",
        "required": false,
        "values": [
          "No",
          "Yes"
        ]
      },
      "existingWebsiteUrl": {
        "type": "text",
        "required": false
      },
      "existingWebsiteSpend": {
        "type": "text",
        "required": false
      },
      "notes": {
        "type": "text",
        "required": false
      }
    }
  },
  "india": {
    "currency": "INR",
    "fields": {
      "businessName": {
        "type": "text",
        "required": false
      },
      "responderName": {
        "type": "text",
        "required": false
      },
      "currentSituation": {
        "type": "enum",
        "required": true,
        "values": [
          "No website",
          "Outdated website",
          "Missing features",
          "Good website, all features",
          "Improve good website",
          "Full replacement"
        ]
      },
      "businessType": {
        "type": "enum",
        "required": true,
        "values": [
          "Retail / Shop",
          "Manufacturer",
          "Wholesaler / Distributor",
          "Professional services",
          "Restaurant / Food",
          "Hotel / Travel",
          "Beauty / Salon / Wellness",
          "Healthcare",
          "Education / Coaching",
          "Construction / Real estate",
          "Artist / Handicraft / Creative business",
          "Other"
        ]
      },
      "businessTypeOtherText": {
        "type": "text",
        "required": false
      },
      "goals": {
        "type": "multiple",
        "required": false,
        "values": [
          "Professional image",
          "Show products",
          "Explain services",
          "More enquiries",
          "Calls / WhatsApp",
          "Sell online",
          "Bookings",
          "Reach wider market",
          "Portfolio",
          "Customer information",
          "Need guidance"
        ]
      },
      "customerActions": {
        "type": "multiple",
        "required": false,
        "values": [
          "Read about business",
          "See products/services",
          "See prices",
          "View media",
          "Search",
          "Filter",
          "Call",
          "WhatsApp",
          "Enquiry form",
          "Map",
          "Bookings",
          "Cart",
          "Online ordering",
          "Online payment",
          "Account",
          "Order history",
          "Save items"
        ]
      },
      "content": {
        "type": "multiple",
        "required": false,
        "values": [
          "About",
          "Products",
          "Services",
          "Prices",
          "Gallery",
          "Projects",
          "Reviews",
          "Contact",
          "Map",
          "FAQ",
          "Offers",
          "News",
          "Policies"
        ]
      },
      "catalogSize": {
        "type": "enum",
        "required": false,
        "values": [
          "1-10",
          "11-25",
          "26-50",
          "51-100",
          "101-500",
          "500+",
          "Not needed",
          "Unsure"
        ]
      },
      "buyFlow": {
        "type": "enum",
        "required": false,
        "values": [
          "No online sales",
          "Call or message",
          "Send enquiry",
          "Send order then contact",
          "Full online checkout",
          "Unsure"
        ]
      },
      "designLevel": {
        "type": "enum",
        "required": false,
        "values": [
          "Simple",
          "Modern",
          "Premium",
          "Unique",
          "Need recommendation"
        ]
      },
      "selfManage": {
        "type": "multiple",
        "required": false,
        "values": [
          "Nothing",
          "Text/photos",
          "Products/services",
          "Prices",
          "Offers",
          "Enquiries",
          "Orders",
          "News",
          "Unsure"
        ]
      },
      "assets": {
        "type": "multiple",
        "required": false,
        "values": [
          "Logo",
          "Brand style",
          "Domain",
          "Business copy",
          "Descriptions",
          "Prices",
          "Photos",
          "Videos",
          "Reviews",
          "Existing site",
          "Need help"
        ]
      },
      "extras": {
        "type": "multiple",
        "required": false,
        "values": [
          "WhatsApp",
          "Google Maps",
          "Reviews",
          "Booking",
          "Payments",
          "Shipping",
          "Coupons",
          "Customer accounts",
          "Order tracking",
          "Multiple languages",
          "Social media",
          "None",
          "Unsure"
        ]
      },
      "googleImportance": {
        "type": "enum",
        "required": false,
        "values": [
          "Very important",
          "Somewhat important",
          "Not very important",
          "Not important",
          "Unsure"
        ]
      },
      "timeline": {
        "type": "enum",
        "required": false,
        "values": [
          "ASAP",
          "2 weeks",
          "1 month",
          "2-3 months",
          "No deadline",
          "Exploring"
        ]
      },
      "budget": {
        "type": "enum",
        "required": true,
        "values": [
          "Under 10000",
          "10000-20000",
          "20000-30000",
          "30000-50000",
          "50000-75000",
          "75000-100000",
          "100000-150000",
          "150000-200000",
          "200000+",
          "Unsure"
        ]
      },
      "budgetFlexibility": {
        "type": "enum",
        "required": false,
        "values": [
          "Increase budget",
          "Phase build",
          "Reduce features",
          "Cheaper option",
          "Do not build",
          "Discuss first"
        ]
      },
      "hasExistingWebsite": {
        "type": "enum",
        "required": false,
        "values": [
          "No",
          "Yes"
        ]
      },
      "existingWebsiteUrl": {
        "type": "text",
        "required": false
      },
      "existingWebsiteSpend": {
        "type": "text",
        "required": false
      },
      "notes": {
        "type": "text",
        "required": false
      }
    }
  }
};
