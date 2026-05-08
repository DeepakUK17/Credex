/**
 * PRICING_DATA — All AI tool pricing constants
 *
 * Sources verified from official vendor pages.
 * Last updated: 2026-05-08
 * See PRICING_DATA.md for full citations with URLs.
 */

export type PlanTier = {
  id: string;
  name: string;
  monthlyPricePerSeat: number; // USD/seat/month
  billingNote?: string;        // e.g. "billed annually"
  maxSeats?: number;           // undefined = unlimited
  minSeats?: number;
};

export type ToolPricingData = {
  toolId: string;
  displayName: string;
  vendor: string;
  category: 'coding' | 'writing' | 'research' | 'general' | 'multi';
  plans: PlanTier[];
  sourceUrl: string;
  verifiedDate: string;
};

export const PRICING: Record<string, ToolPricingData> = {
  cursor: {
    toolId: 'cursor',
    displayName: 'Cursor',
    vendor: 'Anysphere',
    category: 'coding',
    plans: [
      { id: 'hobby',      name: 'Hobby',      monthlyPricePerSeat: 0,    billingNote: 'Free tier' },
      { id: 'pro',        name: 'Pro',        monthlyPricePerSeat: 20,   billingNote: '$20/month' },
      { id: 'business',   name: 'Business',   monthlyPricePerSeat: 40,   billingNote: '$40/seat/month billed annually' },
    ],
    sourceUrl: 'https://www.cursor.com/pricing',
    verifiedDate: '2026-05-08',
  },

  github_copilot: {
    toolId: 'github_copilot',
    displayName: 'GitHub Copilot',
    vendor: 'GitHub / Microsoft',
    category: 'coding',
    plans: [
      { id: 'free',       name: 'Free',       monthlyPricePerSeat: 0,    billingNote: 'Limited completions' },
      { id: 'individual', name: 'Individual', monthlyPricePerSeat: 10,   billingNote: '$10/month or $100/year' },
      { id: 'business',   name: 'Business',   monthlyPricePerSeat: 19,   billingNote: '$19/seat/month' },
      { id: 'enterprise', name: 'Enterprise', monthlyPricePerSeat: 39,   billingNote: '$39/seat/month' },
    ],
    sourceUrl: 'https://github.com/features/copilot',
    verifiedDate: '2026-05-08',
  },

  claude: {
    toolId: 'claude',
    displayName: 'Claude (claude.ai)',
    vendor: 'Anthropic',
    category: 'multi',
    plans: [
      { id: 'free',       name: 'Free',       monthlyPricePerSeat: 0 },
      { id: 'pro',        name: 'Pro',        monthlyPricePerSeat: 20,   billingNote: '$20/month' },
      { id: 'max_5x',    name: 'Max (5×)',    monthlyPricePerSeat: 100,  billingNote: '$100/month — 5× usage vs Pro' },
      { id: 'max_20x',   name: 'Max (20×)',   monthlyPricePerSeat: 200,  billingNote: '$200/month — 20× usage vs Pro' },
      { id: 'team',       name: 'Team',       monthlyPricePerSeat: 30,   billingNote: '$30/seat/month, min 5 seats', minSeats: 5 },
      { id: 'enterprise', name: 'Enterprise', monthlyPricePerSeat: 60,   billingNote: 'Estimated, negotiated per org', minSeats: 5 },
    ],
    sourceUrl: 'https://claude.ai/pricing',
    verifiedDate: '2026-05-08',
  },

  anthropic_api: {
    toolId: 'anthropic_api',
    displayName: 'Anthropic API (direct)',
    vendor: 'Anthropic',
    category: 'multi',
    plans: [
      // Usage-based; we treat monthly spend as the "plan" value directly
      { id: 'api', name: 'API (pay-as-you-go)', monthlyPricePerSeat: 0, billingNote: 'Usage-based pricing' },
    ],
    sourceUrl: 'https://www.anthropic.com/pricing',
    verifiedDate: '2026-05-08',
  },

  chatgpt: {
    toolId: 'chatgpt',
    displayName: 'ChatGPT (chat.openai.com)',
    vendor: 'OpenAI',
    category: 'multi',
    plans: [
      { id: 'free',       name: 'Free',       monthlyPricePerSeat: 0 },
      { id: 'plus',       name: 'Plus',       monthlyPricePerSeat: 20,   billingNote: '$20/month' },
      { id: 'pro',        name: 'Pro',        monthlyPricePerSeat: 200,  billingNote: '$200/month — unlimited o1-pro' },
      { id: 'team',       name: 'Team',       monthlyPricePerSeat: 30,   billingNote: '$30/seat/month billed annually', minSeats: 2 },
      { id: 'enterprise', name: 'Enterprise', monthlyPricePerSeat: 60,   billingNote: 'Estimated, negotiated', minSeats: 150 },
    ],
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedDate: '2026-05-08',
  },

  openai_api: {
    toolId: 'openai_api',
    displayName: 'OpenAI API (direct)',
    vendor: 'OpenAI',
    category: 'multi',
    plans: [
      { id: 'api', name: 'API (pay-as-you-go)', monthlyPricePerSeat: 0, billingNote: 'Usage-based pricing' },
    ],
    sourceUrl: 'https://openai.com/api/pricing',
    verifiedDate: '2026-05-08',
  },

  gemini: {
    toolId: 'gemini',
    displayName: 'Gemini',
    vendor: 'Google',
    category: 'multi',
    plans: [
      { id: 'free',       name: 'Free (1.5 Flash)', monthlyPricePerSeat: 0 },
      { id: 'advanced',   name: 'Gemini Advanced',  monthlyPricePerSeat: 22, billingNote: '$21.99/month (Google One AI Premium)' },
      { id: 'api',        name: 'API (pay-as-you-go)', monthlyPricePerSeat: 0, billingNote: 'Usage-based; Gemini 1.5 Pro $3.50/1M tokens' },
    ],
    sourceUrl: 'https://ai.google.dev/pricing',
    verifiedDate: '2026-05-08',
  },

  windsurf: {
    toolId: 'windsurf',
    displayName: 'Windsurf',
    vendor: 'Codeium',
    category: 'coding',
    plans: [
      { id: 'free',   name: 'Free',   monthlyPricePerSeat: 0,  billingNote: 'Limited flows' },
      { id: 'pro',    name: 'Pro',    monthlyPricePerSeat: 15, billingNote: '$15/month' },
      { id: 'pro_plus', name: 'Pro+', monthlyPricePerSeat: 35, billingNote: '$35/month — more flow credits' },
      { id: 'teams',  name: 'Teams',  monthlyPricePerSeat: 35, billingNote: '$35/seat/month', minSeats: 2 },
    ],
    sourceUrl: 'https://windsurf.com/pricing',
    verifiedDate: '2026-05-08',
  },
};

export const ALL_TOOL_IDS = Object.keys(PRICING);

/** Credex discount assumption: 20-30% on qualifying tools > $200/mo retail */
export const CREDEX_DISCOUNT_LOW = 0.20;
export const CREDEX_DISCOUNT_HIGH = 0.30;
export const CREDEX_THRESHOLD_MONTHLY = 200; // USD

/** Benchmark: average AI spend per developer at seed-Series A startups */
export const BENCHMARK_SPEND_PER_DEV = 85; // USD/dev/month
