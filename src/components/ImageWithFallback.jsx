import { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imgError, setImgError] = useState(false);

  // SVG заглушка (встроенная, не зависит от внешних сервисов)
  const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 185 278'%3E%3Crect width='185' height='278' fill='%232a2f3f'/%3E%3Ctext x='92.5' y='130' font-size='40' fill='%237f8c8d' text-anchor='middle' font-family='Arial'%3E🎬%3C/text%3E%3Ctext x='92.5' y='160' font-size='14' fill='%237f8c8d' text-anchor='middle' font-family='Arial'%3ENo Image%3C/text%3E%3C/svg%3E`;

  const handleError = () => {
    setImgError(true);
  };

  return (
    <img
      src={imgError ? fallbackSvg : src || fallbackSvg}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};