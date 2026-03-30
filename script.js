
document.addEventListener('DOMContentLoaded', () => {
    // --- Date & Time Display ---
    const datetimeEl = document.getElementById('datetime-display');
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const fecha = now.toLocaleDateString('es-MX', options);
        const hora = now.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        if (datetimeEl) datetimeEl.textContent = `${fecha}  ·  ${hora}`;
    }
    if (datetimeEl) {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    // --- Text Scroll Animation (Soñamos...) ---
    const sonamosText = document.querySelector('.text-sonamos');

    function handleScrollAnimation() {
        if (!sonamosText) return;

        const rect = sonamosText.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;

        // Calculate distance from center (start effect when element enters viewport)
        // We want it to be fully visible when it reaches the center (or slightly before/after)
        // And faded/blurred when it enters from bottom.

        // Only animate if it's in the viewport or approaching
        if (rect.top < windowHeight + 50) {

            // Modified: Start immediately at bottom, end well below center to be faster
            const startPoint = windowHeight;
            const endPoint = windowHeight * 0.55;

            // Use rect.top for immediate entry effect
            let progress = (startPoint - rect.top) / (startPoint - endPoint);

            // Clamp progress between 0 and 1
            progress = Math.min(Math.max(progress, 0), 1);

            // Apply styles
            // Opacity: 0 to 1
            sonamosText.style.opacity = progress;

            // Blur: 10px to 0px
            const blurAmount = (1 - progress) * 10;
            sonamosText.style.filter = `blur(${blurAmount}px)`;

            // Parallax Y: Start 100px lower, end at 0
            const translateY = (1 - progress) * 100;
            // Maintain base transform: translateX(-50%) scaleX(1.09)
            sonamosText.style.transform = `translateX(-50%) scaleX(1.09) translateY(${translateY}px)`;
        }
    }

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check    // Select all video elements or Vimeo containers
    const rawElements = {
        1: document.getElementById('video-1'),
        2: document.getElementById('video-2'),
        3: document.getElementById('video-3'),
        4: document.getElementById('video-4'),
        5: document.getElementById('video-5'),
        6: document.getElementById('video-6'),
        7: document.getElementById('video-7'),
        8: document.getElementById('video-8'),
        9: document.getElementById('video-9'),
        10: document.getElementById('video-10'),
        11: document.getElementById('video-11')
    };

    const videos = {};
    const progressBar = document.getElementById('video-progress-bar');
    const progressContainer = document.querySelector('.video-progress-container');

    // --- Unified Video Wrapper ---
    class VideoWrapper {
        constructor(el, id) {
            this.el = el;
            this.id = id;
            this.isVimeo = el && el.tagName !== 'VIDEO';
            this.vimeoPlayer = null;
            this.nativeVideo = this.isVimeo ? null : el;

            if (this.isVimeo && typeof Vimeo !== 'undefined') {
                const vId = el.getAttribute('data-vimeo-id');
                this.vimeoPlayer = new Vimeo.Player(el, {
                    id: vId,
                    autoplay: false,
                    controls: false,
                    responsive: true,
                    muted: false
                });

                // Progress for Vimeo
                this.vimeoPlayer.on('timeupdate', (data) => {
                    if (this === currentActiveVideo && progressBar) {
                        const percentage = (data.seconds / data.duration) * 100;
                        progressBar.style.width = `${percentage}%`;
                    }
                });
            } else if (this.nativeVideo) {
                // Progress for Native
                this.nativeVideo.addEventListener('timeupdate', () => {
                    if (this === currentActiveVideo && progressBar && this.nativeVideo.duration) {
                        const percentage = (this.nativeVideo.currentTime / this.nativeVideo.duration) * 100;
                        progressBar.style.width = `${percentage}%`;
                    }
                });
            }
        }

        play() {
            if (this.isVimeo) return this.vimeoPlayer.play().catch(e => console.error("Vimeo Play Error:", e));
            return this.nativeVideo.play().catch(e => console.error("Native Play Error:", e));
        }

        pause() {
            if (this.isVimeo) return this.vimeoPlayer.pause();
            return this.nativeVideo.pause();
        }

        stop() {
            if (this.isVimeo) {
                this.vimeoPlayer.pause();
                this.vimeoPlayer.setCurrentTime(0);
            } else if (this.nativeVideo) {
                this.nativeVideo.pause();
                this.nativeVideo.currentTime = 0;
            }
        }

        seek(pos) {
            if (this.isVimeo) {
                this.vimeoPlayer.getDuration().then(duration => {
                    this.vimeoPlayer.setCurrentTime(pos * duration);
                });
            } else if (this.nativeVideo && this.nativeVideo.duration) {
                this.nativeVideo.currentTime = pos * this.nativeVideo.duration;
            }
        }

        get style() { return this.el.style; }
        get classList() { return this.el.classList; }
    }

    // Initialize wrappers
    Object.keys(rawElements).forEach(key => {
        if (rawElements[key]) {
            videos[key] = new VideoWrapper(rawElements[key], key);
        }
    });

    const buttons = document.querySelectorAll('.elevator-btn');
    const floorDisplay = document.getElementById('floor-display');
    
    // Track the currently active video to control it
    let currentActiveVideo = videos[1];

    // --- Video Controls Logic ---
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentActiveVideo) currentActiveVideo.play();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (currentActiveVideo) currentActiveVideo.pause();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (currentActiveVideo) currentActiveVideo.stop();
        });
    }

    // Seek logic for clicking on progress bar
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (currentActiveVideo) {
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                currentActiveVideo.seek(pos);
            }
        });
    }

    let topZIndex = 10;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const floor = button.getAttribute('data-floor');
            const clickedVideo = videos[floor];

            // Update display text
            if (floorDisplay) {
                floorDisplay.textContent = `Piso ${floor}`;
            }

            // If video element exists
            if (clickedVideo) {
                // Update active state on buttons immediately for UI feedback
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Identify currently active video
                const previousActive = currentActiveVideo;
                
                // Update modern active tracking
                currentActiveVideo = clickedVideo;

                // Start playing new video
                clickedVideo.play();

                // Always bring the NEWEST click to the absolute top using an incrementing counter
                topZIndex++;
                clickedVideo.style.zIndex = topZIndex; 
                clickedVideo.classList.add('active');

                // After transition (matching CSS 0.5s), clean up old video
                setTimeout(() => {
                    // Only pause and hide the old video if it's not the one we just clicked again
                    if (previousActive && previousActive !== currentActiveVideo) {
                        previousActive.classList.remove('active');
                        previousActive.stop();
                        // Important: reset z-index so it doesn't interfere with future ones
                        previousActive.style.zIndex = '';
                    }
                }, 500); 
            } else {
                console.warn(`No video found for floor ${floor}`);
            }
        });
    });
});
