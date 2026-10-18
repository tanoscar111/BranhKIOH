import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ModalImage.module.sass';

export type ModalImageItem = {
  src: string;
  alt?: string;
};

type PropsType = {
  // Legacy support
  image?: string;
  alt?: string;
  display: boolean;

  // Slider support
  images?: (ModalImageItem | string)[];
  initialIndex?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onClose?: () => void;
};

const ModalImage = (props: PropsType): JSX.Element => {
  const {
    image,
    alt,
    display,
    images,
    initialIndex = 0,
    autoPlay = true,
    autoPlayInterval = 3500,
    onClose,
  } = props;

  // Normalize images array
  const normalizedImages: ModalImageItem[] = images
    ? images.map((item) => (typeof item === 'string' ? { src: item, alt: '' } : item))
    : image
    ? [{ src: image, alt: alt || '' }]
    : [];

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile & touch devices
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth <= 768;
      setIsMobile(hasTouch || isNarrow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync currentIndex with initialIndex when modal opens
  useEffect(() => {
    if (display) {
      setCurrentIndex(initialIndex);
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [display, initialIndex]);

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Auto play slideshow: ONLY on desktop, KHÔNG chạy tự động trên mobile
  useEffect(() => {
    // Trên mobile tắt hoàn toàn autoPlay theo yêu cầu
    if (!display || !autoPlay || isMobile || normalizedImages.length <= 1) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [
    display,
    autoPlay,
    isMobile,
    autoPlayInterval,
    normalizedImages.length,
    handleNext,
    currentIndex,
  ]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!display) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, handleNext, handlePrev, onClose]);

  // Touch gesture handlers for mobile: thao tác kéo trực tiếp
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartXRef.current;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = touchStartYRef.current - touchEndY;

    // Nếu kéo ngang đủ lớn (> 40px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        // Kéo sang trái -> Next
        handleNext();
      } else {
        // Kéo sang phải -> Prev
        handlePrev();
      }
    }
    setDragOffset(0);
  };

  const currentItem = normalizedImages[currentIndex] || {
    src: image || '',
    alt: alt || '',
  };

  return (
    <div
      className={`${styles.container} ${styles.animation__opacity} ${display ? styles.active : ''}`}
      onClick={(e) => {
        // Close if clicking outside the image or buttons
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer la vue agrandie">
          &times;
        </button>
      )}

      {/* Desktop Prev button (hidden on mobile via CSS) */}
      {normalizedImages.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Image précédente"
        >
          &#8592;
        </button>
      )}

      {/* Image container with touch support for mobile swipe */}
      <div
        className={styles.imageWrapper}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentItem.src}
          src={currentItem.src}
          alt={currentItem.alt || ''}
          style={{
            transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
          }}
        />
      </div>

      {/* Desktop Next button (hidden on mobile via CSS) */}
      {normalizedImages.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Image suivante"
        >
          &#8594;
        </button>
      )}

      {/* Counter indicator */}
      {normalizedImages.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {normalizedImages.length}
        </div>
      )}
    </div>
  );
};

export default ModalImage;
