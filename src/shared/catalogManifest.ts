export type CatalogSection = {
  id: string;
  label: string;
  jsonKey: string;
  description?: string;
  iconKey?: string;
  countLabel?: string;
};

export const DATA_ORIGIN = "https://raw.githubusercontent.com/alex-willow/framerkit-data";
const CATALOG_ENDPOINT = (import.meta as { env?: { VITE_CATALOG_ENDPOINT?: string } }).env
  ?.VITE_CATALOG_ENDPOINT;

export type CatalogGroup = "layout" | "components" | "templates";
export type CatalogManifest = Record<CatalogGroup, CatalogSection[]>;

export const FALLBACK_CATALOG_MANIFEST: CatalogManifest = {
layout: [
  { id: "navbar", label: "Navbar", jsonKey: "navbar" },
  { id: "hero", label: "Hero", jsonKey: "hero" },
  { id: "logo", label: "Logo", jsonKey: "logo" },
  { id: "feature", label: "Feature", jsonKey: "feature" },
  { id: "gallery", label: "Gallery", jsonKey: "gallery" },
  { id: "testimonial", label: "Testimonial", jsonKey: "testimonial" },
  { id: "contact", label: "Contact", jsonKey: "contact" },
  { id: "pricing", label: "Pricing", jsonKey: "pricing" },
  { id: "faq", label: "FAQ", jsonKey: "faq" },
  { id: "cta", label: "CTA", jsonKey: "cta" },
  { id: "footer", label: "Footer", jsonKey: "footer" },
],

components: [
  { id: "accordion", label: "Accordion", jsonKey: "accordion" },
  { id: "accordiongroup", label: "Accordion Group", jsonKey: "accordiongroup" },
  { id: "avatar", label: "Avatar", jsonKey: "avatar" },
  { id: "avatargroup", label: "Avatar Group", jsonKey: "avatargroup" },
  { id: "badge", label: "Badge", jsonKey: "badge" },
  { id: "button", label: "Button", jsonKey: "button" },
  { id: "card", label: "Card", jsonKey: "card" },
  { id: "icon", label: "Icon", jsonKey: "icon" },
  { id: "input", label: "Input", jsonKey: "input" },
  { id: "form", label: "Form", jsonKey: "form" },
  { id: "pricingcard", label: "Pricing Card", jsonKey: "Pricingcard" },
  { id: "rating", label: "Rating", jsonKey: "rating" },
  { id: "testimonialcard", label: "Testimonial Card", jsonKey: "Testimonialcard" },
  { id: "tabs", label: "Tabs", jsonKey: "tabs" },
],

templates: [
  { id: "framerkitdaily", label: "FramerKit Daily", jsonKey: "framerkitdaily" },
],
};

export const LAYOUT_SECTIONS: CatalogSection[] = FALLBACK_CATALOG_MANIFEST.layout;
export const COMPONENT_SECTIONS: CatalogSection[] = FALLBACK_CATALOG_MANIFEST.components;
export const TEMPLATE_SECTIONS: CatalogSection[] = FALLBACK_CATALOG_MANIFEST.templates;

export const GETTING_STARTED_PAGES = ["Overview", "Installation", "How It Works", "FAQ"] as const;

const buildCatalogApiUrl = (group: "layout" | "components" | "templates" | "meta", id: string) => {
  if (!CATALOG_ENDPOINT) return null;
  const url = new URL(CATALOG_ENDPOINT);
  url.searchParams.set("group", group);
  url.searchParams.set("id", id);
  return url.toString();
};

export const getCatalogManifestUrl = () => buildCatalogApiUrl("meta", "catalog-manifest");

export const getLayoutSectionUrl = (id: string) =>
  buildCatalogApiUrl("layout", id) ?? `${DATA_ORIGIN}/main/${id}.json`;
export const getComponentSectionUrl = (id: string) =>
  buildCatalogApiUrl("components", id) ?? `${DATA_ORIGIN}/components/${id}.json`;
export const getTemplateSectionUrl = (id: string) =>
  buildCatalogApiUrl("templates", id) ?? `${DATA_ORIGIN}/main/${id}`;
