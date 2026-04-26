import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play } from "lucide-react";
import "./HoverVideo.css";

type HoverVideoProps = {
  src: string;
  className?: string;
  caption?: string;
};

export default function HoverVideo({ src, className = "", caption }: HoverVideoProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const wasPlayingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [timeText, setTimeText] = useState("0:00 / -0:00");

  const feedbackTimerRef = useRef<number | null>(null);
  const [feedback, setFeedback] = useState<"play" | "pause" | null>(null);

  const showFeedback = (type: "play" | "pause") => {
    setFeedback(type);
  
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
  
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 900);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const updateTimeText = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
  
    const current = video.currentTime;
    const duration = video.duration;
  
    setTimeText(`${formatTime(current)} / ${formatTime(duration)}`);
  };

  const stopProgress = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const setProgress = (value: number) => {
    if (!progressFillRef.current) return;
    const clamped = Math.max(0, Math.min(value, 100));
    progressFillRef.current.style.transform = `scaleX(${clamped / 100})`;
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    setProgress((video.currentTime / video.duration) * 100);
    updateTimeText();

    if (!video.paused && !video.ended) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const playVideo = async (showIcon = false) => {
    const video = videoRef.current;
    if (!video) return;
  
    try {
      setHasStarted(true);
      await video.play();
  
      setIsPlaying(true);
  
      if (showIcon) {
        showFeedback("play");
      }
  
      stopProgress();
      rafRef.current = requestAnimationFrame(updateProgress);
    } catch {
      // ignore autoplay issues
    }
  };

  const handleMouseEnter = () => {
    if (!hasStarted) {
      playVideo(false);
    }
  };

  const pauseVideo = (showIcon = false) => {
    const video = videoRef.current;
    if (!video) return;
  
    video.pause();
    setIsPlaying(false);
  
    if (showIcon) {
      showFeedback("pause");
    }
  
    stopProgress();
    updateTimeText();
  };

  const togglePlay = (event?: React.MouseEvent) => {
    event?.stopPropagation();
  
    const video = videoRef.current;
    if (!video) return;
  
    if (video.paused || video.ended) {
      playVideo(true);
    } else {
      pauseVideo(true);
    }
  };

  const seekToPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;

    if (!video || !progress || !video.duration) return;

    const rect = progress.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(x / rect.width, 1));

    video.currentTime = ratio * video.duration;

    setProgress(ratio * 100);
    updateTimeText();
    setHasStarted(true);
  };

  const handleProgressPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    wasPlayingRef.current = !video.paused && !video.ended;

    video.pause();
    setIsPlaying(false);
    stopProgress();

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    seekToPointer(event);
  };

  const handleProgressPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    event.stopPropagation();
    seekToPointer(event);
  };

  const handleProgressPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (wasPlayingRef.current) {
      playVideo(false);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    stopProgress();

    video.pause();
    video.currentTime = 0;

    setProgress(0);
    setIsPlaying(false);
    setHasStarted(false);
    updateTimeText();
  };

  const handleFullscreen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const player = playerRef.current;
    if (!player) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await player.requestFullscreen();
      }
    } catch {
      // ignore fullscreen issues
    }
  };

  useEffect(() => {
    return () => {
      stopProgress();
  
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="hover-video-wrap">
      <div
        ref={playerRef}
        className={`hover-video ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
      >
        <div className="hover-video__frame" onClick={() => togglePlay()}>
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={updateTimeText}
            onEnded={handleEnded}
          />

          {feedback && (
            <div className="hover-video__feedback">
              <div className="hover-video__feedback-icon">
                {feedback === "play" ? (
                  <Play size={20} strokeWidth={2.2} fill="currentColor" />
                ) : (
                  <Pause size={20} strokeWidth={2.2} />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hover-video__controls">
          <div className="hover-video__controls-row">
            <button
              className="hover-video__control-btn"
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause size={16} strokeWidth={2.2} /> : <Play size={16} strokeWidth={2.2} fill="currentColor" />}
            </button>

            <span className="hover-video__time">{timeText}</span>

            <div
              ref={progressRef}
              className="hover-video__progress"
              onPointerDown={handleProgressPointerDown}
              onPointerMove={handleProgressPointerMove}
              onPointerUp={handleProgressPointerUp}
            >
              <div className="hover-video__progress-track" />
              <div ref={progressFillRef} className="hover-video__progress-fill" />
            </div>

            <button
              className="hover-video__control-btn hover-video__fullscreen"
              type="button"
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {caption ? <span className="hover-video__caption">{caption}</span> : null}
    </div>
  );
}
