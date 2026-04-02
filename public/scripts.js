/* ==========================================
   PRISYS SOLUTIONS — scripts.js
   Performance-focused initialization
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const body = document.body;

  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('prisys-theme');
  if (savedTheme === 'dark') body.classList.add('dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      localStorage.setItem('prisys-theme', isDark ? 'dark' : 'light');
      themeToggle.style.transform = 'scale(0.85) rotate(20deg)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 200);
    });
  }

  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMobile.classList.toggle('open');
      body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('open');
        body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    });
  });

  const form = document.getElementById('contactForm');
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  body.appendChild(toastContainer);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
      <div class="toast-content">${message}</div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalText = btn ? btn.textContent : 'Enviar';

      const formData = {
        name: form.querySelector('input[placeholder="Tu nombre"]')?.value || '',
        company: form.querySelector('input[placeholder="Tu empresa"]')?.value || '',
        email: form.querySelector('input[placeholder="tu@empresa.com"]')?.value || '',
        message: form.querySelector('textarea')?.value || ''
      };

      if (btn) {
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }

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
      } catch (_err) {
        showToast('Error de conexión. Asegúrese de que el servidor esté corriendo.', 'error');
      } finally {
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }
    });
  }

  const projectData = {
    'erp-ventas': {
      title: 'ERP de Ventas Moderno',
      desc: 'Sistema integral de gestión de ventas, stock e inventario con reportes avanzados.',
      images: [
        'proyectos/ERP VENTAS/image1.webp',
        'proyectos/ERP VENTAS/image2.webp',
        'proyectos/ERP VENTAS/image3.webp',
        'proyectos/ERP VENTAS/image4.webp',
        'proyectos/ERP VENTAS/image5.webp'
      ]
    },
    carniceria: {
      title: 'Gestión de Carnicerías',
      desc: 'Software especializado para el control de stock, pesaje y ventas en carnicerías.',
      images: [
        'proyectos/carnicera sistema/image1.webp',
        'proyectos/carnicera sistema/image2.webp',
        'proyectos/carnicera sistema/image3.webp',
        'proyectos/carnicera sistema/image4.webp',
        'proyectos/carnicera sistema/image5.webp',
        'proyectos/carnicera sistema/image6.webp',
        'proyectos/carnicera sistema/image7.webp'
      ]
    },
    'ecm-chip': {
      title: 'ECM Chip Reprogramación',
      desc: 'Plataforma técnica para la gestión de servicios de reprogramación de ECUs y chips automotrices.',
      images: [
        'proyectos/ecm chip/image1.webp',
        'proyectos/ecm chip/image2.webp',
        'proyectos/ecm chip/image3.webp',
        'proyectos/ecm chip/image4.webp',
        'proyectos/ecm chip/image5.webp',
        'proyectos/ecm chip/image6.webp',
        'proyectos/ecm chip/image7.webp',
        'proyectos/ecm chip/image8.webp',
        'proyectos/ecm chip/image9.webp'
      ]
    },
    'md-estetica': {
      title: 'MD Estética & Salud',
      desc: 'Sistema de turnos, historia clínica digital y gestión de pacientes para centros de estética.',
      images: [
        'proyectos/MD ESTETICA/image1.webp',
        'proyectos/MD ESTETICA/image2.webp',
        'proyectos/MD ESTETICA/image3.webp',
        'proyectos/MD ESTETICA/image4.webp',
        'proyectos/MD ESTETICA/image5.webp'
      ]
    }
  };

  const modal = document.getElementById('projectModal');
  if (modal) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalGallery = document.getElementById('modalGallery');
    const modalClose = modal.querySelector('.modal-close');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const galleryPrev = modal.querySelector('.gallery-nav.prev');
    const galleryNext = modal.querySelector('.gallery-nav.next');
    const currentImgSpan = document.getElementById('currentImg');
    const totalImgSpan = document.getElementById('totalImg');

    let currentImgIndex = 0;
    let totalImages = 0;

    const updateSlider = () => {
      const offset = -currentImgIndex * 100;
      modalGallery.style.transform = `translateX(${offset}%)`;
      if (currentImgSpan) currentImgSpan.textContent = String(currentImgIndex + 1);
      modalGallery.querySelectorAll('img').forEach((img) => img.classList.remove('zoomed'));
    };

    const openModal = (id) => {
      const data = projectData[id];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalGallery.innerHTML = '';
      currentImgIndex = 0;
      totalImages = data.images.length;
      if (totalImgSpan) totalImgSpan.textContent = String(totalImages);

      data.images.forEach((src, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${data.title} - ${idx + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          img.classList.toggle('zoomed');
        });
        item.appendChild(img);
        modalGallery.appendChild(item);
      });

      updateSlider();
      modal.classList.add('open');
      body.style.overflow = 'hidden';
      modal.querySelector('.modal-body').scrollTop = 0;
    };

    const closeModal = () => {
      modal.classList.remove('open');
      body.style.overflow = '';
    };

    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project');
        openModal(id);
      });
    });

    if (galleryPrev) {
      galleryPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex - 1 + totalImages) % totalImages;
        updateSlider();
      });
    }

    if (galleryNext) {
      galleryNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex + 1) % totalImages;
        updateSlider();
      });
    }

    modalClose?.addEventListener('click', closeModal);
    modalCloseBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  const loadDeferredEnhancements = () => {
    if (window.__prisysEnhancementsLoaded) return;
    window.__prisysEnhancementsLoaded = true;
    const script = document.createElement('script');
    script.src = 'scripts-deferred.js';
    script.defer = true;
    document.body.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDeferredEnhancements, { timeout: 1800 });
  } else {
    setTimeout(loadDeferredEnhancements, 1200);
  }
});
