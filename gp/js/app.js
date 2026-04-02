/* ============================================
   CYBER ATTACK SIMULATION LAB - APP.JS
   Shared utilities, auth, sidebar, notifications
   ============================================ */

'use strict';

/* ── Auth ── */
const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem('casl_user');
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('casl_user')); }
    catch { return null; }
  },
  logout() {
    localStorage.removeItem('casl_user');
    window.location.href = 'index.html';
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
};

/* ── Toast Notifications ── */
const Toast = {
  container: null,

  init() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  },

  show(title, message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const icons = {
      success: 'fa-circle-check',
      error:   'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info:    'fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <i class="fas fa-xmark"></i>
      </button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(title, msg) { this.show(title, msg, 'success'); },
  error(title, msg)   { this.show(title, msg, 'error'); },
  warning(title, msg) { this.show(title, msg, 'warning'); },
  info(title, msg)    { this.show(title, msg, 'info'); }
};

/* ── Clock ── */
function startClock(el) {
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  update();
  setInterval(update, 1000);
}

/* ── Sidebar active state ── */
function setSidebarActive() {
  const path = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    if (href === path) item.classList.add('active');
    else item.classList.remove('active');
  });
}

/* ── Populate user info in sidebar ── */
function populateUserInfo() {
  const user = Auth.getUser();
  if (!user) return;
  const nameEl = document.getElementById('sidebar-user-name');
  const roleEl = document.getElementById('sidebar-user-role');
  const avatarEl = document.getElementById('sidebar-user-avatar');
  if (nameEl) nameEl.textContent = user.name || 'Admin';
  if (roleEl) roleEl.textContent = user.role || 'Security Analyst';
  if (avatarEl) avatarEl.textContent = (user.name || 'A').charAt(0).toUpperCase();
}

/* ── Sim state (shared across pages) ── */
const SimState = {
  get() {
    try { return JSON.parse(localStorage.getItem('casl_sim_state') || '{}'); }
    catch { return {}; }
  },
  set(data) {
    localStorage.setItem('casl_sim_state', JSON.stringify(data));
  },
  update(key, val) {
    const s = this.get();
    s[key] = val;
    this.set(s);
  }
};

/* ── Alert counter shared state ── */
const AlertStore = {
  key: 'casl_alerts',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { return []; }
  },
  add(alert) {
    const alerts = this.get();
    alerts.unshift({ ...alert, id: Date.now(), time: new Date().toISOString() });
    if (alerts.length > 200) alerts.pop();
    localStorage.setItem(this.key, JSON.stringify(alerts));
  },
  clear() { localStorage.setItem(this.key, '[]'); }
};

/* ── Random generators ── */
const Rand = {
  int(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  item(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  ip() { return `${this.int(10,192)}.${this.int(0,255)}.${this.int(0,255)}.${this.int(1,254)}`; },
  mac() {
    return Array.from({length:6}, () => this.int(0,255).toString(16).padStart(2,'0')).join(':');
  },
  hex(len) {
    return Array.from({length:len}, () => this.int(0,15).toString(16)).join('');
  }
};

/* ── Countdown / interval helper ── */
function createInterval(fn, ms) {
  const id = setInterval(fn, ms);
  return () => clearInterval(id);
}

/* ── Format utilities ── */
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour12: false });
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/* ── Update badge count ── */
function updateNavBadge(id, count) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

/* ── Init on DOM load ── */
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  startClock(document.getElementById('header-clock'));
  setSidebarActive();
  populateUserInfo();

  // logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout.bind(Auth));

  // update alerts badge
  const alerts = AlertStore.get();
  const criticals = alerts.filter(a => a.severity === 'critical' && !a.read).length;
  updateNavBadge('alerts-badge', criticals > 0 ? criticals : '');
});
