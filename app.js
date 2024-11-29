document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  // Custom cursor
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

  // Burger menu toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    body.classList.toggle('nav-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      body.classList.remove('nav-open');
    }
  });

  // Smooth scroll for navigation links
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

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }

  // Fetch blog posts
  async function fetchBlogPosts() {
    try {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      
      const blogGrid = document.getElementById('blog-posts');
      blogGrid.innerHTML = posts.map(post => `
        <div class="glass-card blog-card fade-in-up">
          <img src="${post.image}" alt="${post.title}" class="blog-image">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <a href="/blog/${post._id}" class="read-more">Read More</a>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }

  // Intersection Observer for animations
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

  // Parallax effect
  function parallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      heroImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    });
  }

  // Holographic gradient effect
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

  // Form submission
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

  // Particle effect
  function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles');
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.width = `${Math.random() * 5 + 1}px`;
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);

      animateParticle(particle);
    }
  }

  function animateParticle(particle) {
    const animationDuration = Math.random() * 20 + 10;
    const animationDelay = Math.random() * 10;

    particle.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)` }
      ],
      {
        duration: animationDuration * 1000,
        delay: animationDelay * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      }
    );
  }

  // Reveal animation for section titles
  function setupRevealAnimation() {
    const sectionTitles = document.querySelectorAll('.section-title');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => {
      title.style.opacity = '0';
      observer.observe(title);
    });
  }

  // Tilt effect for trainer cards
  function setupTiltEffect() {
    const trainerCards = document.querySelectorAll('.trainer-card');

    trainerCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // Animated counter for statistics
  function setupAnimatedCounter() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounter = (counter) => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const inc = target / speed;

      const updateCount = () => {
        if (count < target) {
          count += inc;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Typewriter effect for hero subtitle
  function setupTypewriterEffect() {
    const subtitle = document.querySelector('.hero .subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    typeWriter();
  }

  // Initialize all functions
  function init() {
    fetchBlogPosts();
    setupAnimations();
    parallaxEffect();
    setupHolographicGradient();
    setupFormSubmission();
    createParticles();
    setupRevealAnimation();
    setupTiltEffect();
    setupAnimatedCounter();
    setupTypewriterEffect();
  }

  init();

  // Reinitialize animations on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupAnimations();
    }, 250);
  });
});
