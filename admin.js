/**
 * Mostafa Aljabaly Portfolio - Admin Control Center Script
 * Authentication (Username + Password), Institution Management, LocalStorage CRUD, File Upload, and Synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY_AUTH = 'mostafa_admin_auth';
  const STORAGE_KEY_USER = 'mostafa_admin_user';
  const STORAGE_KEY_PASS = 'mostafa_admin_pass';
  const STORAGE_KEY_VIDEOS = 'mostafa_custom_videos';
  const STORAGE_KEY_PHOTOS = 'mostafa_custom_photos';
  const STORAGE_KEY_INSTITUTIONS = 'mostafa_known_institutions';

  const DEFAULT_USER = 'mostafa';
  const DEFAULT_PASS = 'mostafa2026';

  // Base list of verified institutions & schools
  const BASE_INSTITUTIONS = [
    { id: 'gaza-college', name: 'كلية ومدرسة غزة (تأسست 1942)', shortName: 'كلية ومدرسة غزة', logo: 'images/partners/logo-gaza-college.jpg', watermark: 'images/partners/logo-gaza-college-transparent.png' },
    { id: 'al-basma', name: 'مدرسة البسمة الحديثة', shortName: 'مدرسة البسمة الحديثة', logo: 'images/partners/logo-al-basma.jpg', watermark: 'images/partners/logo-al-basma-transparent.png' },
    { id: 'sadaqa', name: 'مؤسسة صدقة العالمية (Sadaqa Welfare Fund)', shortName: 'مؤسسة صدقة العالمية', logo: 'images/partners/logo-sadaqa.jpg', watermark: 'images/partners/logo-sadaqa-transparent.png' },
    { id: 'salam', name: 'جمعية سلام للإغاثة والتنمية', shortName: 'جمعية سلام للإغاثة والتنمية', logo: 'images/partners/logo-salam.jpg', watermark: 'images/partners/logo-salam-transparent.png' },
    { id: 'idrf', name: 'مؤسسة IDRF الكندية للإغاثة والتنمية', shortName: 'مؤسسة IDRF الكندية', logo: 'images/partners/logo-idrf.jpg', watermark: 'images/partners/logo-idrf-transparent.png' },
    { id: 'taawon', name: 'مؤسسة التعاون (Taawon)', shortName: 'مؤسسة التعاون', logo: 'images/partners/logo-taawon.jpg', watermark: 'images/partners/logo-taawon-transparent.png' },
    { id: 'ard-el-insan', name: 'جمعية أرض الإنسان - فلسطين (1984)', shortName: 'جمعية أرض الإنسان', logo: 'images/partners/logo-ard-el-insan.jpg', watermark: 'images/partners/logo-ard-el-insan-transparent.png' },
    { id: 'maan', name: "مركز العمل التنموي - معاً (MA'AN)", shortName: 'مركز العمل التنموي / معاً', logo: 'images/partners/logo-maan.jpg', watermark: 'images/partners/logo-maan-transparent.png' },
    { id: 'kharijat', name: 'جمعية الخريجات بقطاع غزة', shortName: 'جمعية الخريجات بقطاع غزة', logo: 'images/partners/logo-kharijat.jpg', watermark: 'images/partners/logo-kharijat-transparent.png' },
    { id: 'beit-lahia', name: 'جمعية تطوير بيت لاهيا', shortName: 'جمعية تطوير بيت لاهيا', logo: 'images/partners/logo-beit-lahia.jpg', watermark: 'images/partners/logo-beit-lahia-transparent.png' },
    { id: 'unicef', name: 'اليونيسف (UNICEF Palestine)', shortName: 'اليونيسف', logo: 'images/partners/unicef.svg', watermark: 'images/partners/unicef.svg' },
    { id: 'undp', name: 'برنامج الأمم المتحدة الإنمائي (UNDP)', shortName: 'برنامج الأمم المتحدة الإنمائي', logo: 'images/partners/undp.svg', watermark: 'images/partners/undp.svg' }
  ];

  /* ================= 1. Authentication Gate ================= */
  const lockScreen = document.getElementById('adminLockscreen');
  const lockForm = document.getElementById('lockForm');
  const lockUsername = document.getElementById('lockUsername');
  const lockPassword = document.getElementById('lockPassword');
  const lockError = document.getElementById('lockError');
  const btnLogout = document.getElementById('btnLogout');

  const getStoredUsername = () => {
    return localStorage.getItem(STORAGE_KEY_USER) || DEFAULT_USER;
  };

  const getStoredPassword = () => {
    return localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_PASS;
  };

  const isAuthenticated = () => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  };

  const unlockDashboard = () => {
    if (lockScreen) {
      lockScreen.classList.add('hidden');
    }
    // Update admin user indicator in UI
    const userTag = document.querySelector('.status-indicator');
    if (userTag && userTag.parentElement) {
      userTag.parentElement.innerHTML = `<span class="status-indicator"></span> متصل كمسؤول: <strong>${escapeHtml(getStoredUsername())}</strong>`;
    }
    const newUsernameInput = document.getElementById('newUsername');
    if (newUsernameInput) {
      newUsernameInput.value = getStoredUsername();
    }
    refreshStats();
    renderManageList();
  };

  const lockDashboard = () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    if (lockScreen) {
      lockScreen.classList.remove('hidden');
    }
    if (lockPassword) {
      lockPassword.value = '';
    }
  };

  // Check initial state
  if (isAuthenticated()) {
    unlockDashboard();
  } else {
    if (lockScreen) lockScreen.classList.remove('hidden');
  }

  // Handle Login Submit (Validates both Username and Password)
  if (lockForm) {
    lockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredUser = lockUsername ? lockUsername.value.trim() : '';
      const enteredPass = lockPassword ? lockPassword.value.trim() : '';

      const actualUser = getStoredUsername();
      const actualPass = getStoredPassword();

      if (enteredUser.toLowerCase() === actualUser.toLowerCase() && enteredPass === actualPass) {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        lockError?.classList.remove('show');
        unlockDashboard();
        showToast(`مرحباً بك يا ${actualUser}! تم تسجيل الدخول بنجاح 🎬`);
      } else {
        lockError?.classList.add('show');
        lockPassword?.focus();
        setTimeout(() => {
          lockError?.classList.remove('show');
        }, 4000);
      }
    });
  }

  // Handle Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('هل ترغب بتسجيل الخروج من لوحة التحكم؟')) {
        lockDashboard();
        showToast('تم تسجيل الخروج بنجاح 🔒');
      }
    });
  }

  /* ================= 2. Tabs Navigation ================= */
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ================= 3. Toast Notifications ================= */
  const toastElem = document.getElementById('adminToast');
  let toastTimer = null;

  window.showToast = function(msg) {
    if (!toastElem) return;
    toastElem.textContent = msg;
    toastElem.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElem.classList.remove('show');
    }, 3800);
  };

  /* ================= 4. LocalStorage Data Helpers ================= */
  function getCustomVideos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_VIDEOS)) || [];
    } catch {
      return [];
    }
  }

  function saveCustomVideos(items) {
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(items));
  }

  function getCustomPhotos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS)) || [];
    } catch {
      return [];
    }
  }

  function saveCustomPhotos(items) {
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(items));
  }

  function getCustomInstitutions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_INSTITUTIONS)) || [];
    } catch {
      return [];
    }
  }

  function saveCustomInstitutions(items) {
    localStorage.setItem(STORAGE_KEY_INSTITUTIONS, JSON.stringify(items));
  }

  function getAllInstitutions() {
    const custom = getCustomInstitutions();
    return [...BASE_INSTITUTIONS, ...custom];
  }

  function refreshStats() {
    const vCount = getCustomVideos().length;
    const pCount = getCustomPhotos().length;
    
    const countVideosElem = document.getElementById('countVideos');
    const countPhotosElem = document.getElementById('countPhotos');
    const countTotalElem = document.getElementById('countTotal');

    if (countVideosElem) countVideosElem.textContent = String(vCount + 6); // 6 core + custom
    if (countPhotosElem) countPhotosElem.textContent = String(pCount + 5); // 5 core + custom
    if (countTotalElem) countTotalElem.textContent = String(vCount + pCount);
  }

  /* ================= 5. Institution Selector Logic ================= */
  const modeExistingRadio = document.getElementById('modeExistingInst');
  const modeNewRadio = document.getElementById('modeNewInst');
  const existingInstGroup = document.getElementById('existingInstGroup');
  const newInstGroup = document.getElementById('newInstGroup');
  const existingInstSelect = document.getElementById('existingInstSelect');
  const selectedInstLogoImg = document.getElementById('selectedInstLogoImg');
  const selectedInstNameText = document.getElementById('selectedInstNameText');

  const newInstNameInput = document.getElementById('newInstName');
  const newInstLogoInput = document.getElementById('newInstLogoInput');
  const newInstPreviewBox = document.getElementById('newInstPreviewBox');
  const newInstPreviewImg = document.getElementById('newInstPreviewImg');
  const newInstPreviewName = document.getElementById('newInstPreviewName');

  let currentNewLogoData = null;

  function populateInstitutionsDropdown() {
    if (!existingInstSelect) return;
    const list = getAllInstitutions();
    existingInstSelect.innerHTML = '';

    list.forEach((inst, idx) => {
      const opt = document.createElement('option');
      opt.value = inst.id;
      opt.textContent = inst.name;
      opt.setAttribute('data-name', inst.shortName || inst.name);
      opt.setAttribute('data-logo', inst.logo);
      opt.setAttribute('data-wm', inst.watermark || inst.logo);
      if (idx === 0) opt.selected = true;
      existingInstSelect.appendChild(opt);
    });

    updateSelectedInstPreview();
  }

  function updateSelectedInstPreview() {
    if (!existingInstSelect) return;
    const opt = existingInstSelect.options[existingInstSelect.selectedIndex];
    if (opt) {
      const logo = opt.getAttribute('data-logo');
      const name = opt.getAttribute('data-name');
      if (selectedInstLogoImg) selectedInstLogoImg.src = logo;
      if (selectedInstNameText) selectedInstNameText.textContent = name;
    }
  }

  if (existingInstSelect) {
    existingInstSelect.addEventListener('change', updateSelectedInstPreview);
  }

  // Toggle Existing vs New Institution
  if (modeExistingRadio && modeNewRadio) {
    modeExistingRadio.addEventListener('change', () => {
      if (existingInstGroup) existingInstGroup.style.display = 'block';
      if (newInstGroup) newInstGroup.style.display = 'none';
    });

    modeNewRadio.addEventListener('change', () => {
      if (existingInstGroup) existingInstGroup.style.display = 'none';
      if (newInstGroup) newInstGroup.style.display = 'block';
    });
  }

  // Handle New Institution Logo Upload
  if (newInstLogoInput) {
    newInstLogoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح لشعار المؤسسة.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        currentNewLogoData = ev.target.result;
        if (newInstPreviewImg) newInstPreviewImg.src = currentNewLogoData;
        if (newInstPreviewName) {
          const typedName = (newInstNameInput && newInstNameInput.value.trim()) || file.name;
          newInstPreviewName.textContent = typedName;
        }
        if (newInstPreviewBox) newInstPreviewBox.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });
  }

  if (newInstNameInput) {
    newInstNameInput.addEventListener('input', () => {
      if (newInstPreviewName) {
        newInstPreviewName.textContent = newInstNameInput.value.trim() || 'اسم المؤسسة الجديدة';
      }
    });
  }

  // Initialize dropdown
  populateInstitutionsDropdown();

  /* ================= 6. Video Publishing Form ================= */
  const videoForm = document.getElementById('addVideoForm');

  if (videoForm) {
    videoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('videoTitle').value.trim();
      const url = document.getElementById('videoUrl').value.trim();
      const platform = document.getElementById('videoPlatform').value;
      const category = document.getElementById('videoCategory').value.trim() || 'إنتاج ومونتاج فيديو';
      const description = document.getElementById('videoDesc').value.trim();

      if (!title || !url) {
        alert('يرجى كتابة عنوان المشروع وإدخال رابط الفيديو.');
        return;
      }

      // Determine Institution details
      let instName = '';
      let instLogo = '';
      let instWatermark = '';

      const isNewMode = modeNewRadio && modeNewRadio.checked;

      if (isNewMode) {
        const newName = newInstNameInput ? newInstNameInput.value.trim() : '';
        if (!newName) {
          alert('يرجى إدخال اسم المؤسسة أو المدرسة الجديدة.');
          newInstNameInput?.focus();
          return;
        }
        if (!currentNewLogoData) {
          alert('يرجى رفع صورة شعار المؤسسة الجديدة.');
          newInstLogoInput?.focus();
          return;
        }

        instName = newName;
        instLogo = currentNewLogoData;
        instWatermark = currentNewLogoData;

        // Save to known institutions in LocalStorage for future selection
        const customInstList = getCustomInstitutions();
        const newInstObj = {
          id: 'inst_' + Date.now(),
          name: newName,
          shortName: newName,
          logo: currentNewLogoData,
          watermark: currentNewLogoData
        };
        customInstList.push(newInstObj);
        saveCustomInstitutions(customInstList);
        populateInstitutionsDropdown();
      } else {
        const opt = existingInstSelect ? existingInstSelect.options[existingInstSelect.selectedIndex] : null;
        if (opt) {
          instName = opt.getAttribute('data-name');
          instLogo = opt.getAttribute('data-logo');
          instWatermark = opt.getAttribute('data-wm') || instLogo;
        }
      }

      // Platform badge class
      let platformClass = 'ig';
      let platformLabel = 'Instagram Reel';
      if (platform === 'facebook') {
        platformClass = 'fb';
        platformLabel = 'Facebook Video';
      } else if (platform === 'youtube') {
        platformClass = 'yt';
        platformLabel = 'YouTube';
      } else if (platform === 'tiktok') {
        platformClass = 'tk';
        platformLabel = 'TikTok Video';
      } else if (platform === 'vimeo') {
        platformClass = 'vm';
        platformLabel = 'Vimeo';
      } else if (platform === 'drive') {
        platformClass = 'drv';
        platformLabel = 'Direct Link';
      }

      const newVideo = {
        id: 'v_' + Date.now(),
        type: 'video',
        title,
        url,
        platform,
        platformLabel,
        platformClass,
        category,
        description,
        institutionName: instName,
        institutionLogo: instLogo,
        institutionWatermark: instWatermark,
        createdAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
      };

      const videos = getCustomVideos();
      videos.unshift(newVideo);
      saveCustomVideos(videos);

      videoForm.reset();
      currentNewLogoData = null;
      if (newInstPreviewBox) newInstPreviewBox.style.display = 'none';
      if (modeExistingRadio) modeExistingRadio.checked = true;
      if (existingInstGroup) existingInstGroup.style.display = 'block';
      if (newInstGroup) newInstGroup.style.display = 'none';

      updateSelectedInstPreview();
      refreshStats();
      renderManageList();
      showToast(`تم نشر الفيديو "${title}" بالتعاون مع ${instName || 'المؤسسة'} بنجاح! 🚀`);
    });
  }

  /* ================= 7. Photo Upload & Publishing Form ================= */
  const photoForm = document.getElementById('addPhotoForm');
  const photoFileInput = document.getElementById('photoFileInput');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const imagePreviewImg = document.getElementById('imagePreviewImg');
  const imagePreviewName = document.getElementById('imagePreviewName');
  const btnRemovePreview = document.getElementById('btnRemovePreview');

  let currentImageData = null;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentImageData = e.target.result;
      if (imagePreviewImg) imagePreviewImg.src = currentImageData;
      if (imagePreviewName) imagePreviewName.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      if (imagePreviewBox) imagePreviewBox.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  };

  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // Drag and Drop
  if (uploadDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('dragover');
      }, false);
    });

    uploadDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files && dt.files[0]) {
        handleFile(dt.files[0]);
      }
    });
  }

  // Remove preview
  if (btnRemovePreview) {
    btnRemovePreview.addEventListener('click', () => {
      currentImageData = null;
      if (photoFileInput) photoFileInput.value = '';
      if (imagePreviewBox) imagePreviewBox.classList.remove('has-image');
      if (imagePreviewImg) imagePreviewImg.src = '';
    });
  }

  // Handle Photo Form Submit
  if (photoForm) {
    photoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!currentImageData) {
        alert('يرجى اختيار صورة من جهازك أولاً.');
        return;
      }

      const title = document.getElementById('photoTitle').value.trim();
      const category = document.getElementById('photoCategory').value.trim() || 'تصوير فوتوغرافي ميداني';
      const description = document.getElementById('photoDesc').value.trim();

      if (!title) {
        alert('يرجى كتابة عنوان العمل الفوتوغرافي.');
        return;
      }

      const newPhoto = {
        id: 'p_' + Date.now(),
        type: 'photo',
        title,
        imageData: currentImageData,
        category,
        description,
        createdAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
      };

      const photos = getCustomPhotos();
      photos.unshift(newPhoto);
      saveCustomPhotos(photos);

      photoForm.reset();
      currentImageData = null;
      if (imagePreviewBox) imagePreviewBox.classList.remove('has-image');
      if (photoFileInput) photoFileInput.value = '';

      refreshStats();
      renderManageList();
      showToast(`تم نشر الصورة "${title}" بنجاح في المعرض! 📸`);
    });
  }

  /* ================= 8. Manage & Delete Published Items ================= */
  const manageItemsList = document.getElementById('manageItemsList');

  function renderManageList() {
    if (!manageItemsList) return;

    const videos = getCustomVideos();
    const photos = getCustomPhotos();
    const allCustom = [...videos, ...photos];

    if (allCustom.length === 0) {
      manageItemsList.innerHTML = `
        <div class="empty-state">
          <span>📂</span>
          <h4>لا توجد أعمال مضافة حديثاً</h4>
          <p>الأعمال الأصلية (6 فيديوهات + 5 صور) منشورة وثابتة على الموقع. عند إضافتك لأي عمل جديد سيظهر هنا ويمكنك إدارته أو حذفه في أي وقت.</p>
        </div>
      `;
      return;
    }

    let html = '';
    allCustom.forEach(item => {
      if (item.type === 'video') {
        html += `
          <div class="item-row" data-id="${item.id}">
            <div class="item-row-main">
              <div class="item-thumb">
                ${item.institutionLogo ? `<img src="${item.institutionLogo}" alt="" style="width: 100%; height: 100%; object-fit: contain; background: #fff; border-radius: 6px; padding: 2px;">` : `<span class="item-thumb-video">🎬</span>`}
              </div>
              <div class="item-details">
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.description || item.category)}</p>
                <div class="item-meta-pills">
                  ${item.institutionName ? `<span class="item-pill" style="color: var(--gold); border-color: var(--border-gold);">🏛️ ${escapeHtml(item.institutionName)}</span>` : ''}
                  <span class="item-pill">فيديو / ${escapeHtml(item.platformLabel || 'Online')}</span>
                  <span class="item-pill">${escapeHtml(item.createdAt)}</span>
                </div>
              </div>
            </div>
            <div class="item-row-actions">
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="admin-action-btn btn-view-site">
                مشاهدة الرابط ↗
              </a>
              <button type="button" class="btn-action-delete" onclick="deleteItem('${item.id}', 'video')">
                حذف 🗑️
              </button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="item-row" data-id="${item.id}">
            <div class="item-row-main">
              <div class="item-thumb">
                <img src="${item.imageData}" alt="${escapeHtml(item.title)}">
              </div>
              <div class="item-details">
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.description || item.category)}</p>
                <div class="item-meta-pills">
                  <span class="item-pill">صورة فوتوغرافية</span>
                  <span class="item-pill">${escapeHtml(item.createdAt)}</span>
                </div>
              </div>
            </div>
            <div class="item-row-actions">
              <button type="button" class="btn-action-delete" onclick="deleteItem('${item.id}', 'photo')">
                حذف 🗑️
              </button>
            </div>
          </div>
        `;
      }
    });

    manageItemsList.innerHTML = html;
  }

  // Global delete handler
  window.deleteItem = function(id, type) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا العمل نهائياً من المعرض؟')) {
      return;
    }

    if (type === 'video') {
      let videos = getCustomVideos();
      videos = videos.filter(v => v.id !== id);
      saveCustomVideos(videos);
    } else {
      let photos = getCustomPhotos();
      photos = photos.filter(p => p.id !== id);
      saveCustomPhotos(photos);
    }

    refreshStats();
    renderManageList();
    showToast('تم حذف العمل بنجاح من المعرض.');
  };

  /* ================= 9. Security & Credentials Settings ================= */
  // Update Username and Password Form
  const formChangeCreds = document.getElementById('formChangeCreds');
  if (formChangeCreds) {
    formChangeCreds.addEventListener('submit', (e) => {
      e.preventDefault();
      const newU = document.getElementById('newUsername').value.trim();
      const current = document.getElementById('currPass').value.trim();
      const newP = document.getElementById('newPass').value.trim();
      const confirmP = document.getElementById('confirmNewPass').value.trim();

      const actualPass = getStoredPassword();

      if (current !== actualPass) {
        alert('كلمة المرور الحالية غير صحيحة. يرجى التأكد منها.');
        return;
      }

      if (!newU) {
        alert('يرجى إدخال اسم المستخدم الجديد.');
        return;
      }

      if (newP.length < 4) {
        alert('يرجى اختيار كلمة مرور جديدة لا تقل عن 4 خانات.');
        return;
      }

      if (newP !== confirmP) {
        alert('كلمة المرور الجديدة غير متطابقة مع خانة التأكيد.');
        return;
      }

      // Save to Database (LocalStorage permanent persistence)
      localStorage.setItem(STORAGE_KEY_USER, newU);
      localStorage.setItem(STORAGE_KEY_PASS, newP);

      document.getElementById('currPass').value = '';
      document.getElementById('newPass').value = '';
      document.getElementById('confirmNewPass').value = '';

      unlockDashboard();
      showToast(`تم تحديث اسم المستخدم إلى "${newU}" وكلمة المرور بنجاح! 🔒`);
    });
  }

  // Export JSON Backup
  const btnExportBackup = document.getElementById('btnExportBackup');
  if (btnExportBackup) {
    btnExportBackup.addEventListener('click', () => {
      const backupData = {
        version: '1.2',
        exportedAt: new Date().toISOString(),
        username: getStoredUsername(),
        institutions: getCustomInstitutions(),
        videos: getCustomVideos(),
        photos: getCustomPhotos()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mostafa_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('تم تحميل ملف النسخة الاحتياطية بنجاح 💾');
    });
  }

  // Import JSON Backup
  const backupFileInput = document.getElementById('backupFileInput');
  if (backupFileInput) {
    backupFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && (Array.isArray(imported.videos) || Array.isArray(imported.photos))) {
            if (imported.videos) saveCustomVideos(imported.videos);
            if (imported.photos) saveCustomPhotos(imported.photos);
            if (imported.institutions) saveCustomInstitutions(imported.institutions);
            if (imported.username) localStorage.setItem(STORAGE_KEY_USER, imported.username);
            refreshStats();
            renderManageList();
            populateInstitutionsDropdown();
            showToast('تمت استعادة النسخة الاحتياطية بنجاح! 🔄');
          } else {
            alert('الملف غير متوافق. تأكد من أنه ملف نسخة احتياطية صالح.');
          }
        } catch (err) {
          alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
        }
      };
      reader.readAsText(file);
    });
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
