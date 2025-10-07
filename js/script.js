document.addEventListener('DOMContentLoaded', () => {
    // ============== TYPING ANIMATION ==============
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const phrases = ["Python Developer", "Problem Solver", "Linux Enthusiast", "Cloud Practitioner", "Aspiring Data Scientist"];
        let phraseIndex = 0, letterIndex = 0, currentPhrase = '', isDeleting = false;
        
        function type() {
            const fullPhrase = phrases[phraseIndex];
            if (isDeleting) letterIndex--;
            else letterIndex++;
            currentPhrase = fullPhrase.substring(0, letterIndex);
            typingElement.textContent = currentPhrase;
            let typeSpeed = 150;
            if (isDeleting) typeSpeed /= 2;
            if (!isDeleting && letterIndex === fullPhrase.length) {
                typeSpeed = 2000; isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // ============== SCROLL-BASED VISIBILITY (HEADER & ICON) ==============
    const header = document.querySelector('.main-header');
    const scrollIndicator = document.querySelector('.scroll-down-indicator');
    
    window.addEventListener('scroll', () => {
        // Use a small scroll threshold to trigger visibility changes
        if (window.scrollY > 50) {
            if(header) header.classList.add('visible');
            if (scrollIndicator) scrollIndicator.classList.add('hidden');
        } else {
            if(header) header.classList.remove('visible');
            if (scrollIndicator) scrollIndicator.classList.remove('hidden');
        }
    }, { passive: true });


    // ============== REPLAYABLE SECTION FADE-IN ANIMATION ==============
    const allSections = document.querySelectorAll('.content-section');
    const sectionVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // This makes the animation replayable when scrolling back and forth
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    allSections.forEach(section => sectionVisibilityObserver.observe(section));
    
    // ============== ACTIVE NAV LINK HIGHLIGHTING ==============
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    allSections.forEach(section => navObserver.observe(section));


    // ============== CUSTOM CURSOR ORB ==============
    const cursorOrb = document.querySelector('.cursor-orb');
    let mouseX = 0, mouseY = 0;
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorOrb.style.left = `${mouseX}px`;
            cursorOrb.style.top = `${mouseY}px`;
        });
    } else {
        if(cursorOrb) cursorOrb.style.display = 'none';
    }
    
    // ============== CARD 3D & GLOW EFFECTS ==============
    function applyCardHoverEffect(cards, isTiltable) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                if (isTiltable) {
                    const centerX = rect.width / 2, centerY = rect.height / 2;
                    const rotateY = (x - centerX) / centerX * 10;
                    const rotateX = -((y - centerY) / centerY) * 10;
                    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
                }
            });
            card.addEventListener('mouseleave', () => {
                if (isTiltable) {
                    card.style.transform = 'rotateY(0) rotateX(0) scale(1)';
                }
            });
        });
    }
    applyCardHoverEffect(document.querySelectorAll('.project-card'), true);
    applyCardHoverEffect(document.querySelectorAll('.skill-category-card'), false);
    
    // ============== INTERACTIVE MATRIX BACKGROUND ==============
    const canvas = document.getElementById('matrix-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const alphabet = 'アァカサタナハマヤャラワガザダバパイキシチニヒミリヰギジビピウクスツヌフムユルグズブプエケセテネヘメレヱゲゼデベペオコトノホモヨロヲゴゾドボポヴッン01';
        const fontSize = 16, columns = Math.ceil(canvas.width / fontSize);
        const rainDrops = Array(columns).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < rainDrops.length; i++) {
                const x = i * fontSize, y = rainDrops[i] * fontSize;
                const dx = x - mouseX, dy = y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) { ctx.fillStyle = '#ffffff'; ctx.font = `${fontSize + 2}px monospace`; } 
                else { ctx.fillStyle = '#00e5ff'; ctx.font = `${fontSize}px monospace`; }
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, x, y);
                if (y > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
                rainDrops[i]++;
            }
        };
        setInterval(draw, 33);
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    }
});
