import YouTube from 'react-youtube';
import { useEffect } from 'react';

export const TrailerModal = ({ isOpen, onClose, videoKey, title }) => {
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      origin: window.location.origin, // 👈 Добавляем origin
    },
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoKey) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || 'Trailer'} — Trailer</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-video">
          <YouTube 
            videoId={videoKey} 
            opts={opts}
            onError={(e) => console.error('YouTube error:', e)}
            onReady={(e) => console.log('YouTube player ready')}
          />
        </div>
      </div>
    </div>
  );
};