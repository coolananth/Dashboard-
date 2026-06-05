// ===== Navigation =====
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link[data-page]').forEach(a => a.classList.remove('active'));

  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');

  const titles = { home: 'Dashboard', analytics: 'Analytics', users: 'Users', settings: 'Settings' };
  document.getElementById('topbar-title').textContent = titles[pageId] || 'Dashboard';
}

document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.page); });
});

// ===== Toast =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Helpers =====
function statCardHTML(s) {
  return `
    <div class="stat-card ${s.color}">
      <div class="stat-bg-icon"><i class="bi ${s.icon}"></i></div>
      <div class="stat-top">
        <div class="stat-icon-box"><i class="bi ${s.icon}"></i></div>
        <span class="stat-delta">${s.delta}</span>
      </div>
      <div class="stat-val">${s.value}</div>
      <div class="stat-label">${s.label}</div>
      ${s.sub ? `<div class="stat-sub">${s.sub}</div>` : ''}
    </div>`;
}

function progressRowHTML(name, pct, color, prefixIcon) {
  const left = prefixIcon
    ? `<i class="bi ${prefixIcon}" style="color:${color};font-size:1.2rem;flex-shrink:0;"></i>`
    : `<div class="traffic-dot" style="background:${color};"></div>`;
  return `
    <div class="traffic-item">
      ${left}
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
          <span style="font-size:13px;font-weight:500;">${name}</span>
          <span style="font-size:12px;color:#64748b;">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;background:${color};"></div>
        </div>
      </div>
    </div>`;
}

// ===== Render Functions =====
function renderStatGrid(id, stats) {
  document.getElementById(id).innerHTML = stats.map(statCardHTML).join('');
}

function renderBarChart(data) {
  const max = Math.max(...data.map(d => d.val));
  document.getElementById('bar-chart').innerHTML = data.map(d => `
    <div class="bar-group">
      <div class="bar-val">$${(d.val / 1000).toFixed(1)}k</div>
      <div class="bar-track">
        <div class="bar-fill${d.today ? ' today' : ''}" style="height:${(d.val / max * 100).toFixed(1)}%"></div>
      </div>
      <div class="bar-day">${d.day}</div>
    </div>`).join('');
}

function renderTrafficSources(data) {
  document.getElementById('traffic-sources').innerHTML =
    data.map(s => progressRowHTML(s.name, s.pct, s.color, null)).join('');
}

function renderActivities(data) {
  document.getElementById('activity-feed').innerHTML = data.map(a => `
    <div class="activity-item">
      <div class="act-icon" style="background:${a.color};"><i class="bi ${a.icon}"></i></div>
      <div class="act-body">
        <div class="act-title">${a.title}</div>
        <div class="act-detail">${a.detail}</div>
      </div>
      <div class="act-time">${a.time}</div>
    </div>`).join('');
}

function renderLineChart(data) {
  const max = Math.max(...data.map(d => d.val));
  document.getElementById('line-chart').innerHTML = data.map(d => `
    <div class="lc-group">
      <div class="lc-fill" style="height:${(d.val / max * 100).toFixed(1)}%"></div>
      <div class="lc-label">${d.month}</div>
    </div>`).join('');
}

function renderTopPages(data) {
  document.getElementById('top-pages-tbody').innerHTML = data.map(p => `
    <tr>
      <td><span style="color:#3b82f6;">/</span>${p.path}</td>
      <td>${p.views}</td>
      <td style="color:#64748b;">${p.bounce}</td>
    </tr>`).join('');
}

function renderDevices(data) {
  document.getElementById('devices-list').innerHTML =
    data.map(d => progressRowHTML(d.name, d.pct, d.color, d.icon)).join('');
}

