/**
 * Color Extractor Utility
 * Extracts dominant color from images for ambient background effects
 */

/**
 * Extract dominant color from an image
 * @param {string} imageUrl - URL of the image
 * @returns {Promise<{r, g, b}>} RGB color object
 */
async function extractDominantColor(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Scale down for performance (10% of original size)
                const scale = 0.1;
                canvas.width = Math.max(1, Math.floor(img.width * scale));
                canvas.height = Math.max(1, Math.floor(img.height * scale));

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const color = getDominantColor(imageData.data);

                resolve(color);
            } catch (error) {
                console.warn('Canvas extraction failed:', error);
                resolve({ r: 15, g: 15, b: 15 }); // Fallback to dark
            }
        };

        img.onerror = () => {
            console.warn('Image loading failed for color extraction');
            resolve({ r: 15, g: 15, b: 15 }); // Fallback to dark
        };

        // Add timestamp to bypass cache if needed
        const separator = imageUrl.includes('?') ? '&' : '?';
        img.src = imageUrl + separator + 'ambient=1';
    });
}

/**
 * Get dominant color from pixel data
 * @param {Uint8ClampedArray} pixels - Image pixel data
 * @returns {{r, g, b}} RGB color object
 */
function getDominantColor(pixels) {
    const colorCounts = {};
    let totalPixels = 0;

    // Sample every 10th pixel for performance (RGBA = 4 values per pixel, so step by 40)
    for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Skip very dark pixels (likely black bars)
        if (r < 20 && g < 20 && b < 20) continue;

        // Skip very bright pixels (likely white text/overlays)
        if (r > 235 && g > 235 && b > 235) continue;

        // Round to nearest 10 to group similar colors
        const roundedR = Math.round(r / 10) * 10;
        const roundedG = Math.round(g / 10) * 10;
        const roundedB = Math.round(b / 10) * 10;

        const key = `${roundedR},${roundedG},${roundedB}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
        totalPixels++;
    }

    // Find most common color
    let maxCount = 0;
    let dominantColor = { r: 15, g: 15, b: 15 }; // Default dark

    for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = color.split(',').map(Number);
            dominantColor = { r, g, b };
        }
    }

    // Ensure the color is vibrant enough
    const { r, g, b } = dominantColor;
    const brightness = (r + g + b) / 3;

    // If color is too dull, enhance saturation
    if (brightness > 50 && brightness < 150) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;

        if (saturation < 0.3) {
            // Boost saturation by increasing the dominant channel
            const boost = 1.5;
            dominantColor.r = Math.min(255, Math.round(r * (r === max ? boost : 1)));
            dominantColor.g = Math.min(255, Math.round(g * (g === max ? boost : 1)));
            dominantColor.b = Math.min(255, Math.round(b * (b === max ? boost : 1)));
        }
    }

    return dominantColor;
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{h, s, l}} HSL color object
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}
