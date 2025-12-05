import { useState, useEffect } from "react";
import { ComponentItem } from "../components/GalleryGrid";

export default function useFetchItems(url: string) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setItems(json[Object.keys(json)[0]] || []);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [url]);

  return { items, loading, error };
}
