(function () {
  const page = document.body;

  if (!page || page.dataset.page !== 'video') return;

  const select = document.querySelector('[data-video-type-select]');
  const trigger = document.querySelector('[data-video-type-trigger]');
  const menu = document.querySelector('[data-video-type-menu]');
  const value = document.querySelector('[data-video-type-value]');
  const options = document.querySelectorAll('[data-video-type]');
  const uploadGrid = document.querySelector('[data-upload-grid]');
  const uploadTitle = document.querySelector('[data-upload-title]');
  const description = document.querySelector('[data-video-description]');
  const toast = document.querySelector('[data-video-toast]');
  const modelButtons = document.querySelectorAll('[data-video-model]');
  const toggleGroups = document.querySelectorAll('[data-video-toggle-group]');

  if (!select || !trigger || !menu || !value || !uploadGrid || !uploadTitle || !description) return;

  const text = {
    singleType: '\u5355\u56fe\u89c6\u9891',
    doubleType: '\u9996\u5c3e\u5e27\u89c6\u9891',
    singleTitle: '\u4e0a\u4f20\u5e95\u56fe\uff08\u5fc5\u586b\uff09',
    doubleTitle: '\u4e0a\u4f20\u56fe\u7247\uff08\u5fc5\u586b\uff09',
    uploadMain: '\u4e0a\u4f20\u4e3b\u56fe',
    uploadStart: '\u4e0a\u4f20\u9996\u5e27\u56fe\u7247',
    uploadEnd: '\u4e0a\u4f20\u5c3e\u5e27\u56fe\u7247',
    uploadTip: '\u8bf7\u4e0a\u4f20\u9ad8\u6e05\u7684\u56fe\u7247\uff0c\u6e05\u6670\u5ea6\u4f1a\u5f71\u54cd\u6700\u7ec8\u6548\u679c',
    previewAlt: '\u4e0a\u4f20\u9884\u89c8',
    singlePlaceholder: '\u8bf7\u4f7f\u7528\u4e2d\u6587\u63cf\u8ff0\uff0c\u955c\u5934\u8fd0\u52a8\u3001\u4e3b\u4f53\u5173\u7cfb\u548c\u753b\u9762\u6c1b\u56f4\u8d8a\u6e05\u6670\uff0c\u6700\u7ec8\u6548\u679c\u8d8a\u7a33\u5b9a\u3002',
    doublePlaceholder: '\u8bf7\u4f7f\u7528\u4e2d\u6587\u63cf\u8ff0\uff0c\u9996\u5c3e\u5e27\u5c3d\u91cf\u5305\u542b\u76f8\u540c\u4e3b\u4f53\uff0c\u5e76\u7528\u6587\u5b57\u63cf\u8ff0\u4e24\u5f20\u56fe\u7247\u4e4b\u95f4\u5982\u4f55\u8fc7\u6e21\uff0c500\u5b57\u4ee5\u5185',
    switchedTo: '\u5df2\u4e3a\u4f60\u5207\u6362\u5230 '
  };

  const uploadSets = {
    single: [
      { title: text.uploadMain, tip: text.uploadTip }
    ],
    double: [
      { title: text.uploadStart, tip: text.uploadTip },
      { title: text.uploadEnd, tip: text.uploadTip }
    ]
  };

  const placeholders = {
    single: text.singlePlaceholder,
    double: text.doublePlaceholder
  };

  const closeMenu = function () {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const showToast = function (message) {
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;
    toast.classList.remove('is-visible');
    void toast.offsetWidth;
    toast.classList.add('is-visible');

    window.setTimeout(function () {
      toast.hidden = true;
      toast.classList.remove('is-visible');
    }, 2100);
  };

  const bindUploadCard = function (button) {
    const input = button.querySelector('input[type="file"]');
    const preview = button.querySelector('.video-upload-card__preview');
    const title = button.querySelector('strong');

    if (!input || !preview || !title) return;

    button.addEventListener('click', function () {
      input.click();
    });

    input.addEventListener('change', function () {
      const file = input.files && input.files[0];

      if (!file) return;

      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
      button.classList.add('has-image');
      title.textContent = file.name;
    });
  };

  const renderUploadCards = function (type) {
    const items = uploadSets[type];

    uploadGrid.innerHTML = '';
    uploadGrid.classList.toggle('is-double', items.length === 2);

    items.forEach(function (item) {
      const button = document.createElement('button');
      button.className = 'video-upload-card';
      button.type = 'button';
      button.innerHTML =
        '<input class="video-upload-card__input" type="file" accept="image/*" hidden>' +
        '<span class="video-upload-card__plus">+</span>' +
        '<strong>' + item.title + '</strong>' +
        '<span>' + item.tip + '</span>' +
        '<img class="video-upload-card__preview" alt="' + text.previewAlt + '" hidden>';

      uploadGrid.appendChild(button);
      bindUploadCard(button);
    });
  };

  const applyVideoType = function (type) {
    const isDouble = type === 'double';

    value.textContent = isDouble ? text.doubleType : text.singleType;
    uploadTitle.textContent = isDouble ? text.doubleTitle : text.singleTitle;
    description.placeholder = placeholders[type];

    options.forEach(function (option) {
      option.classList.toggle('is-selected', option.dataset.videoType === type);
    });

    renderUploadCards(type);
  };

  trigger.addEventListener('click', function () {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    menu.hidden = expanded;
    trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      applyVideoType(option.dataset.videoType);
      closeMenu();
    });
  });

  document.addEventListener('click', function (event) {
    if (!select.contains(event.target)) {
      closeMenu();
    }
  });

  modelButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      modelButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });

      showToast(text.switchedTo + button.textContent);
    });
  });

  toggleGroups.forEach(function (group) {
    const buttons = group.querySelectorAll('.video-chip');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
      });
    });
  });

  applyVideoType('single');
})();
