class Gallery {
    constructor(containerId, galleryName) {
        this.container = document.getElementById(containerId);
        this.galleryName = galleryName;
    }

    async load() {
        const res = await fetch("scripts/artwork_directory.json");
        console.log("Fetch status:", res.status);
    
        const data = await res.json();
        console.log("JSON data:", data);
    
        const artworks = data[this.galleryName];
        console.log("Artworks:", artworks);
    
        if (!artworks) return;
    
        artworks.forEach(art => this.addImage(art));
    }

    addImage(art) {
        const figure = document.createElement("figure");
        figure.classList.add("gallery_item");
    
        const img = document.createElement("img");
        img.src = `/assets/${this.galleryName}/${art.file}`;
        img.alt = art.title;
    
        const caption = document.createElement("figcaption");
        caption.innerHTML = `<span>${art.title}</span>`;
    
        figure.appendChild(img);
        figure.appendChild(caption);
        this.container.appendChild(figure);
    }
}

function setupGalleryLightbox() {
    const galleryImages = document.querySelectorAll(".gallery_item img");
    if (!galleryImages.length) return;

    // Overlay
    const overlay = document.createElement("div");
    overlay.classList.add("gallery_lightbox_overlay");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 9999;
    overlay.style.overflow = "hidden";
    overlay.style.opacity = 0;
    overlay.style.transition = "opacity 0.3s ease";

    document.body.appendChild(overlay);

    // Container for sliding images
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "90%";
    container.style.height = "80%";
    overlay.appendChild(container);

    // Controls
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "20px";
    closeBtn.style.right = "30px";
    closeBtn.style.fontSize = "2rem";
    closeBtn.style.color = "#fff";
    closeBtn.style.cursor = "pointer";
    overlay.appendChild(closeBtn);

    const leftArrow = document.createElement("span");
    leftArrow.innerHTML = "&#10094;";
    leftArrow.style.position = "absolute";
    leftArrow.style.left = "20px";
    leftArrow.style.top = "50%";
    leftArrow.style.transform = "translateY(-50%)";
    leftArrow.style.fontSize = "3rem";
    leftArrow.style.color = "#fff";
    leftArrow.style.cursor = "pointer";
    overlay.appendChild(leftArrow);

    const rightArrow = document.createElement("span");
    rightArrow.innerHTML = "&#10095;";
    rightArrow.style.position = "absolute";
    rightArrow.style.right = "20px";
    rightArrow.style.top = "50%";
    rightArrow.style.transform = "translateY(-50%)";
    rightArrow.style.fontSize = "3rem";
    rightArrow.style.color = "#fff";
    rightArrow.style.cursor = "pointer";
    overlay.appendChild(rightArrow);

    let currentIndex = 0;
    let currentImg = null;

    function showImage(index, direction = null) {
        if (currentImg) {
            // slide old image out
            const oldImg = currentImg;
            oldImg.style.transition = "all 0.4s ease";
            oldImg.style.transform =
                direction === "left" ? "translateX(-150%) translateY(-50%)" : "translateX(150%) translateY(-50%)";
            oldImg.style.opacity = "0";
            oldImg.addEventListener(
                "transitionend",
                () => {
                    if (oldImg.parentNode) oldImg.parentNode.removeChild(oldImg);
                },
                { once: true }
            );
        }

        // Create new image
        const newImg = document.createElement("img");
        newImg.src = galleryImages[index].src;
        newImg.alt = galleryImages[index].alt;
        newImg.style.position = "absolute";
        newImg.style.top = "50%";
        newImg.style.left = "50%";
        newImg.style.transform =
            direction === "left" ? "translateX(150%) translateY(-50%)" : direction === "right" ? "translateX(-150%) translateY(-50%)" : "translate(-50%, -50%)";
        newImg.style.maxWidth = "100%";
        newImg.style.maxHeight = "100%";
        newImg.style.transition = "all 0.4s ease";
        newImg.style.opacity = "0";

        container.appendChild(newImg);

        // force layout then transition in
        requestAnimationFrame(() => {
            newImg.style.transform = "translate(-50%, -50%)";
            newImg.style.opacity = "1";
        });

        currentImg = newImg;
        currentIndex = index;
    }

    function openLightbox(index) {
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        showImage(index);
    }

    function closeLightbox() {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        if (currentImg && currentImg.parentNode) {
            currentImg.parentNode.removeChild(currentImg);
            currentImg = null;
        }
    }

    function nextImage() {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        showImage(nextIndex, "left");
    }

    function prevImage() {
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(prevIndex, "right");
    }

    galleryImages.forEach((img, i) => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => openLightbox(i));
    });

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLightbox();
    });
    rightArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        nextImage();
    });
    leftArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        prevImage();
    });

    document.addEventListener("keydown", (e) => {
        if (overlay.style.opacity !== "1") return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });
}
