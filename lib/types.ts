export type DesignMode = "preview" | "project";
export type ProviderMode = "auto" | "groq" | "mistral" | "nvidia" | "openrouter";
export type ToneOption = "minimal" | "futuristic" | "playful" | "bold" | "corporate" | "brutalist";
export type SectionId =
  | "hero" | "features" | "socialProof" | "howItWorks"
  | "pricing" | "faq" | "cta" | "footer" | "navbar";

export interface DesignBrief {
  goal: string;
  productName?: string;
  audience?: string;
  tone?: ToneOption;
  brandKeywords?: string[];
  sections?: SectionId[];
  imageryKeywords?: string[];
  colorHints?: string;
  wantsPreview?: boolean;
  wantsMultiPage?: boolean;
  existingHtml?: string;
  refinementNote?: string;
}

export interface DesignRequestPayload {
  mode: DesignMode;
  brief: DesignBrief;
  providerMode: ProviderMode;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface DesignResponse {
  previewHtml?: string;
  files?: GeneratedFile[];
  modelUsed?: string;
  imageUrls?: string[];
  error?: string;
}
