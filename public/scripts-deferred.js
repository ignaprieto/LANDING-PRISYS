/* Deferred interactions to reduce main-thread blocking on first paint */

(function () {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = String(Math.round(easeOut(progress) * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.style.color = '';
              if (link.getAttribute('href') === `#${id}`) link.style.color = 'var(--blue)';
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  if (!isMobile) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    if (cursor && follower) {
      let mouseX = 0;
      let mouseY = 0;
      let followerX = 0;
      let followerY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
      });

      const animateFollower = () => {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        requestAnimationFrame(animateFollower);
      };
      animateFollower();

      const hoverables = document.querySelectorAll('a, button, .service-modern-card, .project-card, .about-card, input, textarea');
      hoverables.forEach((el) => {
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

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        document.querySelector('.orb1')?.style.setProperty('transform', `translate(${x * 30}px, ${y * 20}px)`);
        document.querySelector('.orb2')?.style.setProperty('transform', `translate(${-x * 20}px, ${-y * 25}px)`);
      });
    }
  }
})();
