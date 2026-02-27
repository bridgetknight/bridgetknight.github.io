document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('footer_container');
    if (!container) return;

    fetch('/footer.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            document.getElementById('footer_email').addEventListener('click', copyEmail);
        })
        .catch(err => console.warn('footer.html failed to load:', err));
});

function copyEmail() {
    const email = 'bridget.g.knight@gmail.com';
    const confirm = document.getElementById('copy_confirm');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            confirm.style.opacity = '1';
            setTimeout(() => confirm.style.opacity = '0', 2000);
        });
    } else {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        confirm.style.opacity = '1';
        setTimeout(() => confirm.style.opacity = '0', 2000);
    }
}