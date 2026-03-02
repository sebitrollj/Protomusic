/**
 * Floating Mini Player Widget
 * Draggable mini player that can be moved around the screen
 */

class FloatingPlayer {
    constructor(mainPlayer) {
        console.log('🎵 FloatingPlayer constructor called');

        this.mainPlayer = mainPlayer;
        this.floatingElement = document.getElementById('floatingPlayer');
        this.header = document.getElementById('floatingPlayerHeader');
        this.videoElement = document.getElementById('floatingVideoPlayer');
        this.title = document.getElementById('floatingTitle');
        this.artist = document.getElementById('floatingArtist');

        console.log('🎵 Elements found:', {
            floatingElement: !!this.floatingElement,
            header: !!this.header,
            videoElement: !!this.videoElement,
            title: !!this.title,
            artist: !!this.artist
        });

        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;

        this.init();
    }

    init() {
        // Drag & drop events
        this.header.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());

        // Control buttons
        document.getElementById('expandFloatingBtn')?.addEventListener('click', () => this.expand());
        document.getElementById('closeFloatingBtn')?.addEventListener('click', () => this.close());
        document.getElementById('floatingPlayPauseBtn')?.addEventListener('click', () => this.togglePlay());
        document.getElementById('floatingPrevBtn')?.addEventListener('click', () => this.previous());
        document.getElementById('floatingNextBtn')?.addEventListener('click', () => this.next());

        // Sync with main video events
        this.videoElement.addEventListener('play', () => this.updatePlayButton());
        this.videoElement.addEventListener('pause', () => this.updatePlayButton());
        this.videoElement.addEventListener('ended', () => this.next());
    }

    show() {
        // Don't show if already visible
        if (!this.floatingElement.classList.contains('hidden')) {
            console.log('🎵 Floating player already visible');
            return;
        }

        // Update metadata
        if (this.mainPlayer.currentVideo) {
            this.title.textContent = this.mainPlayer.currentVideo.title;
            this.artist.textContent = this.mainPlayer.currentVideo.owner_name || 'Inconnu';
        }

        // IMPORTANT: Move the actual video element instead of copying
        // This preserves the HLS stream
        const mainVideo = this.mainPlayer.video;
        const videoContainer = this.floatingElement.querySelector('.floating-player-video');

        // Remove the placeholder video element
        if (this.videoElement && this.videoElement.parentNode) {
            this.videoElement.remove();
        }

        // Move the main video element to floating player
        videoContainer.appendChild(mainVideo);
        this.videoElement = mainVideo;

        // Show floating player
        this.floatingElement.classList.remove('hidden');

        // Hide main player overlay
        this.mainPlayer.hideFullPlayer();

        // Update play button
        this.updatePlayButton();

        console.log('🎵 Floating player shown with video element moved');
    }

    expand() {
        // Move video element back to main player
        const mainPlayerContainer = document.querySelector('#fullPlayerOverlay .video-container, #fullPlayerOverlay');
        if (mainPlayerContainer && this.videoElement) {
            mainPlayerContainer.appendChild(this.videoElement);
        }

        // Show full player
        this.mainPlayer.showFullPlayer();

        // Close floating widget
        this.close();
        console.log('🎵 Expanded to full player');
    }

    close() {
        this.floatingElement.classList.add('hidden');
        console.log('🎵 Floating player closed');
    }

    togglePlay() {
        if (this.videoElement.paused) {
            this.videoElement.play();
        } else {
            this.videoElement.pause();
        }

        this.updatePlayButton();
    }

    updatePlayButton() {
        const btn = document.getElementById('floatingPlayPauseBtn');
        const playIcon = btn?.querySelector('.play-icon');
        const pauseIcon = btn?.querySelector('.pause-icon');

        if (this.videoElement.paused) {
            playIcon?.classList.remove('hidden');
            pauseIcon?.classList.add('hidden');
        } else {
            playIcon?.classList.add('hidden');
            pauseIcon?.classList.remove('hidden');
        }
    }

    previous() {
        this.mainPlayer.previous();
        setTimeout(() => this.syncWithMain(), 200);
    }

    next() {
        this.mainPlayer.next();
        setTimeout(() => this.syncWithMain(), 200);
    }

    syncWithMain() {
        if (this.mainPlayer.currentVideo) {
            this.title.textContent = this.mainPlayer.currentVideo.title;
            this.artist.textContent = this.mainPlayer.currentVideo.owner_name || 'Inconnu';
            this.updatePlayButton();
        }
    }

    // Drag & Drop functionality
    dragStart(e) {
        // Only drag from header area
        if (!this.header.contains(e.target) || e.target.closest('.floating-action-btn')) {
            return;
        }

        this.initialX = e.clientX - this.xOffset;
        this.initialY = e.clientY - this.yOffset;
        this.isDragging = true;

        this.header.style.cursor = 'grabbing';
    }

    drag(e) {
        if (this.isDragging) {
            e.preventDefault();

            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY);
        }
    }

    dragEnd() {
        if (this.isDragging) {
            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.isDragging = false;

            this.header.style.cursor = 'move';
        }
    }

    setTranslate(xPos, yPos) {
        this.floatingElement.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}
