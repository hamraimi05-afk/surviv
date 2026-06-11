document.addEventListener('DOMContentLoaded', function() {
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

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const learnMoreBtn = document.querySelector('.btn');

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

    learnMoreBtn.addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });

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
