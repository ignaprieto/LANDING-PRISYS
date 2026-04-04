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
    const syncMobileMenuA11y = (isOpen) => {
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navMobile.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMobile.classList.toggle('open');
      const isOpen = navMobile.classList.contains('open');
      body.style.overflow = isOpen ? 'hidden' : '';
      syncMobileMenuA11y(isOpen);
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('open');
        body.style.overflow = '';
        syncMobileMenuA11y(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !navMobile.classList.contains('open')) return;
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
      body.style.overflow = '';
      syncMobileMenuA11y(false);
    });

    syncMobileMenuA11y(navMobile.classList.contains('open'));
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
        name: form.querySelector('input[name="name"]')?.value || '',
        company: form.querySelector('input[name="company"]')?.value || '',
        email: form.querySelector('input[name="email"]')?.value || '',
        message: form.querySelector('textarea[name="message"]')?.value || ''
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

  let modalBootstrapPromise;
  const loadModalFeature = () => {
    if (!modalBootstrapPromise) {
      modalBootstrapPromise = import('./scripts-modal.js')
        .then((module) => module.initProjectModal())
        .catch(() => {
          modalBootstrapPromise = null;
        });
    }
    return modalBootstrapPromise;
  };

  const projectCards = document.querySelectorAll('.project-card[data-project]');
  if (projectCards.length) {
    const onCardActivate = async (card) => {
      const projectId = card.getAttribute('data-project');
      if (!projectId) return;
      await loadModalFeature();
      window.dispatchEvent(new CustomEvent('prisys:open-project-modal', { detail: { projectId } }));
    };

    projectCards.forEach((card) => {
      card.addEventListener('click', () => {
        onCardActivate(card);
      });

      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onCardActivate(card);
      });
    });

    const projectsSection = document.getElementById('proyectos');
    if ('IntersectionObserver' in window && projectsSection) {
      const observer = new IntersectionObserver((entries, obs) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadModalFeature();
        obs.disconnect();
      }, { rootMargin: '320px 0px' });
      observer.observe(projectsSection);
    }
  }

  const loadDeferredEnhancements = () => {
    if (window.__prisysEnhancementsLoaded) return;
    window.__prisysEnhancementsLoaded = true;
    import('./scripts-deferred.js')
      .then((module) => module.initDeferredEnhancements())
      .catch(() => {
        window.__prisysEnhancementsLoaded = false;
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDeferredEnhancements, { timeout: 1800 });
  } else {
    setTimeout(loadDeferredEnhancements, 1200);
  }
});
