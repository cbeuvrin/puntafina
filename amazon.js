
document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, title: "Coyote VIP", cover: "CATALOGO AMAZON MX/1-1 COYOTE VIP/COYOTE VIP-PortadaHRZ.jpg", bg: "CATALOGO AMAZON MX/1-1 COYOTE VIP/Fondo/PF CATALOGO 2026_PremiumPlace COMPO V1 (COYOTE VIP).jpg", sectionId: "product-1" },
        { id: 2, title: "Doble Cara", cover: "CATALOGO AMAZON MX/1-2 DOBLE CARA/DOBLE CARA-PortadaHRZ.jpg", bg: "CATALOGO AMAZON MX/1-2 DOBLE CARA/PF CATALOGO 2026_DOBLE CARA.jpg", sectionId: "product-2" },
        { id: 3, title: "Tin Tan", cover: "CATALOGO AMAZON MX/1-3 TIN TAN/TIN TAN Portada HRZ- No Package.jpg", bg: "CATALOGO AMAZON MX/1-3 TIN TAN/pf-cat00-Tin Tan NoPackage.jpg", sectionId: "product-3" },
        { id: 4, title: "Tepito Witon", cover: "CATALOGO AMAZON MX/1-4 TEPITO WITON/TEPITO WITON Portada HRZ.jpg", bg: "CATALOGO AMAZON MX/1-4 TEPITO WITON/pf-cat00-Tepito witon.jpg", sectionId: "product-4" },
        { id: 5, title: "Fiesta Finn", cover: "CATALOGO AMAZON MX/1-5 FIESTA FINN/FIESTA FINN Portada HRZ.jpg", bg: "CATALOGO AMAZON MX/1-5 FIESTA FINN/pf-cat00-fiestafinn.jpg", sectionId: "product-5" },
        { id: 6, title: "Diario de un Canalla", cover: "CATALOGO AMAZON MX/1-6 DIARIO DE UN CANALLA/Diario de un canalla Portada HRZ.jpg", bg: "CATALOGO AMAZON MX/1-6 DIARIO DE UN CANALLA/pf-cat00-diariodeuncanalla.jpg", sectionId: "product-6" },
        { id: 7, title: "Volverte a Ver", cover: "CATALOGO AMAZON MX/1-7 VOLVERTE A VER/Volverte a ver Portada HRZ.jpg", bg: "CATALOGO AMAZON MX/1-7 VOLVERTE A VER/pf-cat00-volverteaver.jpg", sectionId: "product-7" },
        { id: 8, title: "Tu Mejor Error", cover: "CATALOGO AMAZON MX/1-8 TU MEJOR ERROR/Tu mejor error Portada HRZ.png", bg: "CATALOGO AMAZON MX/1-8 TU MEJOR ERROR/pf-cat00-tumejorerror.jpg", sectionId: "product-8" }
    ];

    // Define the distribution of products per row
    const rowDistribution = [
        [products[1], products[0]], // Row 1: Doble Cara, Coyote VIP
        [products[2], products[3], products[4]], // Row 2: Tin Tan, Tepito, Fiesta
        [products[7], products[5], products[6]]  // Row 3: Tu Mejor Error, Diario, Volverte
    ];

    const tracks = [
        document.getElementById('track-row-1'),
        document.getElementById('track-row-2'),
        document.getElementById('track-row-3')
    ];

    // Function to create items
    function createItem(product) {
        const item = document.createElement('div');
        item.classList.add('slider-item');
        item.innerHTML = `<img src="${encodeURI(product.cover)}" alt="${product.title}">`;

        // Hover effect to "brake"
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.slider-track').forEach(t => t.style.animationPlayState = 'paused');
        });
        item.addEventListener('mouseleave', () => {
            document.querySelectorAll('.slider-track').forEach(t => t.style.animationPlayState = 'running');
        });

        // Click to SCROLL to section
        item.addEventListener('click', () => {
            const section = document.getElementById(product.sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        return item;
    }

    // Populate rows
    rowDistribution.forEach((rowProducts, index) => {
        const track = tracks[index];
        if (!track) return;

        // Duplicate items to creating seamless loop effect
        const copies = 10;

        for (let i = 0; i < copies; i++) {
            rowProducts.forEach(product => {
                track.appendChild(createItem(product));
            });
        }
    });

});

// ─── PARALLAX EFFECT ON GLASS CARDS ───
(function () {
    const SELECTORS = [
        '.glass-info-card',
        '.glass-synopsis-card',
        '.glass-references-card',
        '.glass-character-card',
        '.glass-patricia-card',
        '.glass-daniela-card',
        '.glass-juan-card',
        '.glass-anthony-card'
    ].join(', ');

    let cards = [];
    let ticking = false;

    function initCards() {
        cards = Array.from(document.querySelectorAll(SELECTORS));
        cards.forEach((card, i) => {
            card._pSpeed = (i % 2 === 0) ? 0.05 : 0.08;
            const computed = window.getComputedStyle(card).transform;
            card._baseTransform = (computed && computed !== 'none') ? computed : '';
        });
    }

    function updateParallax() {
        const vh = window.innerHeight;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < -400 || rect.top > vh + 400) return;
            const offset = (rect.top + rect.height / 2 - vh / 2) * card._pSpeed;
            card.style.transform = card._baseTransform + ` translateY(${offset}px)`;
        });
        ticking = false;
    }

    window.addEventListener('load', () => {
        initCards();
        updateParallax();
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
})();

// ─── LIGHTBOX FOR REFERENCE IMAGES ───
(function () {
    const overlay = document.getElementById('lightbox-overlay');
    const lbImg = document.getElementById('lightbox-img');
    if (!overlay || !lbImg) return;

    // Open lightbox when any reference image is clicked
    document.querySelectorAll('.reference-item img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lbImg.src = img.src;
            lbImg.alt = img.alt || 'Reference';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Prevent closing when clicking the image itself
    lbImg.addEventListener('click', (e) => e.stopPropagation());

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();

// ─── SCROLL TO TOP ───
(function () {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    window.scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
})();
