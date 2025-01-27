document.addEventListener('DOMContentLoaded', () => { 
    document.querySelectorAll(".project_card").forEach(card => {
        card.addEventListener("click", () => {
            const content = card.querySelector(".project_content");
            const isActive = content.classList.contains("active");
            content.classList.toggle("active");

            // Scroll to the top of the card if not open
            if (!isActive) {
                setTimeout(() => {
                    const title = card.querySelector(".project_title");
                    
                    // Calculate the offset of the title relative to the viewport
                    const rect = title.getBoundingClientRect();
                    const scrollTop = document.documentElement.scrollTop;

                    // Adjust scrolling to be 30px above the title
                    const offset = 30;
                    const targetScrollPosition = rect.top + scrollTop - offset;

                    window.scrollTo({
                        top: targetScrollPosition,
                        behavior: "smooth"
                    });
                }, 350); 
            }
        });
    });
});

// Prevent click bubbling when trying to play videos
document.querySelectorAll(".project_video video").forEach((video) => {
    video.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from bubbling up
        // Allow the video to be played or paused by clicking anywhere on it
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});

// Prevent click bubbling for the repo_link div
document.querySelectorAll(".repo_link").forEach((linkDiv) => {
    linkDiv.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from bubbling up
        // Let the link's default behavior proceed
    });
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if the screen is mobile or desktop
function checkMobileOrNot() {
    return window.innerWidth < 768;
}

// Don't show Back to Top at top of page
window.addEventListener("scroll", () => {
    const backToTop = document.querySelector(".back_to_top");
    const scrollLimit = checkMobileOrNot() ? 1000 : 500;

    backToTop.style.display = window.scrollY > scrollLimit ? "block" : "none";
});