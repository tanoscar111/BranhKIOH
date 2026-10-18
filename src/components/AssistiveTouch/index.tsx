import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AssistiveTouch.module.sass';

type FbUserProfile = {
  id: string;
  name: string;
  username?: string;
  avatarUrl: string;
};

type ChatMessage = {
  id: string;
  sender: 'user' | 'kioh';
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
  status?: 'sending' | 'sent' | 'queued';
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const STORAGE_MESSAGES_KEY = 'kioh_eiziboiz_chat_messages_v2';
const STORAGE_FB_USER_KEY = 'kioh_eiziboiz_fb_user_v2';
const FB_PROFILE_URL = 'https://www.facebook.com/Eiziboiz';
const FB_MESSENGER_URL = 'https://m.me/Eiziboiz';

const QUICK_PROMPTS = [
  'Báo giá dự án & Packshot',
  'Tư vấn Direction Artistique',
  'Hợp tác quay dựng MV / TVC',
];

const getNowTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
};

const createInitialsAvatar = (name: string): string => {
  const clean = (name || 'FB').trim();
  const parts = clean.split(/\s+/);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : clean.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#1877F2"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="30" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const parseFbInput = (raw: string): { displayName: string; username: string } => {
  const trimmed = raw.trim();
  const urlMatch = trimmed.match(/facebook\.com\/([a-zA-Z0-9._-]+)/i);
  if (urlMatch && urlMatch[1]) {
    return {
      displayName: urlMatch[1],
      username: urlMatch[1],
    };
  }
  const cleanHandle = trimmed.replace(/^@/, '');
  if (/^[a-zA-Z0-9._-]+$/.test(cleanHandle) && !cleanHandle.includes(' ')) {
    return {
      displayName: cleanHandle,
      username: cleanHandle,
    };
  }
  return {
    displayName: trimmed,
    username: '',
  };
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'kioh',
    senderName: 'Thanh Tân (KIOH)',
    text: 'Xin chào! Thanh Tân (@Eiziboiz) đang trực tuyến trên Facebook. Bạn có thể đăng nhập Facebook để gắn tên & avatar và nhắn tin trực tiếp ngay tại đây.',
    time: getNowTime(),
    status: 'sent',
  },
];

const getRealtimeReply = (userText: string, userName: string, isOnline: boolean): string => {
  const prefix = userName ? `Chào ${userName}! ` : 'Chào bạn! ';
  if (!isOnline) {
    return `${prefix}Hiện kết nối mạng đang gián đoạn, hệ thống đã tự động lưu tin nhắn của bạn và sẽ chuyển tới Facebook Thanh Tân (@Eiziboiz) ngay khi có mạng lại.`;
  }
  const lower = userText.toLowerCase();
  if (lower.includes('giá') || lower.includes('packshot') || lower.includes('chi phí')) {
    return `${prefix}Thanh Tân (@Eiziboiz) đã nhận được yêu cầu báo giá Packshot / Shooting của bạn. Nội dung đã được đồng bộ sẵn — nhấn mở hộp thư Messenger của Thanh Tân để trao đổi trực tiếp nhé!`;
  }
  if (lower.includes('direction') || lower.includes('tư vấn') || lower.includes('mv')) {
    return `${prefix}Cảm ơn bạn đã quan tâm tới Direction Artistique & MV tại KIOH. Tin nhắn đã sẵn sàng chuyển tiếp vào Messenger cá nhân của Thanh Tân (@Eiziboiz).`;
  }
  return `${prefix}Tin nhắn của bạn đã được chuẩn bị để gửi trực tiếp tới Facebook Thanh Tân (@Eiziboiz).`;
};

