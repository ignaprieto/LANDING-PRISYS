const projectData = {
  'erp-ventas': {
    title: 'ERP de Ventas Moderno',
    desc: 'Sistema integral de gestion de ventas, stock e inventario con reportes avanzados.',
    images: [
      'proyectos/ERP VENTAS/image1.webp',
      'proyectos/ERP VENTAS/image2.webp',
      'proyectos/ERP VENTAS/image3.webp',
      'proyectos/ERP VENTAS/image4.webp',
      'proyectos/ERP VENTAS/image5.webp'
    ]
  },
  carniceria: {
    title: 'Gestion de Carnicerias',
    desc: 'Software especializado para el control de stock, pesaje y ventas en carnicerias.',
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
    title: 'ECM Chip Reprogramacion',
    desc: 'Plataforma tecnica para la gestion de servicios de reprogramacion de ECUs y chips automotrices.',
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
    title: 'MD Estetica y Salud',
    desc: 'Sistema de turnos, historia clinica digital y gestion de pacientes para centros de estetica.',
    images: [
      'proyectos/MD ESTETICA/image1.webp',
      'proyectos/MD ESTETICA/image2.webp',
      'proyectos/MD ESTETICA/image3.webp',
      'proyectos/MD ESTETICA/image4.webp',
      'proyectos/MD ESTETICA/image5.webp'
    ]
  }
};

export function initProjectModal() {
  if (window.__prisysModalInitialized) return;
  window.__prisysModalInitialized = true;

  const body = document.body;
  const modal = document.getElementById('projectModal');
  if (!modal) return;

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
  const modalBody = modal.querySelector('.modal-body');

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

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
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
      img.addEventListener('click', (event) => {
        event.stopPropagation();
        img.classList.toggle('zoomed');
      });
      item.appendChild(img);
      modalGallery.appendChild(item);
    });

    updateSlider();
    modal.classList.add('open');
    body.style.overflow = 'hidden';
    if (modalBody) modalBody.scrollTop = 0;
  };

  const closeModal = () => {
    modal.classList.remove('open');
    body.style.overflow = '';
  };

  window.addEventListener('prisys:open-project-modal', (event) => {
    openModal(event.detail?.projectId);
  });

  if (galleryPrev) {
    galleryPrev.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!totalImages) return;
      currentImgIndex = (currentImgIndex - 1 + totalImages) % totalImages;
      updateSlider();
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!totalImages) return;
      currentImgIndex = (currentImgIndex + 1) % totalImages;
      updateSlider();
    });
  }

  modalClose?.addEventListener('click', closeModal);
  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}
