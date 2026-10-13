/**
 * Mostafa Aljabaly - Cinematic Portfolio Script
 * Handles navigation, custom admin items rendering, interactive tabs, 
 * lightbox modal, dynamic WhatsApp booking messages, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. Mobile Navigation ================= */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header') && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  }

  /* ================= 2. Sticky Header Elevation ================= */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ================= 3. Load Dynamic Items from Admin Portal ================= */
  function loadCustomPortfolioItems() {
    let customVideos = [];
    let customPhotos = [];

    try {
      customVideos = JSON.parse(localStorage.getItem('mostafa_custom_videos')) || [];
    } catch { customVideos = []; }

    try {
      customPhotos = JSON.parse(localStorage.getItem('mostafa_custom_photos')) || [];
    } catch { customPhotos = []; }

    const videoGrid = document.querySelector('.video-grid');
    const photoGrid = document.querySelector('.photo-grid');

    // Prepend custom videos to the beginning of video grid with cinematic badges & watermarks
    if (videoGrid && customVideos.length > 0) {
      customVideos.forEach(v => {
        const article = document.createElement('article');
        article.className = 'video-card reveal custom-item';
        article.setAttribute('data-category', 'video');

        const isFb = v.platformClass === 'fb';
        const pillIconSvg = isFb ? `
          <svg class="pill-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>` : `
          <svg class="pill-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>`;

        const watermarkHtml = (v.institutionWatermark || v.institutionLogo) ? `
          <div class="video-card-watermark" aria-hidden="true">
            <img src="${escapeHtml(v.institutionWatermark || v.institutionLogo)}" alt="" loading="lazy">
          </div>` : '';

        const clientBadgeHtml = v.institutionLogo ? `
          <div class="client-logo-badge" title="${escapeHtml(v.institutionName || '')}">
            <img src="${escapeHtml(v.institutionLogo)}" alt="${escapeHtml(v.institutionName || '')}">
          </div>` : '';

        article.innerHTML = `
          ${watermarkHtml}
          <div class="video-card-top">
            <div class="video-card-client">
              ${clientBadgeHtml}
              <div class="client-meta">
                <span class="video-card-client-name">${escapeHtml(v.institutionName || 'عمل سينمائي جديد')}</span>
                <span class="video-card-tag">${escapeHtml(v.category || 'إنتاج ومونتاج')}</span>
              </div>
            </div>
            <div class="video-card-badges">
              <span class="platform-pill ${escapeHtml(v.platformClass || 'ig')}">
                ${pillIconSvg}
                <span>${escapeHtml(v.platformLabel || 'Online Video')}</span>
              </span>
            </div>
          </div>
          <div class="video-card-body">
            <h3 class="video-card-title">${escapeHtml(v.title)}</h3>
            <p class="video-card-desc">${escapeHtml(v.description || '')}</p>
          </div>
          <div class="video-card-footer">
            <a href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer" class="video-play-btn" aria-label="مشاهدة فيديو ${escapeHtml(v.title)}">
              <span class="play-icon-circle">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              <span class="btn-text">مشاهدة الفيديو المباشر</span>
              <span class="btn-arrow-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            </a>
          </div>
        `;
        videoGrid.prepend(article);
      });
    }

    // Prepend custom photos to the beginning of photo grid
    if (photoGrid && customPhotos.length > 0) {
      customPhotos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'photo-item reveal custom-item';
        div.setAttribute('data-category', 'photo');
        div.setAttribute('data-img', p.imageData);
        div.setAttribute('data-title', p.title);
        div.setAttribute('data-desc', p.description || p.category || '');
        div.innerHTML = `
          <img src="${p.imageData}" alt="${escapeHtml(p.title)}" loading="lazy">
          <span class="photo-zoom-icon">🔍</span>
          <div class="photo-caption">
            <small>${escapeHtml(p.category || 'عمل فوتوغرافي جديد')}</small>
            <h4>${escapeHtml(p.title)}</h4>
            <span>${escapeHtml(p.description || '')}</span>
          </div>
        `;
        photoGrid.prepend(div);
      });
    }

    // Update category filter buttons with new total counts
    const videoFilterBtn = document.querySelector('.filter-btn[data-filter="video"]');
    const photoFilterBtn = document.querySelector('.filter-btn[data-filter="photo"]');
    if (videoFilterBtn) {
      videoFilterBtn.textContent = `إنتاج الفيديو (${6 + customVideos.length})`;
    }
    if (photoFilterBtn) {
      photoFilterBtn.textContent = `التصوير الفوتوغرافي (${5 + customPhotos.length})`;
    }
  }

  // Execute admin data insertion before binding events
  loadCustomPortfolioItems();

  /* ================= 4. Portfolio Category Filtering ================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');
  const photoItems = document.querySelectorAll('.photo-item');
  const categoryTitles = document.querySelectorAll('.portfolio-category-title');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      // Filter video cards
      const allVideos = document.querySelectorAll('.video-card');
      allVideos.forEach(card => {
        if (filter === 'all' || filter === 'video') {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      // Filter photo items
      const allPhotos = document.querySelectorAll('.photo-item');
      allPhotos.forEach(item => {
        if (filter === 'all' || filter === 'photo') {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; }, 20);
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });

      // Filter category titles
      categoryTitles.forEach(title => {
        const cat = title.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          title.style.display = 'flex';
        } else {
          title.style.display = 'none';
        }
      });
    });
  });

  /* ================= 5. Photo Gallery Lightbox Modal ================= */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg && lightboxClose) {
    const allPhotoItems = document.querySelectorAll('.photo-item');
    allPhotoItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        const imgTitle = item.getAttribute('data-title') || '';
        const imgDesc = item.getAttribute('data-desc') || '';

        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightboxImg.alt = imgTitle;
          lightboxCaption.innerHTML = `<strong>${escapeHtml(imgTitle)}</strong><br><span style="font-size: 13px; color: #a1aab8;">${escapeHtml(imgDesc)}</span>`;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 200);
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close when clicking outside content
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ================= 6. Dynamic WhatsApp Booking Builder ================= */
  const servicePills = document.querySelectorAll('.service-pill');
  const dynamicWaBtn = document.getElementById('dynamicWaBtn');
  const waBaseNumber = '970595845086';

  if (servicePills.length > 0 && dynamicWaBtn) {
    servicePills.forEach(pill => {
      pill.addEventListener('click', () => {
        servicePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const serviceName = pill.getAttribute('data-service');
        const customMessage = `مرحبا مصطفى، أود الاستفسار والتنسيق بخصوص خدمة: ${serviceName}`;
        const encodedMsg = encodeURIComponent(customMessage);
        
        dynamicWaBtn.href = `https://wa.me/${waBaseNumber}?text=${encodedMsg}`;
      });
    });
  }

  /* ================= 7. Scroll Reveal Observer ================= */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger slightly
          const delay = (index % 3) * 80;
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ================= 8. Active Nav Link on Scroll ================= */
  const sections = document.querySelectorAll('section[id], body[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* ================= 10. Dynamic Animated Number Counters ================= */
  const counterElements = document.querySelectorAll('.counter-animate');

  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 1800; // 1.8 seconds smooth roll
      const startTime = performance.now();

      // Smooth ease-out cubic curve: starts lively and decelerates into final number
      const easeOutCubic = (t) => (--t) * t * t + 1;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutCubic(progress);
        const currentVal = Math.round(ease * target);

        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          el.classList.add('counted');
        }
      };

      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      });

      counterElements.forEach(counter => counterObserver.observe(counter));
    } else {
      counterElements.forEach(counter => animateCounter(counter));
    }
  }

  /* ================= 11. Dynamic Current Year ================= */
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Utility
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

});