// ─────────────────────────────────────────────────────────────
//  gallery.js
//  Shared rendering logic for all gallery and portfolio pages.
//
//  Public API:
//    renderGallery(containerId, tag, options)
//    renderFeatured(containerId)
//    renderMainGallery(containerId)
//    renderProjectClusters(containerId, clusters)
// ─────────────────────────────────────────────────────────────

const GALLERY_DATA_PATH = '/scripts/artwork_directory.json';

// ── Data fetching ─────────────────────────────────────────────

let _cache = null;

async function loadData() {
    if (_cache) return _cache;
    const res = await fetch(GALLERY_DATA_PATH);
    _cache = await res.json();
    return _cache;
}

async function loadPieces(tag) {
    const data = await loadData();
    if (!tag) return data.pieces;
    return data.pieces.filter(p => p.tags && p.tags.includes(tag));
}

async function getFeatured() {
    const data = await loadData();
    return data.featured.map(id => data.pieces.find(p => p.id === id)).filter(Boolean);
}

async function getMainGallery() {
    const data = await loadData();
    return data.main_gallery.map(entry => {
        const piece = data.pieces.find(p => p.id === entry.id);
        return piece ? { ...piece, ...entry } : null;
    }).filter(Boolean);
}


// ── Image path helper ─────────────────────────────────────────

function imgPath(piece) {
    return `/assets/${piece.folder}/${piece.file}`;
}


// ── Lightbox ──────────────────────────────────────────────────

function openLightbox(items, startIndex) {
    let index = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'gallery_lightbox_overlay active';
    overlay.innerHTML = `
        <span class="gallery_lightbox_arrow left">&#8592;</span>
        <div class="gallery_lightbox_container">
            <span class="gallery_lightbox_close">&times;</span>
            <img src="" alt="">
            <figcaption></figcaption>
        </div>
        <span class="gallery_lightbox_arrow right">&#8594;</span>
    `;
    document.body.appendChild(overlay);

    const img     = overlay.querySelector('img');
    const caption = overlay.querySelector('figcaption');

    function loadImage(i) {
        const item = items[i];
        img.classList.add('fading');
        setTimeout(() => {
            img.src = imgPath(item);
            img.alt = item.title;
            caption.textContent = `${item.title}${item.tools ? ' — ' + item.tools : ''} · ${item.year}`;
            img.onload = () => img.classList.remove('fading');
        }, 250);
    }

    function closeOverlay() {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
    }

    overlay.addEventListener('click', e => {
        if (!e.target.closest('.gallery_lightbox_container') &&
            !e.target.closest('.gallery_lightbox_arrow')) closeOverlay();
    });

    overlay.querySelector('.gallery_lightbox_arrow.left').addEventListener('click', e => {
        e.stopPropagation();
        index = (index - 1 + items.length) % items.length;
        loadImage(index);
    });

    overlay.querySelector('.gallery_lightbox_arrow.right').addEventListener('click', e => {
        e.stopPropagation();
        index = (index + 1) % items.length;
        loadImage(index);
    });

    overlay.querySelector('.gallery_lightbox_close').addEventListener('click', e => {
        e.stopPropagation();
        closeOverlay();
    });

    function onKey(e) {
        if      (e.key === 'ArrowRight') { index = (index + 1) % items.length; loadImage(index); }
        else if (e.key === 'ArrowLeft')  { index = (index - 1 + items.length) % items.length; loadImage(index); }
        else if (e.key === 'Escape')     { closeOverlay(); }
    }
    document.addEventListener('keydown', onKey);

    loadImage(index);
}


// ── Figure builder ────────────────────────────────────────────
//  Used by all render functions.
//  Pieces with project_page navigate there on click.
//  All others open the lightbox.

function buildFigure(piece, index, items, options = {}) {
    const fig = document.createElement('figure');
    fig.className = 'gallery_item';
    fig.style.setProperty('--i', index);

    const img = document.createElement('img');
    img.src     = imgPath(piece);
    img.alt     = piece.title;
    img.loading = 'lazy';

    const caption = document.createElement('figcaption');
    caption.innerHTML = `
        <span>${piece.title}</span>
        <span>${piece.year}</span>
    `;

    if (piece.wip) {
        const badge = document.createElement('span');
        badge.className = 'wip_badge';
        badge.textContent = 'in progress';
        caption.appendChild(badge);
    }

    fig.appendChild(img);
    fig.appendChild(caption);

    if (piece.project_page) {
        fig.classList.add('has_project');
        const indicator = document.createElement('a');
        indicator.className = 'project_indicator';
        indicator.textContent = 'view project →';
        indicator.href = piece.project_page;
        indicator.addEventListener('click', e => e.stopPropagation());
        fig.appendChild(indicator);
    }

    fig.addEventListener('click', () => {
        if (options.navigateToProject && piece.project_page) {
            window.location.href = piece.project_page;
        } else {
            openLightbox(items, index);
        }
    });

    return fig;
}