function renderUsersTable(data) {
  document.getElementById('users-tbody').innerHTML = data.map(u => `
    <tr data-name="${u.name.toLowerCase()}" data-email="${u.email}" data-role="${u.role}" data-status="${u.status}">
      <td style="padding-left:20px;">
        <div class="user-cell">
          <div class="avatar-sm" style="background:${u.color};">${u.initials}</div>
          <div>
            <div style="font-weight:600;">${u.name}</div>
            <div style="font-size:12px;color:#64748b;">${u.email}</div>
          </div>
        </div>
      </td>
      <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></td>
      <td><span class="status-dot ${u.status.toLowerCase()}">${u.status}</span></td>
      <td style="color:#64748b;font-size:13px;">${u.joined}</td>
      <td style="color:#64748b;font-size:13px;">${u.lastActive}</td>
      <td style="text-align:right;padding-right:20px;">
        <button class="btn btn-outline btn-icon" onclick="showToast('Editing ${u.name}…')"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-outline btn-icon" onclick="deleteUser(this, ${u.id})" style="color:#ef4444;border-color:#fecaca;margin-left:4px;"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
  updateUserCount();
}

function renderProfile(profile) {
  document.getElementById('profile-initials').textContent = profile.initials;
  document.getElementById('profile-name').value  = profile.name;
  document.getElementById('profile-email').value = profile.email;
  document.getElementById('profile-role').value  = profile.role;
  // also update sidebar avatar & topbar
  document.querySelectorAll('.sidebar-avatar').forEach(el => el.textContent = profile.initials);
  document.querySelectorAll('.topbar-avatar').forEach(el => el.textContent  = profile.initials);
  document.getElementById('sidebar-user-name').textContent = profile.name;
  document.getElementById('sidebar-user-role').textContent = profile.role;
}

function renderNotifications(data) {
  document.getElementById('notifications-list').innerHTML = data.map((n, i) => `
    <div class="toggle-row">
      <div>
        <div style="font-weight:600;font-size:14px;">${n.label}</div>
        <div style="font-size:12px;color:#64748b;">${n.desc}</div>
      </div>
      <label class="toggle">
        <input type="checkbox" ${n.enabled ? 'checked' : ''} />
        <span class="toggle-slider"></span>
      </label>
    </div>`).join('');
}

// ===== Users: filter & delete =====
function filterUsers() {
  const q      = document.getElementById('user-search').value.toLowerCase();
  const role   = document.getElementById('role-filter').value;
  const status = document.getElementById('status-filter').value;
  document.querySelectorAll('#users-tbody tr').forEach(row => {
    const show =
      (!q      || row.dataset.name.includes(q) || row.dataset.email.includes(q)) &&
      (!role   || row.dataset.role   === role)   &&
      (!status || row.dataset.status === status);
    row.style.display = show ? '' : 'none';
  });
  updateUserCount();
}

function updateUserCount() {
  const visible = [...document.querySelectorAll('#users-tbody tr')].filter(r => r.style.display !== 'none').length;
  document.getElementById('user-count').textContent = `${visible} users`;
}

function deleteUser(btn, id) {
  btn.closest('tr').remove();
  updateUserCount();
  showToast('User removed!');
}

// ===== Settings Save =====
function saveSettings() {
  const alert = document.getElementById('settings-alert');
  alert.style.display = 'flex';
  setTimeout(() => alert.style.display = 'none', 3000);
}

// ===== Lumen AI Chat =====
const LUMEN_KEY_STORE = 'lumen_api_key';
let lumenHistory = [];
let lumenOpen = false;

function toggleLumenChat() {
  lumenOpen = !lumenOpen;
  const panel = document.getElementById('lumen-panel');
  panel.classList.toggle('open', lumenOpen);
  if (lumenOpen) {
    const key = localStorage.getItem(LUMEN_KEY_STORE);
    if (key) {
      showLumenChat();
    } else {
      showLumenSetup();
    }
  }
}

function showLumenSetup() {
  document.getElementById('lumen-setup').style.display = '';
  document.getElementById('lumen-chat').style.display = 'none';
  setTimeout(() => document.getElementById('lumen-key-input').focus(), 50);
}

function showLumenChat() {
  document.getElementById('lumen-setup').style.display = 'none';
  document.getElementById('lumen-chat').style.display = 'flex';
  setTimeout(() => document.getElementById('lumen-input').focus(), 50);
}

function lumenShowKeyPrompt() {
  showLumenSetup();
  document.getElementById('lumen-key-input').value = localStorage.getItem(LUMEN_KEY_STORE) || '';
}

function lumenSaveKey() {
  const key = document.getElementById('lumen-key-input').value.trim();
  if (!key) return;
  localStorage.setItem(LUMEN_KEY_STORE, key);
  lumenHistory = [];
  showLumenChat();
  document.getElementById('lumen-messages').innerHTML = `
    <div class="lumen-msg assistant">
      <div class="lumen-bubble">Hi! I'm Lumen AI. Ask me anything about your dashboard.</div>
    </div>`;
}

function lumenAppendMsg(role, text) {
  const feed = document.getElementById('lumen-messages');
  const div = document.createElement('div');
  div.className = `lumen-msg ${role}`;
  div.innerHTML = `<div class="lumen-bubble">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
  return div;
}

function lumenShowTyping() {
  const feed = document.getElementById('lumen-messages');
  const div = document.createElement('div');
  div.className = 'lumen-msg assistant';
  div.id = 'lumen-typing';
  div.innerHTML = `<div class="lumen-bubble"><div class="lumen-typing"><span></span><span></span><span></span></div></div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function lumenRemoveTyping() {
  const el = document.getElementById('lumen-typing');
  if (el) el.remove();
}

async function lumenSend() {
  const input = document.getElementById('lumen-input');
  const text = input.value.trim();
  if (!text) return;

  const key = localStorage.getItem(LUMEN_KEY_STORE);
  if (!key) { showLumenSetup(); return; }

  input.value = '';
  input.disabled = true;
  const sendBtn = document.getElementById('lumen-send-btn');
  sendBtn.disabled = true;

  lumenAppendMsg('user', text);
  lumenHistory.push({ role: 'user', content: text });
  lumenShowTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: 'You are Lumen AI, a helpful assistant embedded in the HiDash dashboard. Help users understand their analytics data, user metrics, revenue trends, and settings. Be concise and friendly.',
        messages: lumenHistory,
      }),
    });

    lumenRemoveTyping();

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `API error ${res.status}`;
      lumenAppendMsg('assistant', `Error: ${msg}`);
      if (res.status === 401) {
        localStorage.removeItem(LUMEN_KEY_STORE);
        setTimeout(showLumenSetup, 1200);
      }
    } else {
      const data = await res.json();
      const reply = data.content?.[0]?.text || '(no response)';
      lumenHistory.push({ role: 'assistant', content: reply });
      lumenAppendMsg('assistant', reply);
    }
  } catch (e) {
    lumenRemoveTyping();
    lumenAppendMsg('assistant', 'Network error. Please check your connection and try again.');
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// ===== Date =====
document.getElementById('page-date').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// ===== Boot: load db.json then render =====
fetch('db.json')
  .then(r => r.json())
  .then(db => {
    renderStatGrid('home-stats',      db.homeStats);
    renderBarChart(db.weeklyRevenue);
    renderTrafficSources(db.trafficSources);
    renderActivities(db.activities);
    renderStatGrid('analytics-stats', db.analyticsStats);
    renderLineChart(db.monthlyViews);
    renderTopPages(db.topPages);
    renderDevices(db.devices);
    renderStatGrid('users-stats',     db.usersStats);
    renderUsersTable(db.users);
    renderProfile(db.profile);
    renderNotifications(db.notifications);
    navigate('home');
  })
  .catch(() => {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;flex-direction:column;gap:12px;">
        <strong style="font-size:18px;">Could not load db.json</strong>
        <p style="color:#64748b;">Serve the project with a local web server, e.g.:<br>
        <code style="background:#f1f5f9;padding:4px 8px;border-radius:6px;">python -m http.server 8080</code></p>
      </div>`;
  });
