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

  if (!cards.length || !workflowTitle || !composer) return;

  const syncWorkflowShell = function (card) {
    if (!card) return;

    const nextName = card.dataset.workflowName || '';
    const mode = card.dataset.workflowMode || '';

    workflowTitle.innerHTML = '<span data-workflow-display>' + nextName + '</span> 对话';
    composer.placeholder = card.dataset.workflowPlaceholder || composer.placeholder;

    if (workflowChatShell) {
      const isEnterprise = mode === 'enterprise';
      workflowChatShell.hidden = isEnterprise;
      workflowChatShell.style.display = isEnterprise ? 'none' : '';
    }

    if (mode !== 'enterprise') {
      composer.focus();
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

  syncWorkflowShell(document.querySelector('.workflow-category-card.is-active'));
})();
