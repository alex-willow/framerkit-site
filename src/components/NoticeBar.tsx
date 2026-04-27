import { Info } from "lucide-react";

export default function NoticeBar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        width: "100%",
        background: "#5A32D3",
        color: "#fff",
        fontSize: "13px",
        padding: "8px 16px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      <Info size={14} />
      <span>
        FramerKit is actively being improved. All components are available to copy, but some parts of the website are still in progress.
      </span>
    </div>
  );
}
