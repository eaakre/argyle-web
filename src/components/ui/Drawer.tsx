import React, { useEffect } from "react";
import { X } from "lucide-react";

type DrawerDirection = "left" | "right" | "top" | "bottom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  direction: DrawerDirection;
  children: React.ReactNode;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  direction,
  children,
  showOverlay = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getDrawerClasses = () => {
    const baseClasses =
      "fixed bg-bg-primary shadow-xl transition-transform duration-300 ease-in-out z-50";

    const directionClasses = {
      left: `top-0 left-0 h-full w-[90%] max-w-[400px] ${
        isOpen ? "transform translate-x-0" : "transform -translate-x-full"
      }`,
      right: `top-0 right-0 h-full w-[90%] max-w-[400px] ${
        isOpen ? "transform translate-x-0" : "transform translate-x-full"
      }`,
      top: `top-0 left-0 w-full h-[90%] max-h-[400px] ${
        isOpen ? "transform translate-y-0" : "transform -translate-y-full"
      }`,
      bottom: `bottom-0 left-0 w-full h-[90%] max-h-[400px] ${
        isOpen ? "transform translate-y-0" : "transform translate-y-full"
      }`,
    };

    return `${baseClasses} ${directionClasses[direction]} ${className}`;
  };

  const getCloseButtonPosition = () => {
    const baseClasses =
      "absolute p-2 hover:bg-gray-100 rounded-full transition-colors";

    const positions = {
      left: "top-4 right-4",
      right: "top-4 left-4",
      top: "top-4 right-4",
      bottom: "bottom-4 right-4",
    };

    return `${baseClasses} ${positions[direction]}`;
  };

  if (
    typeof window === "undefined" ||
    (!isOpen &&
      !document.querySelector(`[data-drawer-direction="${direction}"]`))
  ) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
      )}

      {/* Drawer */}
      <div className={getDrawerClasses()} data-drawer-direction={direction}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={getCloseButtonPosition()}
          aria-label="Close drawer"
        >
          <X size={32} className="text-primary-foreground" />
        </button>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
