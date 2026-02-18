// Stars
/*
const stars = [];
const NUM_STARS = 8;

document.addEventListener('mousemove', (e) => {
    const star = document.createElement("div");
    star.className = "cursor-star";
    star.style.left = `${e.clientX}px`;
    star.style.top = `${e.clientY}px`;  
    star.style.setProperty('--rotation', `${Math.random() * 360}deg`);
    star.style.setProperty('--scale', `${0.5 + Math.random() * 0.8}`);
    document.body.appendChild(star);

    setTimeout(() => star.remove(), 800);
});
*/

// Orb
document.addEventListener('DOMContentLoaded', () => {
    const orb = document.createElement('div');
    orb.className = 'cursor-orb';
    document.body.appendChild(orb);

    let mouseX = 0, mouseY = 0;
    let orbX = 0, orbY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateOrb() {
        orbX += (mouseX - orbX) * 0.08; // 0.08 = lag amount, lower = more lag
        orbY += (mouseY - orbY) * 0.08;
        orb.style.transform = `translate(${orbX}px, ${orbY}px)`;
        requestAnimationFrame(animateOrb);
    }
    animateOrb();
});