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