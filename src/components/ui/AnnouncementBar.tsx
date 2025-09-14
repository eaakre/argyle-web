"use client";
import { useState, useEffect, useRef, JSX } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Typography } from "./Typography";

export interface Announcement {
  title: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  link?: string;
  linkText?: string;
  slug?: string;
  icon?: "info" | "alert" | "calendar" | "construction" | "emergency";
}

export interface AnnouncementBarProps {
  announcements?: Announcement[];
}

const AnnouncementBar = ({
  announcements = [],
}: AnnouncementBarProps): JSX.Element | null => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter active announcements that are within date range
  const activeAnnouncements: Announcement[] = announcements.filter(
    (announcement) => {
      if (!announcement.isActive) return false;

      const now = new Date();
      const startDate = announcement.startDate
        ? new Date(announcement.startDate)
        : null;
      const endDate = announcement.endDate
        ? new Date(announcement.endDate)
        : null;

      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;

      return true;
    }
  );

  // Auto-advance to next announcement
  useEffect(() => {
    if (isPlaying && activeAnnouncements.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
      }, 10000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, activeAnnouncements.length]);

  // Reset index when announcements change
  useEffect(() => {
    if (currentIndex >= activeAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [activeAnnouncements.length, currentIndex]);

  const goToPrevious = (): void => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeAnnouncements.length - 1 : prev - 1
    );
  };

  const goToNext = (): void => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const togglePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const currentAnnouncement = activeAnnouncements[currentIndex];
  const showControls = activeAnnouncements.length > 1;

  // Don't render if no active announcements
  if (!activeAnnouncements.length || !currentAnnouncement) return null;

  return (
    <div className="h-10 flex items-center px-2 text-sm">
      {/* Left controls - Fixed width */}
      <div className="flex items-center flex-shrink-0">
        {showControls && (
          <button
            onClick={goToPrevious}
            className="p-1 rounded transition-colors text-primary"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Center content - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center px-1 min-w-0">
        <div className="flex items-center gap-2 max-w-full min-w-0">
          {currentAnnouncement.icon && (
            <span className="flex-shrink-0">
              {getIconComponent(currentAnnouncement.icon)}
            </span>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <Typography
              variant="small"
              color="default"
              noMargin
              className="truncate text-sm font-semibold !text-primary uppercase min-w-0"
            >
              {currentAnnouncement.title}
            </Typography>
            {currentAnnouncement.link && (
              <a
                href={currentAnnouncement.link}
                className="flex-shrink-0 whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography
                  variant="small"
                  noMargin
                  color="default"
                  className="underline text-xs md:text-sm transition-colors !text-primary"
                >
                  {currentAnnouncement.linkText || "Learn more"}
                </Typography>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right controls - Fixed width */}
      <div className="flex items-center flex-shrink-0">
        {showControls && (
          <>
            <button
              onClick={togglePlayPause}
              className="p-1 text-primary rounded transition-colors"
              aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" className="text-primary" />
              ) : (
                <Play size={16} fill="currentColor" className="text-primary" />
              )}
            </button>
            <button
              onClick={goToNext}
              className="p-1 rounded transition-colors text-primary"
              aria-label="Next announcement"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {/* Indicator dots
        {showControls && (
          <div className="flex items-center gap-1 ml-1">
            {activeAnnouncements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-primary/30"
                }`}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

// Helper function to render icons
const getIconComponent = (iconType: Announcement["icon"]) => {
  const iconProps = { size: 16, className: "flex-shrink-0" };

  switch (iconType) {
    case "info":
      return <span {...iconProps}>ℹ️</span>;
    case "alert":
      return <span {...iconProps}>⚠️</span>;
    case "calendar":
      return <span {...iconProps}>📅</span>;
    case "construction":
      return <span {...iconProps}>🚧</span>;
    case "emergency":
      return <span {...iconProps}>🚨</span>;
    default:
      return null;
  }
};

export default AnnouncementBar;
