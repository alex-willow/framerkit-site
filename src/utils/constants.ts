import {
  COMPONENT_SECTIONS as COMPONENT_MANIFEST,
  GETTING_STARTED_PAGES,
  LAYOUT_SECTIONS,
  TEMPLATE_SECTIONS,
} from "../shared/catalogManifest";

export const STATIC_SECTIONS = LAYOUT_SECTIONS.map((item) => item.id);
export const COMPONENT_SECTIONS = COMPONENT_MANIFEST.map((item) => item.id);
export const TEMPLATES = TEMPLATE_SECTIONS.map((item) => `templates/${item.id}`);
export { GETTING_STARTED_PAGES };
