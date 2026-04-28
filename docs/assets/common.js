(function () {
  const HOME_PROMPT_KEY = 'jike_ai_home_prompt';
  const page = document.body.dataset.page;
  const isHome = page === 'home';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.classList.add('active');
  });

  const toTop = document.querySelector('.floating-btn');
  if (toTop) {
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const setupAccountWidgets = function () {
    const navRight = document.querySelector('.nav-right');
    if (!navRight || navRight.dataset.accountReady === 'true') return;

    const pills = navRight.querySelectorAll('.pill');
    const coinPill = pills[0];
    const userPill = pills[1];
    if (!coinPill || !userPill) return;

    const userId = '135930191007232';
    const userName = 'wx135930191007232';
    const shortName = 'wx135930...';
    const coinCount = (coinPill.textContent.match(/\d+/) || ['120'])[0];

    navRight.dataset.accountReady = 'true';
    coinPill.classList.add('app-coin-pill');
    coinPill.setAttribute('role', 'button');
    coinPill.setAttribute('tabindex', '0');
    coinPill.innerHTML =
      '<span class="coin-dot">◎</span>' +
      '<span class="app-coin-count">' + coinCount + '</span>' +
      '<span class="app-coin-split"></span>' +
      '<span class="app-coin-vip">VIP</span>';

    const userWrap = document.createElement('div');
    userWrap.className = 'app-user-wrap';
    userPill.parentNode.insertBefore(userWrap, userPill);
    userWrap.appendChild(userPill);
    userPill.classList.add('app-user-pill');
    userPill.setAttribute('role', 'button');
    userPill.setAttribute('tabindex', '0');
    userPill.innerHTML = '<span class="app-avatar">集</span><span class="app-user-name">' + shortName + '</span>';

    const menu = document.createElement('div');
    menu.className = 'app-user-menu';
    menu.innerHTML =
      '<button type="button" data-account-action="profile"><span class="app-menu-icon">♡</span><span>个人中心</span></button>' +
      '<button type="button" data-account-action="benefit"><span class="app-menu-icon">♔</span><span>桌面端权益</span><i class="app-menu-dot"></i></button>' +
      '<button type="button" data-account-action="history"><span class="app-menu-icon">◇</span><span>生成历史</span></button>' +
      '<button type="button" data-account-action="logout"><span class="app-menu-icon">↪</span><span>退出登录</span></button>';
    userWrap.appendChild(menu);

    const ensureModal = function (id, markup) {
      let modal = document.getElementById(id);
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = id;
      modal.className = 'app-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = markup;
      document.body.appendChild(modal);
      return modal;
    };

    const profileModal = ensureModal('appProfileModal',
      '<div class="app-modal__panel" role="dialog" aria-modal="true" aria-labelledby="appProfileTitle">' +
        '<div class="app-modal__head"><h3 id="appProfileTitle">个人信息</h3><button class="app-modal__close" type="button" data-modal-close aria-label="关闭">×</button></div>' +
        '<div class="app-modal__body">' +
          '<div class="app-profile-avatar">集</div>' +
          '<div class="app-field"><label>用户ID</label><div class="app-input-row"><div class="app-readonly">' + userId + '</div><button class="app-copy-btn" type="button" data-copy-user aria-label="复制用户ID">⧉</button></div></div>' +
          '<div class="app-field"><label>昵称</label><div class="app-readonly">' + userName + '</div></div>' +
          '<div class="app-field"><label>手机号</label><button class="app-bind-btn" type="button">去绑定</button></div>' +
          '<div class="app-field"><span class="app-vip-title">VIP信息</span><div class="app-vip-card"><div class="app-vip-line"><span>会员类型:</span><strong>普通用户</strong></div><div class="app-vip-line"><span>剩余金币:</span><strong class="app-vip-coin">' + coinCount + ' <span class="coin-dot">◎</span></strong></div></div></div>' +
        '</div>' +
        '<div class="app-modal__foot"><button class="app-ghost-btn" type="button" data-modal-close>取消</button><button class="app-primary-btn" type="button" data-modal-close>保存</button></div>' +
      '</div>');

    const coinModal = ensureModal('appCoinModal',
      '<div class="app-modal__panel app-coin-panel" role="dialog" aria-modal="true" aria-labelledby="appCoinTitle">' +
        '<div class="app-modal__head"><h3 id="appCoinTitle">金币详情</h3><button class="app-modal__close" type="button" data-modal-close aria-label="关闭">×</button></div>' +
        '<div class="app-modal__body">' +
          '<section class="app-account-card">' +
            '<div class="app-account-main"><span class="app-avatar">集</span><div><strong>' + userName + '</strong><span>免费用户</span></div></div>' +
            '<div class="app-account-actions"><button class="app-small-btn" type="button">金币详情</button><button class="app-small-btn" type="button">购买金币</button></div>' +
            '<div class="app-account-stats"><div><span>会员类型</span><strong>免费用户</strong></div><div><span>到期时间</span><strong>-</strong></div><div><span>剩余金币</span><strong class="app-vip-coin">' + coinCount + ' <span class="coin-dot">◎</span></strong></div></div>' +
          '</section>' +
          '<h2 class="app-coin-title">年会员限时5折，折合24.9元/月，1周后恢复原价</h2>' +
          '<div class="app-plan-tabs"><button class="is-active" type="button">按年购买</button><button type="button">单月购买</button><button type="button">永久会员</button></div>' +
          '<div class="app-plan-grid">' +
            '<article class="app-plan-card"><h4>免费</h4><div class="app-price">￥<strong>0</strong><span>/ 每年</span></div><button class="app-ghost-btn" type="button">当前套餐</button><ul><li>每天赠送金币</li><li>图片有水印</li><li>无其他权益</li></ul></article>' +
            '<article class="app-plan-card"><h4>普通会员</h4><div class="app-price">￥<strong>299</strong><span>/ 每年</span></div><button class="app-primary-btn" type="button">立即订阅</button><ul><li>每月累计可获得 1,900 金币</li><li>限时赠送桌面端 1 年激活码</li><li>支持 2k/3k/4k 生图</li></ul></article>' +
            '<article class="app-plan-card"><h4>超级会员</h4><div class="app-price">￥<strong>599</strong><span>/ 每年</span></div><button class="app-primary-btn" type="button">立即订阅</button><ul><li>每月累计可获得 5,000 金币</li><li>限时赠送桌面端 1 年激活码</li><li>更多视频与 3D 模型额度</li></ul></article>' +
          '</div>' +
        '</div>' +
      '</div>');

    const openModal = function (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const close = modal.querySelector('[data-modal-close]');
      if (close) close.focus();
    };

    const closeModal = function (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.addEventListener('click', function (event) {
      const modal = event.target.closest('.app-modal');
      if (!modal) return;
      if (event.target === modal || event.target.closest('[data-modal-close]')) {
        closeModal(modal);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        document.querySelectorAll('.app-modal.is-open').forEach(closeModal);
        userWrap.classList.remove('is-open');
      }
    });

    userPill.addEventListener('click', function () {
      userWrap.classList.toggle('is-open');
    });

    document.addEventListener('click', function (event) {
      if (!userWrap.contains(event.target)) userWrap.classList.remove('is-open');
    });

    menu.addEventListener('click', function (event) {
      const action = event.target.closest('[data-account-action]');
      if (!action) return;
      userWrap.classList.remove('is-open');
      if (action.dataset.accountAction === 'profile') openModal(profileModal);
      if (action.dataset.accountAction === 'benefit') openModal(coinModal);
      if (action.dataset.accountAction === 'history') window.location.href = 'workflow.html';
      if (action.dataset.accountAction === 'logout') alert('已退出登录');
    });

    coinPill.addEventListener('click', function () {
      openModal(coinModal);
    });

    [coinPill, userPill].forEach(function (trigger) {
      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trigger.click();
        }
      });
    });

    const copyButton = profileModal.querySelector('[data-copy-user]');
    if (copyButton) {
      copyButton.addEventListener('click', function () {
        if (navigator.clipboard) navigator.clipboard.writeText(userId);
        copyButton.textContent = '✓';
        window.setTimeout(function () {
          copyButton.textContent = '⧉';
        }, 1200);
      });
    }
  };

  setupAccountWidgets();

  const homeForm = document.querySelector('[data-home-form]');
  const homePrompt = document.querySelector('[data-home-prompt]');
  const storeHomePrompt = function () {
    if (!homePrompt) return '';
    const prompt = homePrompt.value.trim() || homePrompt.placeholder.trim();

    if (!homePrompt.value.trim()) {
      homePrompt.value = prompt;
    }

    sessionStorage.setItem(HOME_PROMPT_KEY, prompt);
    return prompt;
  };

  if (homeForm && homePrompt) {
    homeForm.addEventListener('submit', function () {
      storeHomePrompt();
    });
  }

  document.querySelectorAll('.control-select').forEach(dropdown => {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const menu = dropdown.querySelector('[data-dropdown-menu]');
    const value = dropdown.querySelector('[data-dropdown-value]');
    const options = dropdown.querySelectorAll('[data-model-option]');

    if (!trigger || !menu || !value || !options.length) return;

    const closeMenu = function () {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    const openMenu = function () {
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    };

    trigger.addEventListener('click', function () {
      if (dropdown.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    options.forEach(option => {
      option.addEventListener('click', function () {
        const selected = option.dataset.modelOption;
        value.textContent = selected;

        options.forEach(item => {
          const active = item === option;
          item.classList.toggle('is-selected', active);
          item.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        closeMenu();
      });
    });

    document.addEventListener('click', function (event) {
      if (!dropdown.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  });

  const userBubble = document.querySelector('[data-chat-user-bubble]');
  const chatThread = document.querySelector('[data-chat-thread]');
  const chatComposer = document.querySelector('[data-chat-composer]');
  const chatSend = document.querySelector('[data-chat-send]');
  const currentHistory = document.querySelector('[data-chat-current-history]');

  const buildAssistantReply = function (prompt) {
    if (/官网|首页|改版|页面|网站/.test(prompt)) {
      return '收到。我会先从首页结构、首屏信息层级和转化入口三部分帮你拆开，再给你一版更适合营销获客场景的页面建议。';
    }

    if (/海报|封面|主图|配图|商品图/.test(prompt)) {
      return '可以。我会先按场景、卖点和视觉风格整理生成方向，再给你适合投放和社媒传播的内容建议。';
    }

    if (/视频|脚本|口播/.test(prompt)) {
      return '明白。我会从开头钩子、核心卖点、镜头节奏和结尾转化四段帮你整理成可直接使用的视频结构。';
    }

    if (/企业|定制|方案|工作流/.test(prompt)) {
      return '好的。我会先围绕业务目标、团队角色和交付方式帮你梳理企业定制方案，再继续细化页面结构和能力模块。';
    }

    return '收到，我会先帮你梳理问题重点，再继续给出更适合营销获客场景的可执行建议。';
  };

  const createUserRow = function (text) {
    const row = document.createElement('div');
    row.className = 'chat-row chat-row--user';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--user';
    bubble.textContent = text;

    row.appendChild(bubble);
    return row;
  };

  const createAssistantRow = function (text) {
    const row = document.createElement('div');
    row.className = 'chat-row chat-row--assistant';

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = 'AI';

    const response = document.createElement('div');
    response.className = 'chat-response';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--assistant';

    const title = document.createElement('h2');
    title.textContent = '收到你的问题。';

    const paragraph = document.createElement('p');
    paragraph.textContent = text;

    bubble.appendChild(title);
    bubble.appendChild(paragraph);

    const actions = document.createElement('div');
    actions.className = 'chat-response__actions';

    ['继续追问', '复制内容'].forEach(function (label) {
      const action = document.createElement('button');
      action.className = 'response-action';
      action.type = 'button';
      action.textContent = label;
      actions.appendChild(action);
    });

    response.appendChild(bubble);
    response.appendChild(actions);

    row.appendChild(avatar);
    row.appendChild(response);

    return row;
  };

  const scrollChatToBottom = function () {
    if (!chatThread) return;
    requestAnimationFrame(function () {
      chatThread.scrollIntoView({ block: 'end', behavior: 'smooth' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  };

  const sendChatMessage = function () {
    if (!chatThread || !chatComposer) return;

    const prompt = chatComposer.value.trim();

    if (!prompt) {
      chatComposer.focus();
      return;
    }

    chatThread.appendChild(createUserRow(prompt));
    chatThread.appendChild(createAssistantRow(buildAssistantReply(prompt)));

    if (currentHistory) {
      currentHistory.textContent = prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt;
    }

    chatComposer.value = '';
    chatComposer.focus();
    scrollChatToBottom();
  };

  if (userBubble) {
    const params = new URLSearchParams(window.location.search);
    const queryPrompt = params.get('prompt');
    const storedPrompt = sessionStorage.getItem(HOME_PROMPT_KEY);
    const prompt = (queryPrompt || storedPrompt || '').trim();

    if (prompt) {
      userBubble.textContent = prompt;

      if (chatComposer) {
        chatComposer.value = '';
      }

      if (currentHistory) {
        currentHistory.textContent = prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt;
      }

      sessionStorage.removeItem(HOME_PROMPT_KEY);
    }
  }

  if (chatComposer && chatSend) {
    chatSend.addEventListener('click', sendChatMessage);
    chatComposer.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
      }
    });
  }

  const createHomeSuggestions = function (promptBox) {
    const layer = document.createElement('div');
    layer.className = 'prompt-suggestions';
    layer.hidden = true;
    layer.setAttribute('aria-hidden', 'true');
    promptBox.appendChild(layer);
    return layer;
  };

  const createPromptStatus = function (promptTop) {
    const status = document.createElement('div');
    status.className = 'prompt-status';
    status.setAttribute('aria-live', 'polite');
    promptTop.appendChild(status);
    return status;
  };

  const setupHomeHeader = function () {
    const header = document.querySelector('.header');
    if (!header) return;

    const updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 28);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  const setupHeroParallax = function () {
    const hero = document.querySelector('.hero-home');
    const promptBox = document.querySelector('.prompt-box');
    if (!hero || !promptBox) return;

    let rafId = null;

    const updatePointer = function (clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

      hero.style.setProperty('--hero-shift-x', x * 18 + 'px');
      hero.style.setProperty('--hero-shift-y', y * 16 + 'px');
      hero.style.setProperty('--hero-glow-x', clientX - rect.left + 'px');
      hero.style.setProperty('--hero-glow-y', clientY - rect.top + 'px');

      const promptRect = promptBox.getBoundingClientRect();
      const promptX = ((clientX - promptRect.left) / promptRect.width) * 100;
      const promptY = ((clientY - promptRect.top) / promptRect.height) * 100;

      promptBox.style.setProperty('--prompt-glow-x', Math.max(0, Math.min(100, promptX)) + '%');
      promptBox.style.setProperty('--prompt-glow-y', Math.max(0, Math.min(100, promptY)) + '%');
    };

    hero.addEventListener('mousemove', function (event) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        updatePointer(event.clientX, event.clientY);
      });
    });

    hero.addEventListener('mouseleave', function () {
      hero.style.setProperty('--hero-shift-x', '0px');
      hero.style.setProperty('--hero-shift-y', '0px');
      hero.style.setProperty('--hero-glow-x', '50%');
      hero.style.setProperty('--hero-glow-y', '56%');
      promptBox.style.setProperty('--prompt-glow-x', '50%');
      promptBox.style.setProperty('--prompt-glow-y', '42%');
    });
  };

  const setupInteractiveTilt = function (selector, options) {
    const settings = Object.assign({ max: 5, scale: 1.015 }, options || {});

    document.querySelectorAll(selector).forEach(card => {
      const image = card.querySelector('img');

      const reset = function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--card-scale', '1');
        if (image) {
          image.style.setProperty('--media-scale', '1');
        }
      };

      card.addEventListener('mousemove', function (event) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * settings.max * 2;
        const rotateX = (0.5 - py) * settings.max * 2;

        card.style.setProperty('--tilt-x', rotateX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', rotateY.toFixed(2) + 'deg');
        card.style.setProperty('--card-scale', String(settings.scale));

        if (image) {
          image.style.setProperty('--media-scale', '1.06');
        }
      });

      card.addEventListener('mouseleave', reset);
      reset();
    });
  };

  const setupScrollReveal = function () {
    const targets = [];

    document.querySelectorAll('.home-industry, .home-service, .home-products, .home-learning, .home-learning-showcase').forEach(section => {
      const heading = section.querySelector('.home-section-head, .industry-board__head, .learning-showcase-head');
      const cards = section.querySelectorAll('.industry-card, .product-card, .learning-stat, .learning-video-tile, .gallery-card, .service-panel, .service-panel__copy > *');

      if (heading) targets.push(heading);
      cards.forEach((card, index) => {
        card.style.setProperty('--reveal-delay', Math.min(index * 60, 360) + 'ms');
        targets.push(card);
      });
    });

    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach(function (target) {
      if (!target) return;
      target.classList.add('reveal-item');
      observer.observe(target);
    });
  };

  const setupPromptEnhancements = function () {
    const promptBox = document.querySelector('.prompt-box');
    const promptTop = document.querySelector('.prompt-top');
    const generateButton = document.querySelector('[data-home-generate]');
    if (!homeForm || !homePrompt || !promptBox || !promptTop || !generateButton) return;

    const hints = [
      'AI 正在理解你的需求…',
      '正在组织最佳提示路径…',
      '正在生成营销策略入口…'
    ];

    const suggestions = [
      '帮我生成一版电商主图海报',
      '给我一套品牌招商落地页文案',
      '生成短视频口播脚本',
      '做一版企业AI官网首页结构',
      '帮我写一个营销活动页面'
    ];

    const suggestionsLayer = createHomeSuggestions(promptBox);
    const status = createPromptStatus(promptTop);
    let thinkingLock = false;
    let typingTimer = null;

    const closeSuggestions = function () {
      promptBox.classList.remove('has-suggestions');
      suggestionsLayer.hidden = true;
      suggestionsLayer.setAttribute('aria-hidden', 'true');
      suggestionsLayer.innerHTML = '';
    };

    const openSuggestions = function (items) {
      if (!items.length) {
        closeSuggestions();
        return;
      }

      suggestionsLayer.innerHTML = '';
      items.forEach(function (text) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'prompt-suggestion';
        button.textContent = text;
        button.addEventListener('click', function () {
          homePrompt.value = text;
          homePrompt.dispatchEvent(new Event('input', { bubbles: true }));
          closeSuggestions();
          homePrompt.focus();
        });
        suggestionsLayer.appendChild(button);
      });

      promptBox.classList.add('has-suggestions');
      suggestionsLayer.hidden = false;
      suggestionsLayer.setAttribute('aria-hidden', 'false');
    };

    const updatePromptState = function () {
      const value = homePrompt.value.trim();
      promptBox.classList.toggle('is-filled', Boolean(value));

      if (!value) {
        closeSuggestions();
        return;
      }

      const filtered = suggestions.filter(function (item) {
        return item.indexOf(value) > -1 || value.length < 4;
      }).slice(0, 5);

      openSuggestions(filtered.length ? filtered : suggestions.slice(0, 4));
    };

    const typeStatus = function (text) {
      status.textContent = '';
      status.classList.add('is-active');

      let index = 0;
      clearInterval(typingTimer);
      typingTimer = window.setInterval(function () {
        index += 1;
        status.textContent = text.slice(0, index);

        if (index >= text.length) {
          clearInterval(typingTimer);
        }
      }, 28);
    };

    homePrompt.addEventListener('focus', function () {
      promptBox.classList.add('is-focused');
      if (homePrompt.value.trim()) {
        updatePromptState();
      }
    });

    homePrompt.addEventListener('blur', function () {
      window.setTimeout(function () {
        if (!promptBox.contains(document.activeElement)) {
          promptBox.classList.remove('is-focused');
        }
      }, 120);
    });

    homePrompt.addEventListener('input', updatePromptState);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeSuggestions();
      }
    });

    document.addEventListener('click', function (event) {
      if (!promptBox.contains(event.target)) {
        closeSuggestions();
      }
    });

    homeForm.addEventListener('submit', function (event) {
      if (thinkingLock) return;

      event.preventDefault();
      thinkingLock = true;
      closeSuggestions();
      promptBox.classList.add('is-thinking');
      generateButton.classList.add('is-loading');
      generateButton.disabled = true;
      storeHomePrompt();
      typeStatus(hints[Math.floor(Math.random() * hints.length)]);

      window.setTimeout(function () {
        homeForm.submit();
      }, 880);
    });
  };

  const setupVideoStudio = function () {
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

    if (!select || !trigger || !menu || !value || !uploadGrid || !uploadTitle || !description) return;

    const singleUpload = [
      {
        title: '上传主图',
        tip: '请上传高清的图片，清晰度会影响最终效果'
      }
    ];

    const doubleUpload = [
      {
        title: '上传首帧图片',
        tip: '请上传高清的图片，清晰度会影响最终效果'
      },
      {
        title: '上传尾帧图片',
        tip: '请上传高清的图片，清晰度会影响最终效果'
      }
    ];

    const renderUploadCards = function (items) {
      uploadGrid.innerHTML = '';
      uploadGrid.classList.toggle('is-double', items.length === 2);

      items.forEach(function (item) {
        const button = document.createElement('button');
        button.className = 'video-upload-card';
        button.type = 'button';
        button.innerHTML =
          '<span class=\"video-upload-card__plus\">+</span>' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.tip + '</span>';
        uploadGrid.appendChild(button);
      });
    };

    const closeMenu = function () {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };

    const showToast = function (text) {
      if (!toast) return;
      toast.textContent = text;
      toast.hidden = false;
      toast.classList.remove('is-visible');
      void toast.offsetWidth;
      toast.classList.add('is-visible');

      window.setTimeout(function () {
        toast.hidden = true;
        toast.classList.remove('is-visible');
      }, 2100);
    };

    const applyVideoType = function (type) {
      const isDouble = type === 'double';
      value.textContent = isDouble ? '首尾帧视频' : '单图视频';
      uploadTitle.textContent = isDouble ? '上传图片（必填）' : '上传底图（必填）';
      description.placeholder = isDouble
        ? '请使用中文描述，首尾帧尽量包含相同主体，并用文字描述两张图片之间如何过渡，500字以内'
        : '请使用中文描述，镜头运动、主体关系和画面氛围越清晰，最终效果越稳定。';

      renderUploadCards(isDouble ? doubleUpload : singleUpload);

      options.forEach(function (option) {
        option.classList.toggle('is-selected', option.dataset.videoType === type);
      });
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
        showToast('已为你切换到 ' + button.textContent);
      });
    });

    applyVideoType('single');
  };

  if (isHome) {
    setupInteractiveTilt('.industry-card, .product-card, .learning-video-tile', { max: 4, scale: 1.018 });
    setupScrollReveal();
  }

  if (page === 'video') {
    setupVideoStudio();
  }
})();

