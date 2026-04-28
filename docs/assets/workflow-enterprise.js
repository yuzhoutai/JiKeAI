(function () {
  if (document.body.dataset.page !== 'workflow') return;

  const ENTERPRISE_NAME = '企业运营模拟系统';
  const cards = Array.from(document.querySelectorAll('.workflow-category-card'));
  const workspace = document.querySelector('[data-enterprise-workspace]');
  const chatShell = document.querySelector('[data-workflow-chat-shell]');
  const title = document.querySelector('[data-workflow-title]');
  const titleDisplay = document.querySelector('[data-workflow-display]');
  const statusText = document.querySelector('[data-workflow-status-text]');
  const composer = document.querySelector('[data-workflow-composer]');

  if (!workspace || !chatShell || !title || !titleDisplay || !statusText || !composer || !cards.length) return;

  const state = {
    view: 'select',
    teacherFilter: 'all',
    teacherSort: 'latest',
    teacherSearch: '',
    selectedAssignmentId: null,
    inviteOpen: false,
    studentJoinCode: '',
    studentDraft: { title: '', description: '', imageUrl: '', fileName: '', editingId: null }
  };

  const store = {
    team: { name: '企业经营沙盘实验班', teacher: '周岚', inviteCode: 'JK-2026-1688' },
    members: [
      { id: 'stu-1', name: '林悦', studentId: '20231102', joinedAt: '2026-04-03 14:18', status: '在组' },
      { id: 'stu-2', name: '陈拓', studentId: '20231116', joinedAt: '2026-04-05 09:42', status: '在组' },
      { id: 'stu-3', name: '苏柠', studentId: '20231127', joinedAt: '2026-04-08 11:06', status: '待激活' }
    ],
    studentProfile: {
      id: 'stu-1',
      name: '林悦',
      teacherName: '周岚',
      teamName: '企业经营沙盘实验班',
      joinedAt: '2026-04-03 14:18',
      inviteCode: 'JK-2026-1688',
      joined: true
    },
    assignments: [
      {
        id: 'job-101',
        studentId: 'stu-1',
        studentName: '林悦',
        title: '第一周企业经营复盘海报',
        description: '围绕沙盘经营结果，整理营收波动、库存策略和营销动作的关键节点，并转成汇报海报。',
        submittedAt: '2026-04-18 19:20',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        status: 'pending',
        teacherComment: '请补充库存调整前后的经营差异，方便和课堂策略联动。',
        history: [
          { type: 'comment', label: '教师留言', detail: '先把经营复盘逻辑补齐，再提交终版。', time: '2026-04-18 20:10' }
        ]
      },
      {
        id: 'job-102',
        studentId: 'stu-2',
        studentName: '陈拓',
        title: '第二轮品牌定价模拟报告',
        description: '提交价格策略模拟截图，并说明不同客群对利润率的影响。',
        submittedAt: '2026-04-17 16:45',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
        status: 'approved',
        teacherComment: '结构完整，数据解读到位，可以作为班级示例。',
        history: [
          { type: 'approved', label: '审批通过', detail: '结构完整，数据解读到位，可以作为班级示例。', time: '2026-04-17 19:06' }
        ]
      },
      {
        id: 'job-103',
        studentId: 'stu-1',
        studentName: '林悦',
        title: '营销投放预算调整作业',
        description: '对比三种预算分配方案，解释流量、转化与利润之间的平衡。',
        submittedAt: '2026-04-16 10:28',
        imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
        status: 'revise',
        teacherComment: '请把预算模型里的假设条件写清楚，并重新上传带标注版本。',
        history: [
          { type: 'revise', label: '退回修改', detail: '请把预算模型里的假设条件写清楚，并重新上传带标注版本。', time: '2026-04-16 13:40' }
        ]
      }
    ]
  };

  const statusMap = {
    pending: { label: '待审批', className: 'is-pending' },
    approved: { label: '已通过', className: 'is-approved' },
    revise: { label: '需修改', className: 'is-revise' }
  };

  const escapeHtml = function (value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const initials = function (name) {
    return (name || 'AI').slice(0, 2);
  };

  const nowText = function () {
    return new Date().toLocaleString('zh-CN', { hour12: false });
  };

  const showToast = function (message) {
    let toast = document.querySelector('[data-enterprise-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'workflow-toast';
      toast.dataset.enterpriseToast = 'true';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
  };

  const statusTag = function (status) {
    const current = statusMap[status] || statusMap.pending;
    return '<span class="workflow-tag ' + current.className + '">' + current.label + '</span>';
  };

  const currentAssignment = function () {
    return store.assignments.find(function (item) {
      return item.id === state.selectedAssignmentId;
    }) || null;
  };

  const enterpriseActive = function () {
    return cards.some(function (card) {
      return card.classList.contains('is-active') && card.dataset.workflowName === ENTERPRISE_NAME;
    });
  };

  const getTeacherStats = function () {
    return [
      { icon: '团', label: '团队学生数', value: store.members.length, foot: '当前活跃班组成员' },
      { icon: '审', label: '待审批作业数', value: store.assignments.filter(function (item) { return item.status === 'pending'; }).length, foot: '需老师处理的任务' },
      { icon: '过', label: '已通过作业数', value: store.assignments.filter(function (item) { return item.status === 'approved'; }).length, foot: '已完成反馈闭环' },
      { icon: '改', label: '需修改作业数', value: store.assignments.filter(function (item) { return item.status === 'revise'; }).length, foot: '等待学生重新提交' }
    ];
  };

  const getStudentStats = function () {
    const mine = store.assignments.filter(function (item) { return item.studentId === store.studentProfile.id; });
    return [
      { icon: '师', label: '当前所属老师', value: store.studentProfile.joined ? store.studentProfile.teacherName : '--', foot: '负责审批与反馈' },
      { icon: '组', label: '所属团队', value: store.studentProfile.joined ? store.studentProfile.teamName : '--', foot: '用于课堂协作与作业归档' },
      { icon: '交', label: '已提交作业数', value: mine.length, foot: '当前账号累计提交' },
      { icon: '审', label: '待审批数', value: mine.filter(function (item) { return item.status === 'pending'; }).length, foot: '等待老师查看' },
      { icon: '退', label: '被退回数', value: mine.filter(function (item) { return item.status === 'revise'; }).length, foot: '建议优先处理' }
    ];
  };

  const renderStats = function (items) {
    return '<div class="workflow-stats">' + items.map(function (item) {
      return '<article class="workflow-stat"><div class="workflow-stat__head"><div><div class="workflow-stat__label">' + escapeHtml(item.label) + '</div><div class="workflow-stat__value">' + escapeHtml(item.value) + '</div></div><div class="workflow-stat__icon workflow-badge-icon">' + escapeHtml(item.icon) + '</div></div><div class="workflow-stat__foot">' + escapeHtml(item.foot) + '</div></article>';
    }).join('') + '</div>';
  };

  const filteredAssignments = function () {
    const query = state.teacherSearch.trim().toLowerCase();
    let items = store.assignments.slice();

    if (state.teacherFilter !== 'all') {
      items = items.filter(function (item) {
        return item.status === state.teacherFilter;
      });
    }

    if (query) {
      items = items.filter(function (item) {
        return item.studentName.toLowerCase().indexOf(query) > -1 || item.title.toLowerCase().indexOf(query) > -1;
      });
    }

    items.sort(function (a, b) {
      if (state.teacherSort === 'earliest') return a.submittedAt.localeCompare(b.submittedAt);
      if (state.teacherSort === 'student') return a.studentName.localeCompare(b.studentName, 'zh-Hans-CN');
      return b.submittedAt.localeCompare(a.submittedAt);
    });

    return items;
  };

  const updateShellVisibility = function () {
    if (enterpriseActive()) {
      chatShell.hidden = true;
      chatShell.style.display = 'none';
      workspace.hidden = false;
      workspace.style.display = '';
      titleDisplay.textContent = ENTERPRISE_NAME;

      if (state.view === 'teacher') {
        title.innerHTML = '教师工作台';
        statusText.textContent = '教师协作空间已就绪';
      } else if (state.view === 'student') {
        title.innerHTML = '学生工作台';
        statusText.textContent = '学生提交通道已就绪';
      } else {
        title.innerHTML = '师生协作作业管理系统';
        statusText.textContent = '身份选择待确认';
      }
      return;
    }

    chatShell.hidden = false;
    chatShell.style.display = '';
    workspace.hidden = true;
    workspace.style.display = 'none';
    state.view = 'select';
  };

  const renderSelectView = function () {
    workspace.innerHTML =
      '<div class="workflow-role-grid">' +
        '<button class="workflow-role-card" type="button" data-enterprise-role="teacher"><div class="workflow-role-card__icon">师</div><strong>老师端</strong><p>管理班组成员、查看学生作业、写反馈留言，并完成审批决策。</p><div class="workflow-role-card__points"><div class="workflow-role-card__point">创建与维护团队</div><div class="workflow-role-card__point">邀请学生加入</div><div class="workflow-role-card__point">审批作业并留言</div></div></button>' +
        '<button class="workflow-role-card" type="button" data-enterprise-role="student"><div class="workflow-role-card__icon">生</div><strong>学生端</strong><p>确认所属老师与团队、上传图片作业、查看审批状态与教师反馈。</p><div class="workflow-role-card__points"><div class="workflow-role-card__point">邀请码加入团队</div><div class="workflow-role-card__point">本地预览图片作业</div><div class="workflow-role-card__point">接收退回与通过结果</div></div></button>' +
      '</div>';
  };

  const renderMembers = function () {
    if (!store.members.length) {
      return '<div class="workflow-empty"><div class="workflow-empty__icon">组</div><strong>老师端暂时无学生</strong><p>当前团队里还没有学生。你可以先复制邀请码，或者点击邀请学生，快速把课堂成员拉进来。</p></div>';
    }

    return '<div class="workflow-list">' + store.members.map(function (member) {
      return '<article class="workflow-member-card"><div class="workflow-list-avatar">' + escapeHtml(initials(member.name)) + '</div><div class="workflow-list-name"><strong>' + escapeHtml(member.name) + '</strong><span>学号 ' + escapeHtml(member.studentId) + ' · 加入于 ' + escapeHtml(member.joinedAt) + '</span></div><div class="workflow-inline-actions"><span class="workflow-tag ' + (member.status === '在组' ? 'is-approved' : 'is-pending') + '">' + escapeHtml(member.status) + '</span><button class="workflow-inline-btn" type="button" data-member-remove="' + escapeHtml(member.id) + '">移出团队</button></div></article>';
    }).join('') + '</div>';
  };

  const renderTeacherAssignments = function () {
    const items = filteredAssignments();
    if (!items.length) {
      return '<div class="workflow-empty"><div class="workflow-empty__icon">审</div><strong>老师端暂时无作业</strong><p>当前筛选条件下没有学生作业。你可以切换状态、清空搜索，或者等待学生端提交新的图片作业。</p></div>';
    }

    return '<div class="workflow-assignment-list">' + items.map(function (item) {
      return '<article class="workflow-assignment-card"><img class="workflow-assignment-card__thumb" src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.title) + '"><div><div class="workflow-assignment-card__title"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.studentName) + ' · 提交于 ' + escapeHtml(item.submittedAt) + '</span></div><div class="workflow-assignment-card__meta">' + escapeHtml(item.description) + '</div></div><div class="workflow-assignment-card__actions">' + statusTag(item.status) + '<button class="workflow-primary-btn" type="button" data-assignment-detail="' + escapeHtml(item.id) + '">查看详情</button></div></article>';
    }).join('') + '</div>';
  };

  const renderInviteModal = function () {
    if (!state.inviteOpen) return '';

    return '<div class="workflow-modal" data-invite-modal><div class="workflow-modal__panel"><div class="workflow-modal__header"><div><h3>邀请学生加入团队</h3><div class="workflow-modal__meta"><span>把邀请码发给学生，或在课堂投屏展示以下加入路径。</span></div></div><button class="workflow-ghost-btn" type="button" data-close-invite>关闭</button></div><div class="workflow-panel"><div class="workflow-meta-item"><span>团队邀请码</span><strong>' + escapeHtml(store.team.inviteCode) + '</strong></div><div class="workflow-meta-item" style="margin-top:12px;"><span>加入提示</span><strong>学生端输入邀请码后，即可绑定到 ' + escapeHtml(store.team.teacher) + ' 老师名下。</strong></div><div class="workflow-team-actions" style="margin-top:16px;"><button class="workflow-secondary-btn" type="button" data-copy-invite>复制邀请码</button><button class="workflow-primary-btn" type="button" data-close-invite>我知道了</button></div></div></div></div>';
  };

  const renderTeacherDetailModal = function () {
    const assignment = currentAssignment();
    if (!assignment) return '';

    return '<div class="workflow-modal" data-assignment-modal><div class="workflow-modal__panel"><div class="workflow-modal__header"><div><h3>作业详情</h3><div class="workflow-modal__meta"><span>' + escapeHtml(assignment.studentName) + '</span><span>' + escapeHtml(assignment.title) + '</span><span>提交时间 ' + escapeHtml(assignment.submittedAt) + '</span></div></div><button class="workflow-ghost-btn" type="button" data-close-detail>关闭</button></div><div class="workflow-modal__section"><h4>作业说明</h4><div class="workflow-panel__subtext">' + escapeHtml(assignment.description) + '</div></div><div class="workflow-modal__section"><h4>图片大图预览</h4><div class="workflow-modal__preview"><img src="' + escapeHtml(assignment.imageUrl) + '" alt="' + escapeHtml(assignment.title) + '"></div></div><div class="workflow-modal__section"><h4>历史审批记录</h4><div class="workflow-history">' + (assignment.history.length ? assignment.history.map(function (record) { return '<div class="workflow-history__item"><strong>' + escapeHtml(record.label) + ' · ' + escapeHtml(record.time) + '</strong><p>' + escapeHtml(record.detail) + '</p></div>'; }).join('') : '<div class="workflow-empty"><div class="workflow-empty__icon">记</div><strong>暂无审批记录</strong><p>你可以在下方写留言后保存，或者直接完成审批。</p></div>') + '</div></div><div class="workflow-modal__section"><h4>教师留言</h4><textarea class="workflow-textarea" data-detail-comment placeholder="写下本次审批意见或修改建议">' + escapeHtml(assignment.teacherComment || '') + '</textarea></div><div class="workflow-modal__footer"><button class="workflow-secondary-btn" type="button" data-save-comment="' + escapeHtml(assignment.id) + '">保存留言</button><div class="workflow-modal__actions"><button class="workflow-secondary-btn" type="button" data-mark-revise="' + escapeHtml(assignment.id) + '">退回修改</button><button class="workflow-primary-btn" type="button" data-mark-approved="' + escapeHtml(assignment.id) + '">通过</button></div></div></div></div>';
  };

  const renderTeacherView = function () {
    workspace.innerHTML =
      '<div class="workflow-workspace">' +
        '<div class="workflow-workspace__topbar"><div class="workflow-workspace__title"><p>管理团队成员、查看学生作业并进行审批反馈。</p></div><button class="workflow-ghost-btn" type="button" data-enterprise-switch>切换身份</button></div>' +
        renderStats(getTeacherStats()) +
        '<div class="workflow-grid">' +
          '<section class="workflow-panel"><div class="workflow-panel__header"><div><h3>我的团队</h3><div class="workflow-panel__subtext">集中维护团队信息与学生成员。</div></div></div><div class="workflow-team-card"><strong class="workflow-panel__title">' + escapeHtml(store.team.name) + '</strong><div class="workflow-inline-note">教师负责人 · ' + escapeHtml(store.team.teacher) + '</div><div class="workflow-team-meta"><div class="workflow-meta-item"><span>邀请码</span><strong>' + escapeHtml(store.team.inviteCode) + '</strong></div><div class="workflow-meta-item"><span>当前成员数</span><strong>' + escapeHtml(store.members.length) + ' 人</strong></div></div><div class="workflow-team-actions"><button class="workflow-secondary-btn" type="button" data-copy-invite>复制邀请码</button><button class="workflow-primary-btn" type="button" data-open-invite>邀请学生</button></div></div><div class="workflow-record-list">' + renderMembers() + '</div></section>' +
          '<section class="workflow-panel"><div class="workflow-panel__header"><div><h3>作业审批列表</h3><div class="workflow-panel__subtext">支持搜索、筛选和排序，快速进入审批详情。</div></div></div><div class="workflow-filter-bar"><input class="workflow-input workflow-search" type="text" placeholder="搜索学生姓名或作业标题" value="' + escapeHtml(state.teacherSearch) + '" data-teacher-search><div class="workflow-table__tools"><select class="workflow-select" data-teacher-filter><option value="all"' + (state.teacherFilter === 'all' ? ' selected' : '') + '>全部状态</option><option value="pending"' + (state.teacherFilter === 'pending' ? ' selected' : '') + '>待审批</option><option value="approved"' + (state.teacherFilter === 'approved' ? ' selected' : '') + '>已通过</option><option value="revise"' + (state.teacherFilter === 'revise' ? ' selected' : '') + '>需修改</option></select><select class="workflow-select" data-teacher-sort><option value="latest"' + (state.teacherSort === 'latest' ? ' selected' : '') + '>最新提交</option><option value="earliest"' + (state.teacherSort === 'earliest' ? ' selected' : '') + '>最早提交</option><option value="student"' + (state.teacherSort === 'student' ? ' selected' : '') + '>按学生排序</option></select></div></div><div class="workflow-record-list">' + renderTeacherAssignments() + '</div></section>' +
        '</div>' +
      '</div>' + renderInviteModal() + renderTeacherDetailModal();
  };

  const renderJoinBlock = function () {
    if (store.studentProfile.joined) {
      return '<div class="workflow-joined-card"><strong>' + escapeHtml(store.studentProfile.teacherName) + ' · ' + escapeHtml(store.studentProfile.teamName) + '</strong><div class="workflow-record__meta">加入时间 ' + escapeHtml(store.studentProfile.joinedAt) + ' · 邀请码 ' + escapeHtml(store.studentProfile.inviteCode) + '</div></div>';
    }

    return '<div class="workflow-join-card"><div class="workflow-empty__icon">组</div><strong>学生端未加入团队</strong><p>输入老师发给你的邀请码，即可绑定所属团队并开始提交作业。</p><div class="workflow-record-list"><input class="workflow-input" type="text" data-student-join-code placeholder="请输入邀请码，例如 JK-2026-1688" value="' + escapeHtml(state.studentJoinCode) + '"><button class="workflow-primary-btn" type="button" data-student-join>加入团队</button></div></div>';
  };

  const renderUploadBlock = function () {
    if (!state.studentDraft.imageUrl) {
      return '<div class="workflow-empty-upload"><div class="workflow-empty-upload__media">图片</div><div class="workflow-upload-hint">未上传图片时，会显示这里的占位状态。</div></div>';
    }

    return '<div class="workflow-upload-preview"><img src="' + escapeHtml(state.studentDraft.imageUrl) + '" alt="作业预览"><div><strong>' + escapeHtml(state.studentDraft.fileName || '本地图片预览') + '</strong><div class="workflow-upload-hint">图片已载入前端本地状态，提交后会直接写入作业记录。</div><div class="workflow-upload-actions"><button class="workflow-inline-btn" type="button" data-clear-upload>移除图片</button></div></div></div>';
  };

  const renderStudentAssignments = function () {
    const mine = store.assignments.filter(function (item) { return item.studentId === store.studentProfile.id; }).sort(function (a, b) { return b.submittedAt.localeCompare(a.submittedAt); });
    if (!mine.length) {
      return '<div class="workflow-empty"><div class="workflow-empty__icon">作</div><strong>学生端暂时无作业记录</strong><p>加入老师团队并完成第一次提交后，这里会展示你的作业状态、老师留言和重新提交入口。</p></div>';
    }

    return '<div class="workflow-record-list">' + mine.map(function (item) {
      return '<article class="workflow-record-card"><div><div class="workflow-record-card__title"><strong>' + escapeHtml(item.title) + '</strong><span>提交时间 ' + escapeHtml(item.submittedAt) + '</span></div><div class="workflow-record-card__feedback">老师留言：' + escapeHtml(item.teacherComment || '老师暂未留言') + '</div></div><div class="workflow-record-card__actions">' + statusTag(item.status) + '<button class="workflow-inline-btn" type="button" data-student-detail="' + escapeHtml(item.id) + '">查看详情</button>' + (item.status === 'revise' ? '<button class="workflow-primary-btn" type="button" data-student-resubmit="' + escapeHtml(item.id) + '">重新提交</button>' : '') + '</div></article>';
    }).join('') + '</div>';
  };

  const renderStudentDetailModal = function () {
    const assignment = currentAssignment();
    if (!assignment) return '';

    return '<div class="workflow-modal" data-assignment-modal><div class="workflow-modal__panel"><div class="workflow-modal__header"><div><h3>我的作业详情</h3><div class="workflow-modal__meta"><span>' + escapeHtml(assignment.title) + '</span><span>' + escapeHtml(statusMap[assignment.status].label) + '</span><span>提交时间 ' + escapeHtml(assignment.submittedAt) + '</span></div></div><button class="workflow-ghost-btn" type="button" data-close-detail>关闭</button></div><div class="workflow-modal__section"><h4>作业说明</h4><div class="workflow-panel__subtext">' + escapeHtml(assignment.description) + '</div></div><div class="workflow-modal__section"><h4>图片预览</h4><div class="workflow-modal__preview"><img src="' + escapeHtml(assignment.imageUrl) + '" alt="' + escapeHtml(assignment.title) + '"></div></div><div class="workflow-modal__section"><h4>老师留言</h4><div class="workflow-panel__subtext">' + escapeHtml(assignment.teacherComment || '老师暂未留言') + '</div></div><div class="workflow-modal__section"><h4>审批记录</h4><div class="workflow-history">' + (assignment.history.length ? assignment.history.map(function (record) { return '<div class="workflow-history__item"><strong>' + escapeHtml(record.label) + ' · ' + escapeHtml(record.time) + '</strong><p>' + escapeHtml(record.detail) + '</p></div>'; }).join('') : '<div class="workflow-empty"><div class="workflow-empty__icon">记</div><strong>暂无审批记录</strong><p>老师审批后，这里会同步显示最新结果。</p></div>') + '</div></div><div class="workflow-modal__footer"><button class="workflow-secondary-btn" type="button" data-close-detail>关闭</button>' + (assignment.status === 'revise' ? '<button class="workflow-primary-btn" type="button" data-student-resubmit="' + escapeHtml(assignment.id) + '">带回表单重新提交</button>' : '') + '</div></div></div>';
  };

  const renderStudentView = function () {
    workspace.innerHTML =
      '<div class="workflow-workspace">' +
        '<div class="workflow-workspace__topbar"><div class="workflow-workspace__title"><p>查看所属教师团队、提交作业并接收教师反馈。</p></div><button class="workflow-ghost-btn" type="button" data-enterprise-switch>切换身份</button></div>' +
        renderStats(getStudentStats()) +
        '<div class="workflow-grid workflow-grid--student">' +
          '<section class="workflow-panel"><div class="workflow-panel__header"><div><h3>我的老师 / 我的团队</h3><div class="workflow-panel__subtext">确认归属关系后，再提交图片作业。</div></div></div>' + renderJoinBlock() + '</section>' +
          '<section class="workflow-panel"><div class="workflow-panel__header"><div><h3>提交作业</h3><div class="workflow-panel__subtext">支持上传图片本地预览，提交后自动新增到作业记录。</div></div></div><div class="workflow-record-list"><div class="workflow-form__row"><input class="workflow-input" type="text" data-student-title placeholder="作业标题" value="' + escapeHtml(state.studentDraft.title) + '"></div><div class="workflow-form__row"><textarea class="workflow-textarea" data-student-description placeholder="作业说明">' + escapeHtml(state.studentDraft.description) + '</textarea></div><div class="workflow-upload-row"><input class="workflow-input" type="file" accept="image/*" data-student-file><input class="workflow-input" type="text" value="' + escapeHtml(store.studentProfile.teacherName || store.team.teacher) + '" disabled></div>' + renderUploadBlock() + '<div class="workflow-inline-note">提交给老师：' + escapeHtml(store.studentProfile.teacherName || store.team.teacher) + '</div><button class="workflow-primary-btn" type="button" data-student-submit>' + (state.studentDraft.editingId ? '确认重新提交' : '提交作业') + '</button></div></section>' +
        '</div>' +
        '<section class="workflow-panel"><div class="workflow-panel__header"><div><h3>我的作业记录</h3><div class="workflow-panel__subtext">集中查看审批状态、老师留言和重新提交入口。</div></div></div>' + renderStudentAssignments() + '</section>' +
      '</div>' + renderStudentDetailModal();
  };

  const render = function () {
    updateShellVisibility();
    if (workspace.hidden) return;

    if (state.view === 'teacher') {
      renderTeacherView();
    } else if (state.view === 'student') {
      renderStudentView();
    } else {
      renderSelectView();
    }
  };

  const saveComment = function (assignmentId, status) {
    const assignment = store.assignments.find(function (item) { return item.id === assignmentId; });
    const textarea = workspace.querySelector('[data-detail-comment]');
    if (!assignment || !textarea) return;

    assignment.teacherComment = textarea.value.trim();

    if (status) {
      assignment.status = status;
      assignment.history.unshift({
        type: status,
        label: status === 'approved' ? '审批通过' : '退回修改',
        detail: assignment.teacherComment || (status === 'approved' ? '老师已通过本次作业。' : '老师退回并要求修改后重新提交。'),
        time: nowText()
      });
      showToast(status === 'approved' ? '已通过作业并同步状态' : '已退回作业并标记为需修改');
    } else {
      assignment.history.unshift({
        type: 'comment',
        label: '保存留言',
        detail: assignment.teacherComment || '老师更新了留言。',
        time: nowText()
      });
      showToast('教师留言已保存');
    }

    render();
    state.selectedAssignmentId = assignmentId;
    render();
  };

  const joinTeam = function () {
    if (!state.studentJoinCode.trim()) return showToast('请先输入邀请码');
    if (state.studentJoinCode.trim().toUpperCase() !== store.team.inviteCode) return showToast('邀请码不正确，请检查后再试');

    store.studentProfile.joined = true;
    store.studentProfile.teacherName = store.team.teacher;
    store.studentProfile.teamName = store.team.name;
    store.studentProfile.inviteCode = store.team.inviteCode;
    store.studentProfile.joinedAt = nowText();

    if (!store.members.some(function (item) { return item.id === store.studentProfile.id; })) {
      store.members.unshift({ id: store.studentProfile.id, name: store.studentProfile.name, studentId: '20239999', joinedAt: store.studentProfile.joinedAt, status: '在组' });
    }

    state.studentJoinCode = '';
    showToast('已加入老师团队');
    render();
  };

  const resetDraft = function () {
    state.studentDraft = { title: '', description: '', imageUrl: '', fileName: '', editingId: null };
  };

  const submitStudentAssignment = function () {
    if (!store.studentProfile.joined) return showToast('请先加入老师团队');
    if (!state.studentDraft.title.trim() || !state.studentDraft.description.trim()) return showToast('请先补全作业标题和说明');
    if (!state.studentDraft.imageUrl) return showToast('请先上传图片作业');

    const now = nowText();

    if (state.studentDraft.editingId) {
      const assignment = store.assignments.find(function (item) { return item.id === state.studentDraft.editingId; });
      if (assignment) {
        assignment.title = state.studentDraft.title.trim();
        assignment.description = state.studentDraft.description.trim();
        assignment.imageUrl = state.studentDraft.imageUrl;
        assignment.submittedAt = now;
        assignment.status = 'pending';
        assignment.teacherComment = '学生已根据要求重新提交，等待老师复审。';
        assignment.history.unshift({ type: 'resubmit', label: '重新提交', detail: '学生更新了作业内容并重新发起审批。', time: now });
      }
      showToast('已重新提交作业，状态更新为待审批');
    } else {
      store.assignments.unshift({
        id: 'job-' + Date.now(),
        studentId: store.studentProfile.id,
        studentName: store.studentProfile.name,
        title: state.studentDraft.title.trim(),
        description: state.studentDraft.description.trim(),
        submittedAt: now,
        imageUrl: state.studentDraft.imageUrl,
        status: 'pending',
        teacherComment: '已收到你的作业，老师将在审批后给出反馈。',
        history: [{ type: 'submitted', label: '提交成功', detail: '学生提交了新的图片作业，等待老师审批。', time: now }]
      });
      showToast('作业提交成功');
    }

    resetDraft();
    render();
  };

  const enterEnterpriseView = function (role) {
    state.view = role;
    state.selectedAssignmentId = null;
    state.inviteOpen = false;
    render();
  };

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.dataset.workflowName === ENTERPRISE_NAME) {
        title.innerHTML = '师生协作作业管理系统';
        statusText.textContent = '身份选择待确认';
        composer.blur();
      }
      window.setTimeout(render, 0);
    });
  });

  workspace.addEventListener('click', function (event) {
    const roleCard = event.target.closest('[data-enterprise-role]');
    if (roleCard) {
      roleCard.classList.add('is-pressed');
      window.setTimeout(function () {
        roleCard.classList.remove('is-pressed');
        enterEnterpriseView(roleCard.dataset.enterpriseRole);
      }, 120);
      return;
    }

    if (event.target.closest('[data-enterprise-switch]')) {
      state.view = 'select';
      state.selectedAssignmentId = null;
      render();
      return;
    }

    if (event.target.closest('[data-copy-invite]')) {
      const code = store.team.inviteCode;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          showToast('邀请码已复制');
        }).catch(function () {
          showToast('邀请码：' + code);
        });
      } else {
        showToast('邀请码：' + code);
      }
      return;
    }

    if (event.target.closest('[data-open-invite]')) {
      state.inviteOpen = true;
      render();
      showToast('已打开邀请面板');
      return;
    }

    if (event.target.closest('[data-close-invite]')) {
      state.inviteOpen = false;
      render();
      return;
    }

    const removeMember = event.target.closest('[data-member-remove]');
    if (removeMember) {
      const memberId = removeMember.dataset.memberRemove;
      store.members = store.members.filter(function (item) { return item.id !== memberId; });
      store.assignments = store.assignments.filter(function (item) { return item.studentId !== memberId; });
      if (store.studentProfile.id === memberId) {
        store.studentProfile.joined = false;
        store.studentProfile.teacherName = '';
        store.studentProfile.teamName = '';
      }
      showToast('已移出团队成员');
      render();
      return;
    }

    const detail = event.target.closest('[data-assignment-detail],[data-student-detail]');
    if (detail) {
      state.selectedAssignmentId = detail.dataset.assignmentDetail || detail.dataset.studentDetail;
      render();
      return;
    }

    if (event.target.closest('[data-close-detail]')) {
      state.selectedAssignmentId = null;
      render();
      return;
    }

    const saveBtn = event.target.closest('[data-save-comment]');
    if (saveBtn) return saveComment(saveBtn.dataset.saveComment);

    const approveBtn = event.target.closest('[data-mark-approved]');
    if (approveBtn) return saveComment(approveBtn.dataset.markApproved, 'approved');

    const reviseBtn = event.target.closest('[data-mark-revise]');
    if (reviseBtn) return saveComment(reviseBtn.dataset.markRevise, 'revise');

    if (event.target.closest('[data-student-join]')) return joinTeam();

    if (event.target.closest('[data-clear-upload]')) {
      state.studentDraft.imageUrl = '';
      state.studentDraft.fileName = '';
      render();
      return;
    }

    if (event.target.closest('[data-student-submit]')) return submitStudentAssignment();

    const resubmitBtn = event.target.closest('[data-student-resubmit]');
    if (resubmitBtn) {
      const assignment = store.assignments.find(function (item) { return item.id === resubmitBtn.dataset.studentResubmit; });
      if (!assignment) return;

      state.studentDraft.title = assignment.title;
      state.studentDraft.description = assignment.description;
      state.studentDraft.imageUrl = assignment.imageUrl;
      state.studentDraft.fileName = '沿用上一版图片';
      state.studentDraft.editingId = assignment.id;
      state.selectedAssignmentId = null;
      showToast('已带回表单，修改后可重新提交');
      render();
    }
  });

  workspace.addEventListener('input', function (event) {
    if (event.target.matches('[data-teacher-search]')) {
      state.teacherSearch = event.target.value;
      render();
      return;
    }

    if (event.target.matches('[data-student-join-code]')) {
      state.studentJoinCode = event.target.value;
      return;
    }

    if (event.target.matches('[data-student-title]')) {
      state.studentDraft.title = event.target.value;
      return;
    }

    if (event.target.matches('[data-student-description]')) {
      state.studentDraft.description = event.target.value;
    }
  });

  workspace.addEventListener('change', function (event) {
    if (event.target.matches('[data-teacher-filter]')) {
      state.teacherFilter = event.target.value;
      render();
      return;
    }

    if (event.target.matches('[data-teacher-sort]')) {
      state.teacherSort = event.target.value;
      render();
      return;
    }

    if (event.target.matches('[data-student-file]')) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (loadEvent) {
        state.studentDraft.imageUrl = loadEvent.target.result;
        state.studentDraft.fileName = file.name;
        render();
      };
      reader.readAsDataURL(file);
    }
  });

  render();
})();
