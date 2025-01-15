const OPTIMIZED_IMG_WIDTH = 1000;
const OPTIMIZED_IMG_HEIGHT = 1000;

/**
 * @param {number} width
 * @param {number} height
 */
export const getTargetDimensions = (width: number, height: number) => {
  if (width < OPTIMIZED_IMG_WIDTH && height < OPTIMIZED_IMG_HEIGHT) return [width, height];

  const maxSize = height > width ? height : width;
  const scale = OPTIMIZED_IMG_WIDTH / maxSize;

  return [Math.floor(width * scale), Math.floor(height * scale)];
};