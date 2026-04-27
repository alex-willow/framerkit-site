import "./ImageFrame.css";

type ImageFrameProps = {
  src: string;
  alt?: string;
  className?: string;
  caption?: string;
};

export default function ImageFrame({ src, alt = "", className = "", caption }: ImageFrameProps) {
  return (
    <div className="image-frame-wrap">
      <div className={`image-frame ${className}`.trim()}>
        <div className="image-frame__container">
          <img
            src={src}
            alt={alt}
            className="image-frame__image"
          />
        </div>
      </div>

      {caption ? <span className="image-frame__caption">{caption}</span> : null}
    </div>
  );
}
