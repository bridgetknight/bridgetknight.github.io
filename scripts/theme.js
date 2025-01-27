const checkbox = document.getElementById("mode_checkbox");

checkbox.addEventListener("change", () => {
    const theme = checkbox.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    updateGithubIcons();

    localStorage.setItem("theme", theme);
});

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    checkbox.checked = savedTheme === "dark";
});

function updateGithubIcons() {
    const theme = document.documentElement.getAttribute("data-theme");
    const githubIcons = document.querySelectorAll(".github_icon");
    
    githubIcons.forEach((icon) => {
        if (theme === "dark") {
            icon.src = "assets/github-mark-dark-mode.svg";
        } else {
            icon.src = "assets/github-mark.svg";
        }
    });
}