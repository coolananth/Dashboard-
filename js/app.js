// ===== Navigation =====
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));

  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');

  const titleEl = document.getElementById('topbar-title');
  const titles = { home: 'Dashboard', analytics: 'Analytics', users: 'Users', settings: 'Settings' };
  if (titleEl) titleEl.textContent = titles[pageId] || 'Dashboard';
}

document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

// ===== Toast =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Bar Chart (Home) =====
(function buildBarChart() {
  const data = [
    { day: 'Mon', val: 18400 },
    { day: 'Tue', val: 22100 },
    { day: 'Wed', val: 19800 },
    { day: 'Thu', val: 25600 },
    { day: 'Fri', val: 31200 },
    { day: 'Sat', val: 14300 },
    { day: 'Sun', val: 27800, today: true },
  ];
  const max = Math.max(...data.map(d => d.val));
  const chart = document.getElementById('bar-chart');
  if (!chart) return;

  data.forEach(d => {
    const pct = (d.val / max * 100).toFixed(1);
    chart.innerHTML += `
      <div class="bar-group">
        <div class="bar-val">$${(d.val/1000).toFixed(1)}k</div>
        <div class="bar-track">
          <div class="bar-fill${d.today ? ' today' : ''}" style="height:${pct}%"></div>
        </div>
        <div class="bar-day">${d.day}</div>
      </div>`;
  });
})();

// ===== Line Chart (Analytics) =====
(function buildLineChart() {
  const data = [
    { m: 'Jan', v: 82 }, { m: 'Feb', v: 91 }, { m: 'Mar', v: 105 },
    { m: 'Apr', v: 98 }, { m: 'May', v: 114 }, { m: 'Jun', v: 127 },
    { m: 'Jul', v: 143 }, { m: 'Aug', v: 138 }, { m: 'Sep', v: 152 },
    { m: 'Oct', v: 169 }, { m: 'Nov', v: 158 }, { m: 'Dec', v: 184 },
  ];
  const max = Math.max(...data.map(d => d.v));
  const chart = document.getElementById('line-chart');
  if (!chart) return;

  data.forEach(d => {
    const pct = (d.v / max * 100).toFixed(1);
    chart.innerHTML += `
      <div class="lc-group">
        <div class="lc-fill" style="height:${pct}%"></div>
        <div class="lc-label">${d.m}</div>
      </div>`;
  });
})();

// ===== Users Table: search & filter =====
function filterUsers() {
  const q      = document.getElementById('user-search').value.toLowerCase();
  const role   = document.getElementById('role-filter').value;
  const status = document.getElementById('status-filter').value;
  const rows   = document.querySelectorAll('#users-tbody tr');
  let count = 0;

  rows.forEach(row => {
    const name   = row.dataset.name || '';
    const email  = row.dataset.email || '';
    const rRole  = row.dataset.role || '';
    const rStat  = row.dataset.status || '';

    const matchQ  = !q      || name.includes(q) || email.includes(q);
    const matchR  = !role   || rRole === role;
    const matchS  = !status || rStat === status;

    const show = matchQ && matchR && matchS;
    row.style.display = show ? '' : 'none';
    if (show) count++;
  });
  document.getElementById('user-count').textContent = `${count} users`;
}

// ===== Settings Save =====
function saveSettings() {
  const alert = document.getElementById('settings-alert');
  alert.style.display = 'flex';
  setTimeout(() => alert.style.display = 'none', 3000);
}

// ===== Date =====
const dateEl = document.getElementById('page-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ===== Init =====
navigate('home');