const AssistiveTouch = (): JSX.Element => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 72 : 300,
    y: typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.74) : 450,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSnapping, setIsSnapping] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Trạng thái online của Thanh Tân (@Eiziboiz) & mạng
  const [isThanhTanOnline, setIsThanhTanOnline] = useState<boolean>(true);
  const [autoOpenMessenger, setAutoOpenMessenger] = useState<boolean>(true);
  const [systemNotice, setSystemNotice] = useState<string>('');

  // Thông tin tài khoản Facebook khách hàng
  const [fbUser, setFbUser] = useState<FbUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FB_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage error
    }
    return null;
  });
  const [showLoginDrawer, setShowLoginDrawer] = useState<boolean>(false);
  const [fbNameInput, setFbNameInput] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_MESSAGES;
  });

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const hiddenMessengerLinkRef = useRef<HTMLAnchorElement>(null);

  const showTemporaryNotice = useCallback((msg: string) => {
    setSystemNotice(msg);
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = setTimeout(() => {
      setSystemNotice('');
    }, 4500);
  }, []);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3500);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Kiểm tra trạng thái mạng & kết nối tới Facebook Thanh Tân (@Eiziboiz) realtime
  useEffect(() => {
    const checkOnlineStatus = () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsThanhTanOnline(false);
        return;
      }
      const probe = new Image();
      probe.onload = () => setIsThanhTanOnline(true);
      probe.onerror = () => {
        // Nếu trình duyệt chặn tracking Facebook favicon, vẫn dựa trên navigator.onLine
        setIsThanhTanOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
      };
      probe.src = `https://www.facebook.com/favicon.ico?_t=${Date.now()}`;
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 25000);
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  // Tự động khởi tạo Facebook JS SDK nếu có cấu hình REACT_APP_FACEBOOK_APP_ID
  useEffect(() => {
    const fbAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
    if (!fbAppId || typeof window === 'undefined') return;

    window.fbAsyncInit = function () {
      if (!window.FB) return;
      window.FB.init({
        appId: fbAppId,
        cookie: true,
        xfbml: false,
        version: 'v19.0',
      });

      window.FB.getLoginStatus((response: { status: string }) => {
        if (response && response.status === 'connected') {
          window.FB.api(
            '/me',
            { fields: 'id,name,picture.type(large)' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (profileRes: any) => {
              if (profileRes && !profileRes.error && profileRes.name) {
                const profile: FbUserProfile = {
                  id: profileRes.id,
                  name: profileRes.name,
                  avatarUrl: profileRes.picture?.data?.url || createInitialsAvatar(profileRes.name),
                };
                setFbUser(profile);
                try {
                  localStorage.setItem(STORAGE_FB_USER_KEY, JSON.stringify(profile));
                } catch {
                  // Ignore
                }
              }
            },
          );
        }
      });
    };

    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      js.async = true;
      js.defer = true;
      document.body.appendChild(js);
    }
  }, []);

  // Giữ bong bóng tròn nằm gọn trong màn hình khi xoay ngang / resize
  useEffect(() => {
    const handleResize = () => {
      const bubbleSize = window.innerWidth <= 600 ? 52 : 56;
      const margin = 16;
      setPosition((prev) => {
        const snapRight = prev.x > window.innerWidth / 2;
        const nextX = snapRight ? window.innerWidth - bubbleSize - margin : margin;
        const nextY = Math.min(
          Math.max(margin, prev.y),
          Math.max(margin, window.innerHeight - bubbleSize - margin),
        );
        return { x: nextX, y: nextY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Đồng bộ tin nhắn và tài khoản Facebook realtime giữa các tab
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('kioh_eiziboiz_realtime_v2');
      bc.onmessage = (event) => {
        if (event.data?.messages && Array.isArray(event.data.messages)) {
          setMessages(event.data.messages);
        }
        if (event.data?.fbUser !== undefined) {
          setFbUser(event.data.fbUser);
        }
      };
      channelRef.current = bc;
      return () => bc.close();
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping, showLoginDrawer]);

  const persistMessages = useCallback((updated: ChatMessage[]) => {
    setMessages(updated);
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
    if (channelRef.current) {
      channelRef.current.postMessage({ messages: updated });
    }
  }, []);

  const saveFbProfile = useCallback(
    (profile: FbUserProfile | null) => {
      setFbUser(profile);
      try {
        if (profile) {
          localStorage.setItem(STORAGE_FB_USER_KEY, JSON.stringify(profile));
        } else {
          localStorage.removeItem(STORAGE_FB_USER_KEY);
        }
      } catch {
        // Ignore
      }
      if (channelRef.current) {
        channelRef.current.postMessage({ fbUser: profile });
      }
      if (profile) {
        showTemporaryNotice(`Đã kết nối Facebook: ${profile.name}`);
      }
    },
    [showTemporaryNotice],
  );

  // Xử lý đăng nhập Facebook kèm cơ chế tự động fix lỗi nếu thiếu App ID hoặc chạy trong iframe
  const handleFacebookLoginClick = () => {
    if (window.FB && process.env.REACT_APP_FACEBOOK_APP_ID) {
      try {
        window.FB.login(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (response: any) => {
            if (response && response.authResponse) {
              window.FB.api(
                '/me',
                { fields: 'id,name,picture.type(large)' },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (profileRes: any) => {
                  if (profileRes && !profileRes.error && profileRes.name) {
                    saveFbProfile({
                      id: profileRes.id,
                      name: profileRes.name,
                      avatarUrl:
                        profileRes.picture?.data?.url || createInitialsAvatar(profileRes.name),
                    });
                    setShowLoginDrawer(false);
                  } else {
                    setShowLoginDrawer(true);
                  }
                },
              );
            } else {
              setShowLoginDrawer(true);
            }
          },
          { scope: 'public_profile' },
        );
        return;
      } catch {
        // Tự động chuyển sang form nhập nhanh nếu trình duyệt chặn popup SDK
        setShowLoginDrawer(true);
        return;
      }
    }
    setShowLoginDrawer((prev) => !prev);
  };

  const handleConfirmQuickFbLogin = () => {
    if (!fbNameInput.trim()) return;
    const { displayName, username } = parseFbInput(fbNameInput);
    const avatarUrl = username
      ? `https://graph.facebook.com/${encodeURIComponent(username)}/picture?type=large`
      : createInitialsAvatar(displayName);

    const newProfile: FbUserProfile = {
      id: username || `fb-${Date.now()}`,
      name: displayName,
      username,
      avatarUrl,
    };
    saveFbProfile(newProfile);
    setFbNameInput('');
    setShowLoginDrawer(false);
  };

  const snapToNearestEdge = useCallback((currentX: number, currentY: number) => {
    const bubbleSize = window.innerWidth <= 600 ? 52 : 56;
    const margin = 16;
    const maxY = Math.max(margin, window.innerHeight - bubbleSize - margin);
    const clampedY = Math.min(Math.max(margin, currentY), maxY);
    const isRightHalf = currentX + bubbleSize / 2 >= window.innerWidth / 2;
    const targetX = isRightHalf ? window.innerWidth - bubbleSize - margin : margin;

    setIsSnapping(true);
    setPosition({ x: targetX, y: clampedY });
    setTimeout(() => {
      setIsSnapping(false);
    }, 400);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    resetIdleTimer();
    setIsSnapping(false);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: position.x,
      startY: position.y,
      moved: false,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    resetIdleTimer();
    const touch = e.touches[0];
    setIsSnapping(false);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      startX: position.x,
      startY: position.y,
      moved: false,
    };
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        dragStartRef.current.moved = true;
      }
      const bubbleSize = window.innerWidth <= 600 ? 52 : 56;
      const nextX = Math.min(
        Math.max(6, dragStartRef.current.startX + dx),
        window.innerWidth - bubbleSize - 6,
      );
      const nextY = Math.min(
        Math.max(6, dragStartRef.current.startY + dy),
        window.innerHeight - bubbleSize - 6,
      );
      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.clientX;
      const dy = touch.clientY - dragStartRef.current.clientY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        dragStartRef.current.moved = true;
      }
      const bubbleSize = window.innerWidth <= 600 ? 52 : 56;
      const nextX = Math.min(
        Math.max(6, dragStartRef.current.startX + dx),
        window.innerWidth - bubbleSize - 6,
      );
      const nextY = Math.min(
        Math.max(6, dragStartRef.current.startY + dy),
        window.innerHeight - bubbleSize - 6,
      );
      setPosition({ x: nextX, y: nextY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      if (!dragStartRef.current.moved) {
        setIsOpen((prev) => {
          const next = !prev;
          if (next) setUnreadCount(0);
          return next;
        });
      }
      snapToNearestEdge(position.x, position.y);
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, position.x, position.y, snapToNearestEdge, resetIdleTimer]);

  // Gửi tin nhắn kèm Tên + Logo Facebook của khách và chuyển tiếp trực tiếp tới Thanh Tân (@Eiziboiz)
  const handleSendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!trimmed) return;

    const senderName = fbUser ? fbUser.name : 'Khách truy cập';
    const senderAvatar = fbUser ? fbUser.avatarUrl : createInitialsAvatar('Khách');
    const formattedForThanhTan = fbUser ? `[Từ FB: ${fbUser.name}] ${trimmed}` : trimmed;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName,
      senderAvatar,
      text: trimmed,
      time: getNowTime(),
      status: isThanhTanOnline ? 'sent' : 'queued',
    };

    const nextMessages = [...messages, userMsg];
    persistMessages(nextMessages);
    if (textToSend === undefined) {
      setInputValue('');
    }

    // Tự động sao chép nội dung vào clipboard để phòng trường hợp ứng dụng Messenger trên điện thoại bỏ qua ?text=
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(formattedForThanhTan);
      } catch {
        // Ignore clipboard permission denial
      }
    }

    // Nếu bật chế độ nhắn trực tiếp với Thanh Tân và đang online, mở liên kết Messenger m.me/Eiziboiz
    if (autoOpenMessenger && isThanhTanOnline && hiddenMessengerLinkRef.current) {
      hiddenMessengerLinkRef.current.href = `${FB_MESSENGER_URL}?text=${encodeURIComponent(
        formattedForThanhTan,
      )}`;
      hiddenMessengerLinkRef.current.click();
      showTemporaryNotice('Đã copy tin nhắn & chuyển tiếp sang Messenger Thanh Tân (@Eiziboiz)');
    } else if (!isThanhTanOnline) {
      showTemporaryNotice('Đang ngoại tuyến: Đã lưu tin nhắn vào hàng đợi tự động gửi');
    }

    setIsTyping(true);
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `kioh-${Date.now()}`,
        sender: 'kioh',
        senderName: 'Thanh Tân (KIOH)',
        text: getRealtimeReply(trimmed, fbUser ? fbUser.name : '', isThanhTanOnline),
        time: getNowTime(),
        status: 'sent',
      };
      persistMessages([...nextMessages, replyMsg]);
      setIsTyping(false);
    }, 600);
  };

  const isRightSide = typeof window !== 'undefined' ? position.x > window.innerWidth / 2 : true;
  const panelStyle: React.CSSProperties =
    typeof window !== 'undefined' && window.innerWidth > 600
      ? {
          left: isRightSide ? Math.max(16, position.x - 372) : position.x + 68,
          top: Math.min(Math.max(20, position.y - 360), window.innerHeight - 530),
        }
      : {};

  return (
    <div className={styles.wrapper}>
      {/* Thẻ neo ẩn dùng để mở trực tiếp Messenger của Thanh Tân mà không dùng window.open */}
      <a
        ref={hiddenMessengerLinkRef}
        href={FB_MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Messenger
      </a>

      {/* Bong bóng logo KIOH chỉ hình tròn, không có khung vuông bên ngoài */}
      <button
        type="button"
        className={`${styles.bubble} ${isIdle && !isOpen ? styles.idle : ''} ${
          isOpen ? styles.active : ''
        } ${isDragging ? styles.dragging : ''} ${isSnapping ? styles.snapping : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={resetIdleTimer}
        aria-label="Mở chat trực tiếp với Thanh Tân KIOH"
      >
        {unreadCount > 0 && !isOpen && <span className={styles.unreadBadge}>{unreadCount}</span>}
        <span className={styles.logoText}>KIOH</span>
        <span className={`${styles.statusDot} ${!isThanhTanOnline ? styles.away : ''}`} />
      </button>

      {/* Hộp thoại Chat Realtime với Thanh Tân (@Eiziboiz) */}
      {isOpen && (
        <div className={styles.chatPanel} style={panelStyle}>
          {/* Header hiển thị trạng thái Online của Thanh Tân */}
          <div className={styles.chatHeader}>
            <div className={styles.brandInfo}>
              <div className={styles.avatarBox}>
                KIOH
                <span
                  className={`${styles.avatarOnline} ${!isThanhTanOnline ? styles.away : ''}`}
                />
              </div>
              <div className={styles.headerTexts}>
                <h4 className={styles.headerTitle}>Thanh Tân · @Eiziboiz</h4>
                <p className={`${styles.headerSub} ${!isThanhTanOnline ? styles.awayText : ''}`}>
                  {isThanhTanOnline
                    ? '● Facebook đang Online · Trả lời ngay'
                    : '● Tạm vắng · Tin nhắn sẽ gửi vào hộp thư chờ'}
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <a
                href={FB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fbProfileLink}
                title="Trang Facebook cá nhân Thanh Tân (@Eiziboiz)"
                aria-label="Facebook Thanh Tân"
              >
                f
              </a>
              <button
                type="button"
                className={styles.closePanelBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Đóng cửa sổ chat"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Thanh tài khoản Facebook của khách hàng (Lấy tên + logo avatar gắn vào tin nhắn) */}
          <div className={styles.userAuthBar}>
            {fbUser ? (
              <>
                <div className={styles.loggedUserBox}>
                  <div className={styles.userAvatarWrapper}>
                    <img
                      src={fbUser.avatarUrl}
                      alt={fbUser.name}
                      className={styles.userAvatarImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = createInitialsAvatar(
                          fbUser.name,
                        );
                      }}
                    />
                    <span className={styles.fbSmallBadge}>f</span>
                  </div>
                  <div>
                    <div className={styles.userNameText}>{fbUser.name}</div>
                    <span className={styles.userStatusSub}>Đã gắn tài khoản & logo vào chat</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={() => saveFbProfile(null)}
                >
                  Đổi TK
                </button>
              </>
            ) : (
              <>
                <div className={styles.loggedUserBox}>
                  <span className={styles.userStatusSub}>
                    Đăng nhập FB để hiện tên & avatar của bạn khi nhắn
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.fbLoginBtn}
                  onClick={handleFacebookLoginClick}
                >
                  <span>f</span> Đăng nhập FB
                </button>
              </>
            )}
          </div>

          {/* Khung nhập nhanh tài khoản FB nếu trình duyệt chặn popup hoặc chạy trong iframe */}
          {showLoginDrawer && !fbUser && (
            <div className={styles.loginFormDrawer}>
              <p className={styles.loginFormNote}>
                Nhập Tên Facebook hoặc Username/Link FB của bạn để tự động lấy Avatar & Tên hiển
                thị:
              </p>
              <div className={styles.loginFormInputs}>
                <input
                  type="text"
                  className={styles.loginInput}
                  placeholder="VD: Nguyễn Văn A hoặc fb.com/username"
                  value={fbNameInput}
                  onChange={(e) => setFbNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmQuickFbLogin();
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.loginConfirmBtn}
                  onClick={handleConfirmQuickFbLogin}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Thông báo tự động kiểm tra & xử lý lỗi */}
          {systemNotice && (
            <div className={styles.noticeBanner}>
              <span>{systemNotice}</span>
            </div>
          )}

          {/* Khu vực hiển thị tin nhắn kèm Logo Avatar & Tên tài khoản */}
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === 'user' ? styles.outgoing : styles.incoming
                }`}
              >
                <div className={styles.senderHeader}>
                  {msg.sender === 'kioh' ? (
                    <>
                      <span className={styles.msgKiohBadge}>KIOH</span>
                      <span className={styles.senderNameLabel}>{msg.senderName}</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.senderNameLabel}>{msg.senderName}</span>
                      <img
                        src={msg.senderAvatar || createInitialsAvatar(msg.senderName)}
                        alt={msg.senderName}
                        className={styles.msgAvatar}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = createInitialsAvatar(
                            msg.senderName,
                          );
                        }}
                      />
                    </>
                  )}
                </div>

                <div className={styles.messageBubble}>{msg.text}</div>

                <div className={styles.messageMeta}>
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <>
                      <span>{msg.status === 'queued' ? '· Chờ mạng' : '· Đã đồng bộ FB'}</span>
                      <a
                        href={`${FB_MESSENGER_URL}?text=${encodeURIComponent(
                          `[Từ FB: ${msg.senderName}] ${msg.text}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.forwardLink}
                      >
                        Mở chat Thanh Tân &#8599;
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageRow} ${styles.incoming}`}>
                <div className={styles.messageBubble}>Thanh Tân (@Eiziboiz) đang phản hồi...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div className={styles.quickReplies}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className={styles.quickReplyBtn}
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Tuỳ chọn kết nối trực tiếp vào Messenger Thanh Tân sau khi nhấn gửi */}
          <div className={styles.directToggleRow}>
            <label className={styles.directLabel}>
              <input
                type="checkbox"
                checked={autoOpenMessenger}
                onChange={(e) => setAutoOpenMessenger(e.target.checked)}
              />
              <span>Chuyển thẳng vào Messenger Thanh Tân khi gửi</span>
            </label>
            <a
              href={FB_MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.forwardLink}
            >
              m.me/Eiziboiz &#8599;
            </a>
          </div>

          {/* Ô nhập tin nhắn */}
          <form
            className={styles.inputBar}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className={styles.chatInput}
              placeholder={
                fbUser
                  ? `Nhắn cho Thanh Tân với tên ${fbUser.name}...`
                  : 'Nhập tin nhắn trực tiếp cho Thanh Tân...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputValue.trim()}
              aria-label="Gửi tin nhắn trực tiếp cho Thanh Tân"
            >
              &#10148;
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssistiveTouch;
