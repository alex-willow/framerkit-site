import { Info } from "lucide-react";

export default function NoticeBar() {
  return (
    <>
      <style>{`
        .notice-bar span {
          font-size: clamp(9px, 2.8vw, 13px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      `}</style>
      <div
        className="notice-bar"
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
          boxSizing: "border-box",
        }}
      >
        <Info size={14} />
        <span style={{ display: "block" }}>
          FramerKit is actively being improved. All components are available to copy, but some parts of the website are still in progress.
        </span>
      </div>
    </>
  );
}
