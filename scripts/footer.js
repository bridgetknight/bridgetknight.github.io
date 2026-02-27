document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('footer_container');
    if (!container) return;

    fetch('/footer.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => console.warn('footer.html failed to load:', err));
});

function copyEmail() {
    navigator.clipboard.writeText('bridget.g.knight@gmail.com');
    const confirm = document.getElementById('copy_confirm');
    confirm.style.opacity = '1';
    setTimeout(() => confirm.style.opacity = '0', 2000);
}