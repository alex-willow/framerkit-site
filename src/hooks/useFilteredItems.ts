import { ComponentItem } from "../components/GalleryGrid";

export default function useFilteredItems(items: ComponentItem[], filter: "light" | "dark") {
  return items.filter(item => filter === "dark" ? item.key.includes("dark") : !item.key.includes("dark"));
}
