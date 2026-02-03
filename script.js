document.addEventListener('DOMContentLoaded', () => {
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
