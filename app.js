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
  } else if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
  } else {
    // If no saved preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
    }
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

  // Initialize all functions
  function init() {
    fetchBlogPosts();
    setupAnimations();
    parallaxEffect();
    setupHolographicGradient();
    setupFormSubmission();
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
