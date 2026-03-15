/* ==========================================
   PRISYS SOLUTIONS — scripts.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── RESET SCROLL ON RELOAD ── */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Scale cursor on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .service-card, .project-card, .about-card, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.opacity = '0.5';
        follower.style.width = '48px';
        follower.style.height = '48px';
        follower.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.opacity = '1';
        follower.style.width = '32px';
        follower.style.height = '32px';
        follower.style.opacity = '0.6';
      });
    });
  }

  /* ── DARK MODE TOGGLE ── */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('prisys-theme');

  // Apply saved preference on load
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('prisys-theme', isDark ? 'dark' : 'light');

    // Animate toggle button
    themeToggle.style.transform = 'scale(0.85) rotate(20deg)';
    setTimeout(() => { themeToggle.style.transform = ''; }, 200);
  });

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => counterObserver.observe(el));

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── FORM SUBMISSION ── */
  const form = document.getElementById('contactForm');
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  document.body.appendChild(toastContainer);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
      <div class="toast-content">${message}</div>
    `;
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('visible'), 10);
    
    // Remove after time
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalText = btn.textContent;
      
      const formData = {
        name: form.querySelector('input[placeholder="Tu nombre"]').value,
        company: form.querySelector('input[placeholder="Tu empresa"]').value,
        email: form.querySelector('input[placeholder="tu@empresa.com"]').value,
        message: form.querySelector('textarea').value
      };

      btn.textContent = 'Enviando...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast('¡Mensaje enviado correctamente! Nos contactaremos pronto.', 'success');
          form.reset();
        } else {
          showToast(result.error || 'Hubo un problema al enviar el mensaje. Intente de nuevo.', 'error');
        }
      } catch (err) {
        showToast('Error de conexión. Asegúrese de que el servidor esté corriendo.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    });
  }

  /* ── PARALLAX ORB ON MOUSE MOVE ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      document.querySelector('.orb1')?.style.setProperty('transform', `translate(${x * 30}px, ${y * 20}px)`);
      document.querySelector('.orb2')?.style.setProperty('transform', `translate(${-x * 20}px, ${-y * 25}px)`);
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--blue)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ── PROJECT MODAL ── */
  const projectData = {
    'erp-ventas': {
      title: 'ERP de Ventas Moderno',
      desc: 'Sistema integral de gestión de ventas, stock e inventario con reportes avanzados.',
      images: [
        'proyectos/ERP VENTAS/image1.PNG',
        'proyectos/ERP VENTAS/image2.PNG',
        'proyectos/ERP VENTAS/image3.PNG',
        'proyectos/ERP VENTAS/image4.PNG',
        'proyectos/ERP VENTAS/image5.PNG'
      ]
    },
    'carniceria': {
      title: 'Gestión de Carnicerías',
      desc: 'Software especializado para el control de stock, pesaje y ventas en carnicerías.',
      images: [
        'proyectos/carnicera sistema/image1.png',
        'proyectos/carnicera sistema/image2.png',
        'proyectos/carnicera sistema/image3.png',
        'proyectos/carnicera sistema/image4.png',
        'proyectos/carnicera sistema/image5.png',
        'proyectos/carnicera sistema/image6.png',
        'proyectos/carnicera sistema/image7.png'
      ]
    },
    'ecm-chip': {
      title: 'ECM Chip Reprogramación',
      desc: 'Plataforma técnica para la gestión de servicios de reprogramación de ECUs y chips automotrices.',
      images: [
        'proyectos/ecm chip/image1.png',
        'proyectos/ecm chip/image2.PNG',
        'proyectos/ecm chip/image3.PNG',
        'proyectos/ecm chip/image4.PNG',
        'proyectos/ecm chip/image5.PNG',
        'proyectos/ecm chip/image6.PNG'
      ]
    },
    'md-estetica': {
      title: 'MD Estética & Salud',
      desc: 'Sistema de turnos, historia clínica digital y gestión de pacientes para centros de estética.',
      images: [
        'proyectos/MD ESTETICA/image1.png',
        'proyectos/MD ESTETICA/image2.png',
        'proyectos/MD ESTETICA/image3.png',
        'proyectos/MD ESTETICA/image4.png',
        'proyectos/MD ESTETICA/image5.png'
      ]
    }
  };

  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalGallery = document.getElementById('modalGallery');
  const modalClose = modal.querySelector('.modal-close');
  const modalCloseBtn = modal.querySelector('.modal-close-btn');
  const modalOverlay = modal.querySelector('.modal-overlay');

  const openModal = (id) => {
    const data = projectData[id];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalGallery.innerHTML = '';

    data.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = data.title;
      img.loading = 'lazy';
      modalGallery.appendChild(img);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scroll
    modal.querySelector('.modal-body').scrollTop = 0; // Reset scroll to top
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project');
      openModal(id);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ── SERVICE CARD TILT ── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.perspective = '600px';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── PAGE LOAD ANIMATION ── */
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);

});
