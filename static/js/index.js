    (() => {
            const intro = document.getElementById("cinematic-intro");
            const video = document.getElementById("intro-video");
            const skipButton = document.getElementById("skip-intro");

            if (!intro || !video || !skipButton) return;

            let finished = false;
            let fallbackTimer;

            function finishIntro() {
                if (finished) return;

                finished = true;
                clearTimeout(fallbackTimer);

                intro.classList.add("intro-hidden");
                video.pause();

                window.setTimeout(() => {
                    intro.remove();
                }, 900);
            }

            skipButton.addEventListener("click", finishIntro);
            video.addEventListener("ended", finishIntro);
            video.addEventListener("error", finishIntro);

            // Automatically reveal the home page after 8 seconds.
            fallbackTimer = window.setTimeout(finishIntro, 8000);

            // If autoplay is blocked, keep the intro visible until
            // the user skips it or the timeout finishes.
            video.play().catch(() => {
                console.log("Autoplay blocked. The intro timeout is still active.");
            });
        })();