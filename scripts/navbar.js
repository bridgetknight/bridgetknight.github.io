document.addEventListener('DOMContentLoaded', () => {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;

            // ── NAME SCATTER ANIMATION ────────────────────────
            const link = document.querySelector('#name a');
            if (!link) return;

            link.addEventListener('mouseenter', () => {
                link.classList.add('scatter-active');
                const letters = link.querySelectorAll('.name-letter');
                letters.forEach((letter, index) => {
                    setTimeout(() => {
                        const yOffset = (index % 2 === 0 ? -8 : 8);
                        const xOffset = (index - letters.length / 2) * 3;
                        const rotation = (index % 2 === 0 ? -5 : 5);
                        letter.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`;
                    }, index * 30);
                });
            });

            link.addEventListener('mouseleave', () => {
                link.classList.remove('scatter-active');
                link.querySelectorAll('.name-letter').forEach((letter, index) => {
                    setTimeout(() => { letter.style.transform = ''; }, index * 50);
                });
            });

            // split name into individual animated letters
            const text = link.textContent.trim();
            link.textContent = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'name-letter';
                span.style.animationDelay = `${i * 0.08}s`;
                link.appendChild(span);
            });

            // ── HAMBURGER MENU ────────────────────────────────
            const hamburger = document.getElementById('hamburger');
            const drawer = document.getElementById('mobile_drawer');
            if (!hamburger || !drawer) return;

            hamburger.addEventListener('click', () => {
                const isOpen = drawer.classList.toggle('open');
                hamburger.classList.toggle('open', isOpen);
            });

            drawer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    drawer.classList.remove('open');
                    hamburger.classList.remove('open');
                });
            });
        })
        .catch(err => console.warn('navbar.html failed to load:', err));
});