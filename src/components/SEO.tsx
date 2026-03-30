import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  image?: string; // Для превью в соцсетях
  canonical?: string;
};

export default function SEO({ 
  title, 
  description, 
  keywords = "framer components, ui kit, web design", 
  image = "/og-image.jpg",
  canonical 
}: SEOProps) {
  const { pathname } = useLocation();
  const baseUrl = "https://www.framerkit.site";
  const url = `${baseUrl}${pathname}`;

  useEffect(() => {
    // 1. Title
    document.title = `${title} | FramerKit`;
    
    // 2. Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
    
    // 3. Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute("content", keywords);
    
    // 4. Open Graph (для красивых ссылок в Telegram/Facebook)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDesc) ogDesc.setAttribute("content", description);
    if (ogImage) ogImage.setAttribute("content", `${baseUrl}${image}`);
    if (ogUrl) ogUrl.setAttribute("content", url);
    
    // 5. Twitter Cards
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    const twImage = document.querySelector('meta[name="twitter:image"]');
    
    if (twTitle) twTitle.setAttribute("content", title);
    if (twDesc) twDesc.setAttribute("content", description);
    if (twImage) twImage.setAttribute("content", `${baseUrl}${image}`);
    
    // 6. Canonical URL (чтобы избежать дублей)
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      (link as HTMLLinkElement).href = canonical;
    }
    
  }, [title, description, keywords, image, url, canonical]);

  return null;
}