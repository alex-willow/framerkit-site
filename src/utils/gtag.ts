type GtagParams = Record<string, unknown>;

type WindowWithGtag = Window & {
  gtag?: (command: string, event: string, params?: GtagParams) => void;
};

export const trackGtagEvent = (event: string, params?: GtagParams) => {
  if (typeof window === "undefined") return;

  const windowWithGtag = window as WindowWithGtag;
  windowWithGtag.gtag?.("event", event, params);
};
