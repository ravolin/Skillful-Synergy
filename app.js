document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 100);
        });
    } else {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        body.classList.toggle('nav-open');
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            body.classList.remove('nav-open');
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    } else if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
        }
    }

    const POSTS_PER_PAGE = 6;
    let currentPage = 1;
    let totalPages = 1;
    let currentPosts = [];

    const blogPosts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Blog Post ${i + 1}`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        content: 'Full blog post content goes here...',
        image: `https://picsum.photos/400/250?random=${i + 1}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
    }));

    function renderBlogPosts(page) {
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        currentPosts = blogPosts.slice(startIndex, endIndex);

        const blogGrid = document.querySelector('.blog-grid');
        blogGrid.innerHTML = currentPosts.map((post, index) => `
            <div class="blog-card glass-card fade-in-up" data-index="${index}">
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <button class="read-more">Read More</button>
                </div>
            </div>
        `).join('');

        setupBlogCardListeners();
    }

    function setupBlogCardListeners() {
        const blogCards = document.querySelectorAll('.blog-card');
        blogCards.forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                openBlogModal(index);
            });
        });
    }

    function setupPagination() {
        totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
        const pageNumbers = document.getElementById('page-numbers');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <span class="page-number ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</span>
        `).join('');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        pageNumbers.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-number')) {
                currentPage = parseInt(e.target.dataset.page);
                renderBlogPosts(currentPage);
                setupPagination();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBlogPosts(currentPage);
                setupPagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBlogPosts(currentPage);
                setupPagination();
            }
        });
    }

    const modal = document.getElementById('blog-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.querySelector('.modal-close');
    const prevBlogBtn = document.querySelector('.prev-btn');
    const nextBlogBtn = document.querySelector('.next-btn');
    let currentModalIndex = 0;

    function openBlogModal(index) {
        currentModalIndex = index;
        const post = currentPosts[index];
        
        modalContent.innerHTML = `
            <h2>${post.title}</h2>
            <img src="${post.image}" alt="${post.title}" class="modal-image">
            <p class="modal-date">${post.date}</p>
            <div class="modal-text">${post.content}</div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateModalNavigation();
    }

    function updateModalNavigation() {
        prevBlogBtn.style.display = currentModalIndex > 0 ? 'block' : 'none';
        nextBlogBtn.style.display = currentModalIndex < currentPosts.length - 1 ? 'block' : 'none';
    }

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    prevBlogBtn.addEventListener('click', () => {
        if (currentModalIndex > 0) {
            openBlogModal(currentModalIndex - 1);
        }
    });

    nextBlogBtn.addEventListener('click', () => {
        if (currentModalIndex < currentPosts.length - 1) {
            openBlogModal(currentModalIndex + 1);
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    renderBlogPosts(currentPage);
    setupPagination();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function setupAnimations() {
        const animatedElements = document.querySelectorAll('.glass-card, .section-title, .hero-content, .about-content, .service-grid, .trainer-grid, .contact-content');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    function parallaxEffect() {
        const heroImage = document.querySelector('.hero-image');
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    }

    function setupHolographicGradient() {
        const holographicElements = document.querySelectorAll('.holographic-gradient');
        holographicElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                element.style.setProperty('--mouse-x', `${x}px`);
                element.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    function setupFormSubmission() {
        const contactForm = document.querySelector('.contact-form');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message. Please try again later.');
            }
        });
    }

    function init() {
        setupAnimations();
        parallaxEffect();
        setupHolographicGradient();
        setupFormSubmission();
    }

    init();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupAnimations();
        }, 250);
    });
});