(function () {
  if (document.body.dataset.page !== 'workflow') return;

  const cards = document.querySelectorAll('.workflow-category-card');
  const workflowTitle = document.querySelector('[data-workflow-title]');
  const composer = document.querySelector('[data-workflow-composer]');
  const workflowChatShell = document.querySelector('[data-workflow-chat-shell]');
  const workflowToolPages = document.querySelector('[data-workflow-tool-pages]');
  const workflowDetail = document.querySelector('[data-workflow-design-detail]');
  const workflowPanels = document.querySelectorAll('[data-workflow-panel]');
  const workflowStatusText = document.querySelector('[data-workflow-status-text]');

  if (!cards.length || !workflowTitle || !composer) return;

  const detailState = {
    category: '',
    prompt: '',
    title: '',
    description: ''
  };

  const escapeHtml = function (value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const categoryExamples = {
    '室内设计': [
      {
        title: '暖灰石材客厅',
        before: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '开放式收纳优化',
        before: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '隐藏灯带氛围',
        before: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=520&q=80'
      }
    ],
    '建筑设计': [
      {
        title: '一键改成玻璃幕墙',
        before: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '深褐色的高级感',
        before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '五彩缤纷的外立面',
        before: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=520&q=80'
      }
    ],
    '产品设计': [
      {
        title: '极简科技外观',
        before: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '织物面板质感',
        before: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '场景化产品渲染',
        before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=520&q=80'
      }
    ],
    '视觉传达': [
      {
        title: '发布会主视觉升级',
        before: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '品牌物料延展',
        before: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '社媒封面系列',
        before: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=520&q=80'
      }
    ],
    '数字媒体': [
      {
        title: '短视频封面强化',
        before: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '霓虹栏目包装',
        before: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=520&q=80'
      },
      {
        title: '分镜氛围生成',
        before: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=520&q=80',
        after: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=520&q=80'
      }
    ]
  };

  const detailCopy = {
    '室内设计': { upload: '输入空间描述', hint: '请描述户型、材质、灯光、收纳与软装方向，细节越清楚效果越准。', center: '拖动底图到此处或点击上传空间图片', template: '或者尝试以下室内模板图片', action: '开始生成(1金币)' },
    '建筑设计': { upload: '上传建筑底图', hint: '请上传清晰的建筑外观、草图或场地图片，便于生成立面与体块方案。', center: '拖动底图到此处或点击上传建筑图片', template: '或者尝试以下建筑模板图片', action: '开始渲染(1金币)' },
    '产品设计': { upload: '上传产品草图', hint: '请上传产品线稿、竞品图或结构参考，便于生成外观与材质方向。', center: '拖动底图到此处或点击上传产品图片', template: '或者尝试以下产品模板图片', action: '开始生成(1金币)' },
    '视觉传达': { upload: '上传视觉参考', hint: '请上传品牌、海报、KV 或活动参考图，便于生成版式与视觉延展。', center: '拖动底图到此处或点击上传视觉图片', template: '或者尝试以下视觉模板图片', action: '开始生成(1金币)' },
    '数字媒体': { upload: '上传画面参考', hint: '请上传视频画面、封面或分镜参考，便于生成栏目视觉与传播素材。', center: '拖动底图到此处或点击上传媒体图片', template: '或者尝试以下媒体模板图片', action: '开始生成(1金币)' }
  };

  const templateImages = {
    '室内设计': [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=420&q=80'
    ],
    '建筑设计': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=420&q=80'
    ],
    '产品设计': [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=420&q=80'
    ],
    '视觉传达': [
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=420&q=80'
    ],
    '数字媒体': [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=420&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&q=80'
    ]
  };

  const renderDesignDetail = function () {
    if (!workflowDetail) return;

    const copy = detailCopy[detailState.category] || detailCopy['室内设计'];
    const examples = categoryExamples[detailState.category] || categoryExamples['室内设计'];
    const templates = templateImages[detailState.category] || templateImages['室内设计'];
    const prompt = detailState.prompt || detailState.title;

    workflowDetail.innerHTML =
      '<div class="design-tool-shell">' +
        '<aside class="design-tool-sidebar">' +
          '<div class="design-tool-back-row"><button class="design-tool-back" type="button" data-design-back aria-label="返回">‹</button><h2>' + escapeHtml(detailState.title) + '</h2><button class="design-tool-tutorial" type="button">▷ 教程</button></div>' +
          '<div class="design-tool-section"><h3><span>*</span> AI 模型选择</h3><button class="design-tool-select" type="button">FLUX2 全能模型 <span>⌄</span></button></div>' +
          '<div class="design-tool-section"><h3>' + escapeHtml(copy.upload) + '</h3><label class="design-tool-upload"><input type="file" accept="image/*"><span class="design-tool-upload__plus">+</span><strong>' + escapeHtml(copy.upload) + '</strong><small>' + escapeHtml(copy.hint) + '</small></label></div>' +
          '<div class="design-tool-section"><h3>方案描述：</h3><textarea class="design-tool-textarea" data-detail-prompt>' + escapeHtml(prompt) + '</textarea></div>' +
          '<div class="design-tool-section"><h3>渲染张数：</h3><div class="design-tool-counts"><button class="is-active" type="button">1 张</button><button type="button"><span>会员可用</span>2 张</button><button type="button"><span>会员可用</span>3 张</button><button type="button"><span>会员可用</span>4 张</button></div></div>' +
          '<label class="design-tool-toggle"><span><b>?</b> 参与优秀作品评选<small>入选优秀作品，可获赠200永久金币</small></span><input type="checkbox"><i></i></label>' +
        '</aside>' +
        '<main class="design-tool-stage">' +
          '<div class="design-tool-drop"><div class="design-tool-drop__icon">▧＋</div><strong>' + escapeHtml(copy.center) + '</strong><span>' + escapeHtml(copy.template) + '</span><div class="design-tool-templates">' + templates.map(function (src, index) { return '<button type="button" data-template-index="' + index + '"><img src="' + escapeHtml(src) + '" alt="模板图片"></button>'; }).join('') + '</div></div>' +
          '<div class="design-tool-actions"><button class="design-tool-light-btn" type="button">上传图片</button><button class="design-tool-primary-btn" type="button">' + escapeHtml(copy.action) + '</button></div>' +
        '</main>' +
        '<aside class="design-tool-gallery"><h2>优秀作品</h2><div class="design-tool-gallery__list">' + examples.map(function (item, index) { return '<button class="design-tool-example" type="button" data-example-index="' + index + '"><span><img src="' + escapeHtml(item.before) + '" alt="' + escapeHtml(item.title) + '改造前"><img src="' + escapeHtml(item.after) + '" alt="' + escapeHtml(item.title) + '改造后"></span><strong>' + escapeHtml(item.title) + '</strong></button>'; }).join('') + '</div></aside>' +
      '</div>';
  };

  const openDesignDetail = function (card) {
    if (!card || !workflowToolPages || !workflowDetail) return;

    const activeCategory = document.querySelector('.workflow-category-card.is-active');
    const mediaText = card.querySelector('.workflow-tool-card__media strong');
    const title = card.querySelector('.workflow-tool-card__body h3');
    const description = card.querySelector('.workflow-tool-card__body p');

    detailState.category = activeCategory ? activeCategory.dataset.workflowName : '室内设计';
    detailState.prompt = mediaText ? mediaText.textContent.trim() : (title ? title.textContent.trim() : '');
    detailState.title = title ? title.textContent.trim() : detailState.category;
    detailState.description = description ? description.textContent.trim() : '';

    workflowToolPages.hidden = true;
    workflowToolPages.style.display = 'none';
    workflowDetail.hidden = false;
    workflowDetail.style.display = '';
    workflowChatShell.classList.add('is-design-detail');
    workflowTitle.innerHTML = '<span data-workflow-display>' + escapeHtml(detailState.category + ' / ' + detailState.title) + '</span>';
    if (workflowStatusText) workflowStatusText.textContent = detailState.description || (detailState.title + '已就绪');
    renderDesignDetail();
    window.scrollTo({ top: 0, left: 0 });
  };

  const closeDesignDetail = function () {
    if (!workflowToolPages || !workflowDetail) return;

    workflowDetail.hidden = true;
    workflowDetail.style.display = 'none';
    workflowToolPages.hidden = false;
    workflowToolPages.style.display = '';
    workflowChatShell.classList.remove('is-design-detail');
    const activeCategory = document.querySelector('.workflow-category-card.is-active');
    if (activeCategory) syncWorkflowShell(activeCategory);
  };

  const syncWorkflowShell = function (card) {
    if (!card) return;

    const nextName = card.dataset.workflowName || '';
    const mode = card.dataset.workflowMode || '';

    workflowTitle.innerHTML = '<span data-workflow-display>' + nextName + '</span>';
    composer.placeholder = card.dataset.workflowPlaceholder || composer.placeholder;

    workflowPanels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.dataset.workflowPanel === nextName);
    });

    if (workflowToolPages && workflowDetail) {
      workflowDetail.hidden = true;
      workflowDetail.style.display = 'none';
      workflowToolPages.hidden = false;
      workflowToolPages.style.display = '';
      workflowChatShell.classList.remove('is-design-detail');
    }

    if (workflowStatusText && mode !== 'enterprise') {
      workflowStatusText.textContent = nextName + '工作流已就绪';
    }

    if (workflowChatShell) {
      const isEnterprise = mode === 'enterprise';
      workflowChatShell.hidden = isEnterprise;
      workflowChatShell.style.display = isEnterprise ? 'none' : '';
    }
  };

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      cards.forEach(function (item) {
        item.classList.toggle('is-active', item === card);
      });
      syncWorkflowShell(card);
    });
  });

  if (workflowToolPages) {
    workflowToolPages.addEventListener('click', function (event) {
      const toolCard = event.target.closest('.workflow-tool-card');
      if (toolCard) openDesignDetail(toolCard);
    });

    workflowToolPages.querySelectorAll('.workflow-tool-card').forEach(function (toolCard) {
      toolCard.setAttribute('tabindex', '0');
      toolCard.setAttribute('role', 'button');
      toolCard.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDesignDetail(toolCard);
        }
      });
    });
  }

  if (workflowDetail) {
    workflowDetail.addEventListener('click', function (event) {
      if (event.target.closest('[data-design-back]')) {
        closeDesignDetail();
        return;
      }

      const example = event.target.closest('[data-example-index]');
      if (example) {
        const items = categoryExamples[detailState.category] || categoryExamples['室内设计'];
        const selected = items[Number(example.dataset.exampleIndex)];
        if (selected) {
          detailState.prompt = selected.title;
          renderDesignDetail();
          const textarea = workflowDetail.querySelector('[data-detail-prompt]');
          if (textarea) textarea.focus();
        }
      }
    });

    workflowDetail.addEventListener('input', function (event) {
      if (event.target.matches('[data-detail-prompt]')) {
        detailState.prompt = event.target.value;
      }
    });
  }

  syncWorkflowShell(document.querySelector('.workflow-category-card.is-active'));
})();
