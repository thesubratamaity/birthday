// --- 1. BACKGROUND PARTICLE SYSTEM (Vanilla JS Canvas) ---
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = Math.random() > 0.5 ? '#d4af37' : '#b76e79'; // Gold or Rose Gold
                this.alpha = Math.random();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.alpha > 0.01) this.alpha -= 0.002; // Fade out
                if (this.alpha <= 0.01 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.alpha = 1;
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();

        // --- 2. INTRO ANIMATION (Typing + Auto-Nav) ---
        const textToType = "Happy Birthday Sunshine 🎉✨";
        const typeTarget = document.getElementById('typing-target');
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < textToType.length) {
                // Handle emoji correctly by checking surrogate pairs (basic check)
                let char = textToType.charAt(charIndex);
                typeTarget.innerHTML += char;
                charIndex++;
                setTimeout(typeWriter, 100); // Typing Speed
            } else {
                // Typing finished, show quote
                revealQuote();
            }
        }

        function revealQuote() {
            gsap.to('.cursor', { opacity: 0, display: 'none' });
            gsap.to('.quote-container', {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power2.out',
                onComplete: startPageTransition
            });
        }

        function startPageTransition() {
            // Wait 2 seconds after quote appears, then transition
            setTimeout(() => {
                const tl = gsap.timeline();

                // Slide up Intro
                tl.to('#intro-screen', {
                    yPercent: -100,
                    duration: 1.5,
                    ease: "power4.inOut"
                })
                // Reveal Main Content
                .to('#main-content', {
                    autoAlpha: 1, // handles opacity + visibility
                    duration: 1,
                    ease: "power2.out",
                    // MOVED INITIALIZATION HERE TO ENSURE LAYOUT IS READY
                    onComplete: () => {
                        initGalleryAnimations();
                        createFloatingHearts();
                        ScrollTrigger.refresh(); // Force recalculation of positions
                    }
                }, "-=0.5"); // Overlap slightly
                
            }, 3000); // 3 seconds reading time
        }

        // Start typing on load
        window.onload = () => {
            setTimeout(typeWriter, 1000); // Small delay before start
        };

        // --- 3. AUDIO PLAYER LOGIC ---
        let currentAudio = null;
        let currentBtn = null;

        function playAudio(id, card) {
            const audio = document.getElementById(id);
            const icon = card.querySelector('.play-icon');
 
            // If clicking the same playing song -> Pause
            if (currentAudio === audio && !audio.paused) {
                audio.pause();
                card.classList.remove('playing');
                icon.classList.remove('fa-pause'); P
                icon.classList.add('fa-play');
                currentAudio = null;
                return;
            }

            // Stop currently playing song if exists
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentBtn) {
                    currentBtn.classList.remove('playing');
                    currentBtn.querySelector('.play-icon').classList.remove('fa-pause');
                    currentBtn.querySelector('.play-icon').classList.add('fa-play');
                }
            }

            // Play new song
            audio.play();
            card.classList.add('playing');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            
            currentAudio = audio;
            currentBtn = card;

            // Reset when song ends
            audio.onended = () => {
                card.classList.remove('playing');
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                currentAudio = null;
            };
        }

        // --- 4. GALLERY GSAP ANIMATIONS ---
        gsap.registerPlugin(ScrollTrigger);

        function initGalleryAnimations() {
            // Images sliding from Left
            gsap.utils.toArray('.left-entry').forEach(item => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    x: -100,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out"
                });
            });

            // Images sliding from Right
            gsap.utils.toArray('.right-entry').forEach(item => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    x: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out"
                });
            });

            // Images Scaling Up
            gsap.utils.toArray('.scale-entry').forEach(item => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    scale: 0.8,
                    opacity: 0,
                    duration: 1.2,
                    ease: "back.out(1.7)"
                });
            });
        }

        // --- 5. FLOATING HEARTS EFFECT ---
        function createFloatingHearts() {
            const container = document.body;
            setInterval(() => {
                const heart = document.createElement('div');
                heart.classList.add('floating-heart');
                heart.innerHTML = '❤️';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = Math.random() * 3 + 7 + 's'; // 7-10s
                heart.style.opacity = Math.random();
                heart.style.fontSize = Math.random() * 20 + 10 + 'px';
                
                container.appendChild(heart);

                // Cleanup
                setTimeout(() => {
                    heart.remove();
                }, 10000);
            }, 800);
        }