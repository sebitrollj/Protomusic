/**
 * Image Retry Helper
 * Automatically retries loading images that fail (useful for slow proxy cold starts)
 */

class ImageRetryHandler {
    constructor() {
        this.retryAttempts = new Map(); // Track retry counts per image
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds
    }

    /**
     * Setup retry handler for an image element
     * @param {HTMLImageElement} img - Image element to monitor
     * @param {string} src - Source URL
     */
    setupRetry(img, src) {
        if (!img || !src) return;

        const retryKey = src;

        // Initialize retry count
        if (!this.retryAttempts.has(retryKey)) {
            this.retryAttempts.set(retryKey, 0);
        }

        img.onerror = () => {
            const attempts = this.retryAttempts.get(retryKey) || 0;

            if (attempts < this.maxRetries) {
                console.log(`[ImageRetry] Retrying ${src} (attempt ${attempts + 1}/${this.maxRetries})`);

                // Increment retry count
                this.retryAttempts.set(retryKey, attempts + 1);

                // Retry after delay
                setTimeout(() => {
                    // Force reload by adding timestamp
                    img.src = `${src}?retry=${Date.now()}`;
                }, this.retryDelay);
            } else {
                console.log(`[ImageRetry] Max retries reached for ${src}, using placeholder`);
                // Final fallback to placeholder
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23666" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
            }
        };

        img.onload = () => {
            // Reset retry count on successful load
            this.retryAttempts.delete(retryKey);
        };
    }

    /**
     * Setup retry for background images (featured section)
     * @param {HTMLElement} element - Element with background image
     * @param {string} url - Background image URL
     */
    setupBackgroundRetry(element, url) {
        if (!element || !url) return;

        const retryKey = url;

        if (!this.retryAttempts.has(retryKey)) {
            this.retryAttempts.set(retryKey, 0);
        }

        // Test if image loads
        const testImg = new Image();
        testImg.onload = () => {
            this.retryAttempts.delete(retryKey);
        };

        testImg.onerror = () => {
            const attempts = this.retryAttempts.get(retryKey) || 0;

            if (attempts < this.maxRetries) {
                console.log(`[ImageRetry] Retrying background ${url} (attempt ${attempts + 1}/${this.maxRetries})`);

                this.retryAttempts.set(retryKey, attempts + 1);

                setTimeout(() => {
                    element.style.backgroundImage = `url(${url}?retry=${Date.now()})`;
                    // Retry the test
                    this.setupBackgroundRetry(element, url);
                }, this.retryDelay);
            } else {
                console.log(`[ImageRetry] Max retries reached for background ${url}`);
                // Keep existing background or show placeholder color
                element.style.backgroundColor = '#1a1a1a';
            }
        };

        testImg.src = url;
    }
}

// Global instance
const imageRetry = new ImageRetryHandler();
window.imageRetry = imageRetry;
