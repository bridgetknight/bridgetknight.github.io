document.addEventListener('DOMContentLoaded', () => {

    // ── PROJECT CARD SCROLL ──────────────────────────────
    document.querySelectorAll('.project_card').forEach(card => {
        card.addEventListener('click', () => {
            const rect = card.getBoundingClientRect();
            const scrollTop = document.documentElement.scrollTop;
            window.scrollTo({ top: rect.top + scrollTop - 30, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.project_card a').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });

    // prevent links inside cards from toggling the card
    document.querySelectorAll('.project_card a').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });

    // ── IMAGE LIGHTBOX ────────────────────────────────────────────
    const lightbox = document.createElement('div');
    lightbox.className = 'img_lightbox_overlay';
    lightbox.innerHTML = '<img src="" alt="">';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');

    document.querySelectorAll('.card_img_zoom').forEach(img => {
        img.addEventListener('click', e => {
            e.stopPropagation(); // don't trigger card toggle
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', () => lightbox.classList.remove('active'));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    // ── VIDEO CLICK (prevent card toggle, allow play/pause) ───────
    document.querySelectorAll('.project_video video').forEach(video => {
        video.addEventListener('click', e => {
            e.stopPropagation();
            video.paused ? video.play() : video.pause();
        });
    });

    // ── BACK TO TOP ───────────────────────────────────────────────
    window.addEventListener('scroll', () => {
        const backToTop = document.querySelector('.back_to_top');
        if (!backToTop) return;
        const scrollLimit = window.innerWidth < 768 ? 1000 : 500;
        backToTop.classList.toggle('visible', window.scrollY > scrollLimit);
    });

});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}