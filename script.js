
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
    handleScrollAnimation(); // Initial check

    // Select all video elements
    const videos = {
        1: document.getElementById('video-1'),
        2: document.getElementById('video-2'),
        3: document.getElementById('video-3'),
        4: document.getElementById('video-4'),
        5: document.getElementById('video-5'),
        6: document.getElementById('video-6')
    };

    const buttons = document.querySelectorAll('.elevator-btn');
    const floorDisplay = document.getElementById('floor-display');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const floor = button.getAttribute('data-floor');
            const clickedVideo = videos[floor];

            // Update display text
            if (floorDisplay) {
                floorDisplay.textContent = `Piso ${floor}`;
            }

            // If video element exists (some might be missing like floor 3)
            if (clickedVideo) {
                // Update active state on buttons immediately for UI feedback
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Identify currently active video(s)
                const previousActive = Object.values(videos).find(v => v && v.classList.contains('active') && v !== clickedVideo);

                // Start playing new video
                clickedVideo.play().catch(e => console.error("Play error:", e));

                // Bring new video to top and fade in
                clickedVideo.style.zIndex = '10'; // Ensure it's on top during transition
                clickedVideo.classList.add('active');

                // After transition (matching CSS 0.5s), clean up old video
                setTimeout(() => {
                    if (previousActive) {
                        previousActive.classList.remove('active');
                        previousActive.pause();
                        previousActive.currentTime = 0;
                        previousActive.style.zIndex = ''; // Reset inline z-index
                    }
                    clickedVideo.style.zIndex = ''; // Reset inline z-index (relies on CSS class now)
                }, 500); // 500ms matches CSS transition time
            } else {
                console.warn(`No video found for floor ${floor}`);
            }
        });
    });
});
