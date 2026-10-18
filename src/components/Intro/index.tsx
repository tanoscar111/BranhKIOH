import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Intro.module.sass';

type PropsType = {
  onFinish?: () => void;
};

const Intro = ({ onFinish }: PropsType): JSX.Element => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const lettersContainerRef = useRef<HTMLDivElement>(null);
  const letterKRef = useRef<HTMLSpanElement>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);
  const letterORef = useRef<HTMLSpanElement>(null);
  const letterHRef = useRef<HTMLSpanElement>(null);
  const loadingContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const letters = [
      letterKRef.current,
      letterIRef.current,
      letterORef.current,
      letterHRef.current,
    ].filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        if (onFinish) onFinish();
      },
    });
    timelineRef.current = tl;

    // Thiết lập trạng thái ban đầu
    gsap.set(overlayRef.current, { display: 'block' });
    gsap.set(curtainRef.current, { yPercent: 0 });
    gsap.set(lettersContainerRef.current, { opacity: 1, y: 0 });
    gsap.set(letters, {
      opacity: 0,
      y: 45,
      scale: 0.9,
      filter: 'blur(8px)',
    });
    gsap.set(loadingContainerRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(progressBarRef.current, { width: '0%' });

    // BƯỚC 1: Hiệu ứng xuất hiện tuần tự từng chữ K -> I -> O -> H
    letters.forEach((letter) => {
      tl.to(letter, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power3.out',
      });
    });

    // Dừng nhẹ 0.3s để chiêm ngưỡng chữ KIOH
    tl.to({}, { duration: 0.3 });

    // BƯỚC 2: Mờ chữ KIOH đi
    tl.to(lettersContainerRef.current, {
      opacity: 0,
      y: -25,
      filter: 'blur(6px)',
      duration: 0.55,
      ease: 'power2.inOut',
    });

    // BƯỚC 3: Hiển thị phần loading lên và chạy thanh tiến trình đến 100%
    tl.to(
      loadingContainerRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.15',
    );

    tl.to(progressBarRef.current, {
      width: '100%',
      duration: 1.4,
      ease: 'power2.inOut',
    });

    // Dừng nhẹ 0.2s khi thanh chạy đạt 100%
    tl.to({}, { duration: 0.2 });

    // Mờ thanh loading trước khi kéo màn
    tl.to(loadingContainerRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    });

    // BƯỚC 4: Kéo màn hình đen từ dưới lên Top siêu mượt
    tl.to(curtainRef.current, {
      yPercent: -100,
      duration: 1.15,
      ease: 'power4.inOut',
    });

    // Ẩn overlay hoàn toàn sau khi kéo màn xong
    tl.set(overlayRef.current, {
      display: 'none',
    });

    return () => {
      tl.kill();
    };
  }, [onFinish]);

  return (
    <div className={styles.introWrapper} ref={overlayRef}>
      <div className={styles.curtain} ref={curtainRef} />

      <div className={styles.content}>
        {/* Chữ KIOH xuất hiện tuần tự, sau đó mờ đi */}
        <div className={styles.lettersContainer} ref={lettersContainerRef}>
          <span ref={letterKRef} className={styles.letter}>
            K
          </span>
          <span ref={letterIRef} className={styles.letter}>
            I
          </span>
          <span ref={letterORef} className={styles.letter}>
            O
          </span>
          <span ref={letterHRef} className={styles.letter}>
            H
          </span>
        </div>

        {/* Phần loading: thanh tiến trình chạy đến 100% */}
        <div className={styles.loadingContainer} ref={loadingContainerRef}>
          <div className={styles.progressBarWrapper}>
            <div ref={progressBarRef} className={styles.progressBar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
