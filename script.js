
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
    handleScrollAnimation(); // Initial check    // Select all video container elements
    const videoContainers = {
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

    const players = {};
    const buttons = document.querySelectorAll('.elevator-btn');
    const floorDisplay = document.getElementById('floor-display');
    
    // Track the currently active video container and player
    let currentActiveContainer = videoContainers[1];
    let currentActivePlayer = null;

    // Initialize Vimeo Players
    Object.keys(videoContainers).forEach(floor => {
        const container = videoContainers[floor];
        if (container) {
            const iframe = container.querySelector('iframe');
            if (iframe) {
                const player = new Vimeo.Player(iframe);
                players[floor] = player;

                // Set up timeupdate for progress bar
                player.on('timeupdate', (data) => {
                    if (container === currentActiveContainer && progressBar) {
                        const percentage = data.percent * 100;
                        progressBar.style.width = `${percentage}%`;
                    }
                });

                // If it's the initial video, set as current player
                if (floor == "1") {
                    currentActivePlayer = player;
                }
            }
        }
    });

    // --- Video Controls Logic ---
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentActivePlayer) currentActivePlayer.play();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (currentActivePlayer) currentActivePlayer.pause();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (currentActivePlayer) {
                currentActivePlayer.pause();
                currentActivePlayer.setCurrentTime(0);
            }
        });
    }

    // --- Progress Bar Logic ---
    const progressBar = document.getElementById('video-progress-bar');
    const progressContainer = document.querySelector('.video-progress-container');

    // Seek logic for clicking on progress bar
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (currentActivePlayer) {
                currentActivePlayer.getDuration().then(duration => {
                    const rect = progressContainer.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    currentActivePlayer.setCurrentTime(pos * duration);
                });
            }
        });
    }

    let topZIndex = 10;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const floor = button.getAttribute('data-floor');
            const clickedContainer = videoContainers[floor];
            const clickedPlayer = players[floor];

            // Update display text
            if (floorDisplay) {
                floorDisplay.textContent = `Piso ${floor}`;
            }

            // If container and player exist
            if (clickedContainer && clickedPlayer) {
                // Update active state on buttons immediately for UI feedback
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Identify currently active video
                const previousContainer = currentActiveContainer;
                const previousPlayer = currentActivePlayer;
                
                // Update tracking
                currentActiveContainer = clickedContainer;
                currentActivePlayer = clickedPlayer;

                // Start playing new video
                clickedPlayer.play().catch(e => console.error("Play error:", e));

                // Always bring the NEWEST click to the absolute top using an incrementing counter
                topZIndex++;
                clickedContainer.style.zIndex = topZIndex; 
                clickedContainer.classList.add('active');

                // After transition (matching CSS 0.5s), clean up old video
                setTimeout(() => {
                    // Only pause and hide the old video if it's not the one we just clicked again
                    if (previousContainer && previousContainer !== currentActiveContainer) {
                        previousContainer.classList.remove('active');
                        if (previousPlayer) {
                            previousPlayer.pause();
                            previousPlayer.setCurrentTime(0);
                        }
                        // Important: reset z-index so it doesn't interfere with future ones
                        previousContainer.style.zIndex = '';
                    }
                }, 500); 
            } else {
                console.warn(`No video found for floor ${floor}`);
            }
        });
    });
});