// ── renderGallery ─────────────────────────────────────────────
//  Renders a flat masonry gallery filtered by tag.
//  Used by: illustrations.html, sketches.html, concept_art.html,
//           graphic_design.html, technical_art.html
//
//  options.columns — CSS column-count override (default 2)

async function renderGallery(containerId, tag, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pieces = await loadPieces(tag);
    if (!pieces.length) return;

    // Determine number of columns (option override, otherwise try to
    // read any CSS `column-count` on the container, fallback to 2)
    let columns = options.columns || 0;
    if (!columns) {
        const cs = getComputedStyle(container).columnCount;
        const parsed = parseInt(cs, 10);
        columns = Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
    }

    // Clear container and create explicit column wrappers so we can
    // control ordering (row-major) rather than the vertical flow of
    // CSS multi-column layout.
    container.innerHTML = '';
    container.classList.add('masonry_columns');

    const cols = [];
    for (let c = 0; c < columns; c++) {
        const col = document.createElement('div');
        col.className = 'masonry_column';
        container.appendChild(col);
        cols.push(col);
    }

    // Distribute items round-robin across columns to achieve
    // left-to-right (row-major) ordering.
    pieces.forEach((piece, i) => {
        const target = i % columns;
        cols[target].appendChild(buildFigure(piece, i, pieces));
    });
}


// ── renderFeatured ────────────────────────────────────────────
//  Renders the 6 homepage thumbnail grid.
//  Used by: index.html

async function renderFeatured(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pieces = await getFeatured();

    pieces.forEach((piece, i) => {
        const fig = buildFigure(piece, i, pieces);
        fig.className += ' featured_item';
        container.appendChild(fig);
    });
}


// ── renderMainGallery ─────────────────────────────────────────
//  Renders the homepage hero grid with focus/zoom overrides.
//  Used by: index.html (the 6-up cropped hero thumbnails)

async function renderMainGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = await getMainGallery();

    items.forEach((item, i) => {
        const fig = buildFigure(item, i, items);

        // Apply focus and zoom from main_gallery overrides
        const img = fig.querySelector('img');
        if (item.focus) img.style.objectPosition = item.focus;
        if (item.zoom)  img.style.transform       = `scale(${item.zoom})`;

        container.appendChild(fig);
    });
}


// ── renderProjectClusters ─────────────────────────────────────
//  Renders the portfolio.html page with named clusters.
//  Pass an array of cluster definitions:
//
//  [
//    {
//      heading: "Salt Marsh Conservation Poster",
//      ids: ["mass-audubon-poster"],
//      note: "Science communication poster for Mass Audubon"
//    },
//    {
//      heading: "Personal & Commercial Work",
//      ids: ["combat-sloth", "countdown-touchdown", ...]
//      columns: 2
//    }
//  ]
//
//  Clusters without a heading just render as a grid.
//  Used by: portfolio.html, technical_art.html

async function renderProjectClusters(containerId, clusters, options={}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await loadData();

    for (const cluster of clusters) {

        // Section label — must come before the section
        if (cluster.section_label) {
            const label = document.createElement('p');
            label.className = 'section_label';
            label.textContent = cluster.section_label;
            if (cluster.id) label.id = cluster.id;
            container.appendChild(label);
        }

        const section = document.createElement('section');
        section.className = 'portfolio_section';

        if (cluster.heading) {
            const headingRow = document.createElement('div');
            headingRow.className = 'category_heading_row';
            const h = document.createElement('h2');
            h.className = 'portfolio_category_heading';
            h.textContent = cluster.heading;
            headingRow.appendChild(h);
            section.appendChild(headingRow);
        }

        if (cluster.note) {
            const note = document.createElement('p');
            note.className = 'cluster_note';
            note.textContent = cluster.note;
            section.appendChild(note);
        }

        const grid = document.createElement('div');
        grid.className = 'masonry_gallery masonry_columns';
        if (cluster.columns) grid.style.columnCount = cluster.columns;

        const pieces = cluster.ids
            .map(id => data.pieces.find(p => p.id === id))
            .filter(Boolean);

        // Determine columns
        let columns = cluster.columns || 2;

        // Create column wrappers
        const cols = [];
        for (let c = 0; c < columns; c++) {
            const col = document.createElement('div');
            col.className = 'masonry_column';
            grid.appendChild(col);
            cols.push(col);
        }

        // Single render — row-major distribution across columns
        pieces.forEach((piece, i) => {
            const target = i % columns;
            cols[target].appendChild(buildFigure(piece, i, pieces, options));
        });

        section.appendChild(grid);
        container.appendChild(section);
    }
}