document.addEventListener('DOMContentLoaded', function() {
    // Slideshow de la section Hero
    const images = [
        'img/1000_F_581814339_dcBh4rdrMuvJF6dV0P3eOpkelaqUxueh.jpg',
        'img/1558136011231.jfif',
        'img/9046923519_bdb486ea75_o.jpg',
        'img/Africa-thriving.avif',
        'img/Nigeria_10070.2e16d0ba.fill-1180x738-c100.jpegquality-60.jpg',
        'img/Survival.fw_.jpg',
        'img/african-kids-enjoying-life_23-2151438327.avif',
        'img/eradication-of-poverty-africa.jpg',
        'img/f0b389485f41364084edc7503c78d7c8a91a56a2.jpg',
        'img/global-food-security-act-2.jpg',
        'img/poverty2.jpg',
        'img/survival_village_2023-1140x570.jpg'
    ];

    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.style.backgroundImage = `url(${images[index]})`;
    });

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    setInterval(showNextSlide, 5000);

    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    const navItems = navLinks.querySelectorAll('li a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Bouton En Savoir Plus
    const learnMoreBtn = document.querySelector('.btn');
    learnMoreBtn.addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (name && email && message) {
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formMessage.textContent = 'Merci pour votre message ! Nous vous répondrons très bientôt.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                formMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
                formMessage.className = 'form-message error';
            }

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            formMessage.textContent = 'Veuillez remplir tous les champs du formulaire.';
            formMessage.className = 'form-message error';
        }
    });

    // Galerie circulaire 3D
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentCarouselIndex = 0;
    const totalCarouselItems = carouselItems.length;
    const radius = 500; // Rayon du cercle

    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            const angle = ((index - currentCarouselIndex) * 360) / totalCarouselItems;
            const radians = (angle * Math.PI) / 180;
            
            const x = Math.sin(radians) * radius;
            const z = Math.cos(radians) * radius - radius;
            
            let scale = 1;
            let opacity = 0.3;
            let zIndex = 1;
            
            // La photo centrale est plus grande et plus opaque
            if (index === currentCarouselIndex) {
                scale = 1.2;
                opacity = 1;
                zIndex = 10;
            } else {
                // Calculer la distance par rapport à la position centrale
                const distance = Math.abs((index - currentCarouselIndex + totalCarouselItems) % totalCarouselItems);
                const normalizedDistance = Math.min(distance, totalCarouselItems - distance);
                scale = 1 - (normalizedDistance * 0.2);
                opacity = 1 - (normalizedDistance * 0.35);
                zIndex = totalCarouselItems - normalizedDistance;
            }
            
            item.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
        });
    }

    // Initialiser la galerie
    updateCarousel();

    // Défilement automatique
    function nextCarousel() {
        currentCarouselIndex = (currentCarouselIndex + 1) % totalCarouselItems;
        updateCarousel();
    }

    let autoplayInterval = setInterval(nextCarousel, 3000);

    // Pause au survol
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    galleryContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextCarousel, 3000);
    });

    // Clic sur les items pour naviguer
    carouselItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentCarouselIndex = index;
            updateCarousel();
        });
    });

    // Animations de scroll pour les autres sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateY(30px)';
        aboutContent.style.transition = 'all 0.8s ease';
        observer.observe(aboutContent);
    }

    const contactFormEl = document.querySelector('.contact-form');
    if (contactFormEl) {
        contactFormEl.style.opacity = '0';
        contactFormEl.style.transform = 'translateY(30px)';
        contactFormEl.style.transition = 'all 0.8s ease';
        observer.observe(contactFormEl);
    }
});
