function generateRandomBlob() {
    // Generate 8 random values, ensuring variety so no sides are straight
    const values = [];
    for (let i = 0; i < 8; i++) {
        values.push(Math.floor(Math.random() * 40) + 30); // 30-70 range
    }
    
    // Shuffle them so you don't get predictable patterns
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    
    return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    const portrait = document.querySelector('.portrait_image.blob');
    
    if (portrait) {
        setInterval(() => {
            portrait.style.borderRadius = generateRandomBlob();
            portrait.style.transition = 'border-radius 3s linear';
        }, 3000);
    }
});