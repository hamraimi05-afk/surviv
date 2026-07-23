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

    if (hamburger && navLinks) {
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
    }

    // Bouton En Savoir Plus
    const learnMoreBtn = document.querySelector('.btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validation email simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name && email && message) {
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Veuillez saisir une adresse email valide.';
                formMessage.className = 'form-message error';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
                return;
            }

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
    }

    // Fonction réutilisable pour initialiser un carrousel 3D circulaire
    function initCarousel(carouselSelector, enableScrollControls = false) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        const totalItems = items.length;
        const radius = 500; // Rayon du cercle
        let autoplayInterval;
        let isScrolling = false; // Pour éviter les défilements multiples avec la molette
        let touchStartX = 0; // Pour les gestes tactiles

        // Mettre à jour le carrousel
        function updateCarousel() {
            items.forEach((item, index) => {
                const angle = ((index - currentIndex) * 360) / totalItems;
                const radians = (angle * Math.PI) / 180;

                const x = Math.sin(radians) * radius;
                const z = Math.cos(radians) * radius - radius;

                let scale = 1;
                let opacity = 0.3;
                let zIndex = 1;

                // La photo centrale est plus grande et plus opaque
                if (index === currentIndex) {
                    scale = 1.2;
                    opacity = 1;
                    zIndex = 10;
                } else {
                    // Calculer la distance par rapport à la position centrale
                    const distance = Math.abs((index - currentIndex + totalItems) % totalItems);
                    const normalizedDistance = Math.min(distance, totalItems - distance);
                    scale = 1 - (normalizedDistance * 0.2);
                    opacity = 1 - (normalizedDistance * 0.35);
                    zIndex = totalItems - normalizedDistance;
                }

                item.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = zIndex;
            });
        }

        // Passer à l'image suivante
        function nextCarousel() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        // Passer à l'image précédente
        function prevCarousel() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        // Démarrer le défilement automatique
        function startAutoplay() {
            stopAutoplay(); // S'assurer qu'il n'y a pas d'intervalle existant
            autoplayInterval = setInterval(nextCarousel, 3000);
        }

        // Arrêter le défilement automatique
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Initialiser
        updateCarousel();
        startAutoplay();

        // Pause au survol
        const container = carousel.closest('.gallery-container');
        if (container) {
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }

        // Clic sur les items pour naviguer
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Contrôles par scroll/gestes (uniquement si activé)
        if (enableScrollControls && container) {
            // Gestion de la molette de souris
            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (isScrolling) return;
                
                isScrolling = true;
                stopAutoplay();

                if (e.deltaY > 0) {
                    nextCarousel();
                } else {
                    prevCarousel();
                }

                setTimeout(() => {
                    isScrolling = false;
                    startAutoplay();
                }, 600); // Attendre la fin de l'animation avant de réactiver
            }, { passive: false });

            // Gestion des gestes tactiles (mobile)
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                stopAutoplay();
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                if (!touchStartX) return;

                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                // Seulement si le geste est suffisamment long (50px minimum)
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        // Glissé vers la gauche → image suivante
                        nextCarousel();
                    } else {
                        // Glissé vers la droite → image précédente
                        prevCarousel();
                    }
                }

                touchStartX = 0;
                startAutoplay(); // Reprendre le défilement automatique
            }, { passive: true });
        }
    }

    // Initialiser les deux galeries
    initCarousel('#gallery .gallery-carousel'); // Sans contrôles scroll/gestes
    initCarousel('#gallery2 .gallery-carousel', true); // Avec contrôles scroll/gestes

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

    // Nouvelle galerie 3D avec défilement automatique INFINI
    const gallery2Items = Array.from(document.querySelectorAll('.gallery2-item'));
    let gallery2Index = 0;
    let gallery2Autoplay;
    let isTransitioning = false;

    // Dupliquer les items pour le scroll infini
    const gallery2Track = document.querySelector('.gallery2-track');
    if (gallery2Track && gallery2Items.length > 0) {
        // Dupliquer deux fois pour l'effet infini
        gallery2Items.forEach(item => {
            const clone1 = item.cloneNode(true);
            const clone2 = item.cloneNode(true);
            gallery2Track.appendChild(clone1);
            gallery2Track.appendChild(clone2);
        });
    }

    // Obtenir la nouvelle liste complète des items
    const allGallery2Items = document.querySelectorAll('.gallery2-item');
    const totalItems = allGallery2Items.length;
    const originalCount = gallery2Items.length;

    function updateGallery2() {
        allGallery2Items.forEach((item, index) => {
            let displayIndex = index;
            // Calculer l'offset en utilisant l'index du milieu pour l'effet infini
            const offset = index - (gallery2Index + originalCount);
            
            let z = Math.abs(offset) * -100;
            let x = offset * 250; // Augmenter l'espacement pour les plus grandes images
            let scale = 1 - (Math.abs(offset) * 0.18); // Réduire l'effet d'échelle
            let opacity = 1 - (Math.abs(offset) * 0.25);
            let rotateY = offset * -12; // Réduire la rotation

            if (scale < 0.5) scale = 0.5;
            if (opacity < 0.2) opacity = 0.2;

            item.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = 50 - Math.abs(offset);
            
            // Déterminer l'item actif (celui avec offset 0 dans la partie visible)
            const isActive = index === gallery2Index + originalCount;
            item.classList.toggle('gallery2-active', isActive);
        });
    }

    // Initialiser la galerie avec l'index au milieu pour l'effet infini
    gallery2Index = 0;
    updateGallery2();

    // Défilement automatique
    function startGallery2Autoplay() {
        gallery2Autoplay = setInterval(() => {
            if (!isTransitioning) {
                moveGallery2(1);
            }
        }, 3500);
    }
    startGallery2Autoplay();

    // Fonction pour déplacer la galerie
    function moveGallery2(direction) {
        isTransitioning = true;
        
        gallery2Index += direction;
        
        // Réinitialiser l'index pour l'effet infini sans transition visuelle
        if (gallery2Index >= originalCount) {
            // Attendre que la transition termine, puis réinitialiser
            setTimeout(() => {
                gallery2Index -= originalCount;
                allGallery2Items.forEach(item => {
                    item.style.transition = 'none';
                });
                updateGallery2();
                // Réactiver les transitions après un petit délai
                setTimeout(() => {
                    allGallery2Items.forEach(item => {
                        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    });
                    isTransitioning = false;
                }, 50);
            }, 600);
        } else if (gallery2Index < 0) {
            setTimeout(() => {
                gallery2Index += originalCount;
                allGallery2Items.forEach(item => {
                    item.style.transition = 'none';
                });
                updateGallery2();
                setTimeout(() => {
                    allGallery2Items.forEach(item => {
                        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    });
                    isTransitioning = false;
                }, 50);
            }, 600);
        } else {
            updateGallery2();
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }
    }

    // Clic sur les items de la galerie - seulement les items adjacents ou actif
    allGallery2Items.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (isTransitioning) return;
            
            const visibleIndex = index - originalCount;
            const offset = visibleIndex - gallery2Index;
            
            if (Math.abs(offset) === 1) { // Clic sur un item adjacent
                moveGallery2(offset);
                clearInterval(gallery2Autoplay);
                startGallery2Autoplay();
            } else if (offset !== 0) { // Clic sur un item plus loin, aller vers lui progressivement
                moveGallery2(offset > 0 ? 1 : -1);
                clearInterval(gallery2Autoplay);
                startGallery2Autoplay();
            }
        });
    });

    // Pause au survol de la galerie
    const gallery2Container = document.querySelector('.gallery2-container');
    if (gallery2Container) {
        gallery2Container.addEventListener('mouseenter', () => {
            clearInterval(gallery2Autoplay);
        });

        gallery2Container.addEventListener('mouseleave', () => {
            startGallery2Autoplay();
        });
    }
});
