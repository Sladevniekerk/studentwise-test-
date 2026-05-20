export const FREE_DISCOUNTS = [
  { store: "Vida e Caffè",   deal: "10% off with student card",         category: "Food",          code: "Show student ID" },
  { store: "Spotify",        deal: "R26.99/month student plan",         category: "Entertainment", code: "Via studentbeans.com" },
  { store: "Headspace",      deal: "85% off with student ID",           category: "Wellness",      code: "headspace.com/students" },
];

export const PREMIUM_DISCOUNTS = [
  ...FREE_DISCOUNTS,
  { store: "Woolworths Food",  deal: "R10 off orders over R150",              category: "Food",       code: "WSTUDENT" },
  { store: "Takealot",         deal: "Free delivery on first 3 orders",       category: "Shopping",   code: "TAKELOT1ST" },
  { store: "Apple Music",      deal: "R34.99/month student plan",             category: "Entertainment", code: "Verify via UNiDAYS" },
  { store: "Uber Eats",        deal: "Free delivery for 3 months",            category: "Food",       code: "UBEREATS3" },
  { store: "Computicket",      deal: "20% off live events",                   category: "Entertainment", code: "STUDENT20" },
  { store: "PnP Online",       deal: "R50 off first order over R400",         category: "Food",       code: "PNPSTUDENT" },
  { store: "Netflorist",       deal: "15% off all orders",                    category: "Gifts",      code: "STUDFLOWER" },
  { store: "Clicks",           deal: "Extra 5% on Clicks ClubCard",           category: "Health",     code: "Show student ID" },
  { store: "Steers",           deal: "Buy 1 get 1 on Tuesdays",               category: "Food",       code: "STEERS2FOR1" },
];
