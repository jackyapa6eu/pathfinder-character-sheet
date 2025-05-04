import React, { useEffect, useRef } from 'react';
import { getLSData } from '../../utils/helpers';

const CroppedImage = ({
  imageSrc,
  croppedAreaPixels = null,
  displayWidth = 200,
  displayHeight = 200,
  borderRadius = '4px',
  border = '1px solid #ddd',
  alwaysLight,
}) => {
  const canvasRef = useRef(null);
  const isDarkTheme = getLSData('darkTheme');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (imageSrc && croppedAreaPixels) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          displayWidth,
          displayHeight
        );
      };
    } else if (imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        ctx.drawImage(image, 0, 0, displayWidth, displayHeight);
      };
    }
  }, [imageSrc, croppedAreaPixels, displayWidth, displayHeight]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: displayWidth,
        height: displayHeight,
        borderRadius: borderRadius,
        border: border,
        filter: isDarkTheme && !alwaysLight ? 'invert(1)' : 'invert(0)',
        transition: 'all ease 0.3s',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default CroppedImage;
