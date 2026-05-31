// ===================================
// Marketing Agency - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function () {

  // ===================================
  // Mobile Navigation Toggle
  // ===================================
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (navbarToggle) {
    navbarToggle.addEventListener('click', function () {
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
      });
    });
  }

  // ===================================
  // Navbar Scroll Effect
  // ===================================
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===================================
  // Active Navigation Link
  // ===================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.navbar-menu a');

  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===================================
  // Smooth Scrolling for Anchor Links
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===================================
  // Scroll Animation Observer - Alternating Lateral
  // ===================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Remove visible class when scrolling away for fade-out effect
        if (entry.boundingClientRect.top > 0) {
          // Element is below viewport (scrolling up)
          entry.target.classList.remove('visible');
        }
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in classes
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(element => {
    observer.observe(element);
  });

  // Observe sections for fade in/out
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // ===================================
  // Assign Alternating Animations to Elements
  // ===================================
  function assignAlternatingAnimations() {
    // Get all sections
    const sections = document.querySelectorAll('.section');

    sections.forEach((section, sectionIndex) => {
      // Alternate section content direction
      const isLeftSection = sectionIndex % 2 === 0;

      // Find all animatable elements in this section
      const animatableElements = section.querySelectorAll('.section-title, .gallery-grid, .contact-form, p:not(.form-error), h2, h3, .hero-buttons, .btn');

      animatableElements.forEach(element => {
        // Skip if already has specific animation class
        if (element.classList.contains('fade-in-left') || element.classList.contains('fade-in-right')) {
          return;
        }

        // Remove generic fade-in if present
        element.classList.remove('fade-in');

        // Add alternating animation
        if (isLeftSection) {
          element.classList.add('fade-in-left');
        } else {
          element.classList.add('fade-in-right');
        }
      });

      // Handle gallery items separately - alternate within the grid
      const galleryItems = section.querySelectorAll('.gallery-item');
      galleryItems.forEach((item, itemIndex) => {
        item.classList.remove('fade-in', 'fade-in-left', 'fade-in-right');

        // Alternate each item
        if (itemIndex % 2 === 0) {
          item.classList.add('fade-in-left');
        } else {
          item.classList.add('fade-in-right');
        }
      });
    });
  }

  // Call the function to assign animations
  assignAlternatingAnimations();

  // ===================================
  // Contact Form Validation & Submission
  // ===================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      let isValid = true;

      // Get form fields
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Por favor, insira seu nome');
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'Por favor, insira seu email');
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Por favor, insira um email válido');
        isValid = false;
      }

      // Validate phone (optional but if filled, should be valid)
      if (phone && phone.value.trim()) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(phone.value.trim())) {
          showError(phone, 'Por favor, insira um telefone válido');
          isValid = false;
        }
      }

      // Validate subject
      if (subject && !subject.value.trim()) {
        showError(subject, 'Por favor, insira o assunto');
        isValid = false;
      }

      // Validate message
      if (!message.value.trim()) {
        showError(message, 'Por favor, insira sua mensagem');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showError(message, 'A mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
      }

      // If form is valid, submit
      if (isValid) {
        submitForm({
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone ? phone.value.trim() : '',
          subject: subject ? subject.value.trim() : '',
          message: message.value.trim()
        });
      }
    });
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function submitForm(data) {
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Simulate form submission (in production, this would be an API call)
    setTimeout(() => {
      // Show success message
      const successMessage = document.querySelector('.form-success');
      if (successMessage) {
        successMessage.classList.add('show');
      }

      // Reset form
      contactForm.reset();

      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;

      // Hide success message after 5 seconds
      setTimeout(() => {
        if (successMessage) {
          successMessage.classList.remove('show');
        }
      }, 5000);

      // In production, you would send data to your backend:
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // .then(response => response.json())
      // .then(result => {
      //   // Handle success
      // })
      // .catch(error => {
      //   // Handle error
      // });

      console.log('Form submitted with data:', data);
    }, 1500);
  }

  // ===================================
  // Gallery Item Click Handler
  // ===================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      // You can add lightbox functionality here
      console.log('Gallery item clicked');
    });
  });

  // ===================================
  // Parallax Effect for Abstract Shapes
  // ===================================
  const shapes = document.querySelectorAll('.abstract-shape');

  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;

    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  });



});

// ===================================
// Utility Functions
// ===================================

// Format phone number as user types
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 0) {
    if (value.length <= 2) {
      value = `(${value}`;
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
  }

  input.value = value;
}

// Add phone formatting to phone input if it exists
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    formatPhoneNumber(this);
  });
}
