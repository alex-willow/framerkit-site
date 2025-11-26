// src/components/Footer.tsx
import { InstagramLogo, YoutubeLogo, TiktokLogo } from "phosphor-react";
import "../App.css";

export default function Footer() {
  return (
    <footer className="footer">
    <div className="footer-content">
      <span className="footer-text">© {new Date().getFullYear()} FramerKit. All rights reserved</span>

      <div className="footer-socials">
        <a href="https://www.instagram.com/framer.kit/" target="_blank" rel="noopener noreferrer">
          <InstagramLogo size={18} />
        </a>
        <a href="https://www.youtube.com/@framerkit_plugin" target="_blank" rel="noopener noreferrer">
          <YoutubeLogo size={18} />
        </a>
        <a href="https://www.tiktok.com/@framer_plugin" target="_blank" rel="noopener noreferrer">
          <TiktokLogo size={18} />
        </a>
      </div>
    </div>
  </footer>
  );
}
