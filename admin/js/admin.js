/**
 * LUXE Admin Utilities
 * Shared across all admin pages
 */

// ── Guard: redirect if not logged in ──────────────────
function adminGuard() {
  if (!LUXE.isAdmin()) {
    window.location.href = '../admin-login.html';
    return false;
  }
  LUXE._resetInactivityTimer();
  return true;
}

// ── Toast ──────────────────────────────────────────────
function adminToast(msg, type = '') {
  let tc = document.getElementById('adm-toast');
  if (!tc) { tc = document.createElement('div'); tc.id = 'adm-toast'; document.body.appendChild(tc); }
  const t = document.createElement('div');
  t.className = 'adm-toast ' + type;
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Image upload preview helper ─────────────────────────
function initImgUpload(wrapId, previewId, onDataUrl) {
  const wrap    = document.getElementById(wrapId);
  const preview = document.getElementById(previewId);
  if (!wrap) return;
  const input = wrap.querySelector('input[type=file]');
  if (!input) return;
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
      if (onDataUrl) onDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

// ── Modal helpers ─────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── Confirm dialog ─────────────────────────────────────
function adminConfirm(msg, onYes) {
  if (confirm(msg)) onYes();
}

// ── Render sidebar active link ──────────────────────────
function markActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.adm-nav a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
}

// ── Save config helper ─────────────────────────────────
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function saveConfigSection(section, data) {
  const cfg = LUXE.getConfig();
  if (!cfg[section]) cfg[section] = {};
  deepMerge(cfg[section], data);
  LUXE.setConfig(cfg);
  adminToast('Settings saved!', 'success');
}

// ── Color picker sync ──────────────────────────────────
function syncColorInput(colorId, textId) {
  const ci = document.getElementById(colorId);
  const ti = document.getElementById(textId);
  if (!ci || !ti) return;
  ci.addEventListener('input', () => ti.value = ci.value);
  ti.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(ti.value)) ci.value = ti.value; });
}

// ── Drag-and-drop reorder (simple) ─────────────────────
function initDragSort(containerId, onReorder) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let dragEl = null;
  container.addEventListener('dragstart', e => {
    dragEl = e.target.closest('[draggable]');
    if (dragEl) dragEl.style.opacity = '0.4';
  });
  container.addEventListener('dragend', () => {
    if (dragEl) { dragEl.style.opacity = ''; dragEl = null; }
    if (onReorder) onReorder();
  });
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('[draggable]');
    if (target && dragEl && target !== dragEl) {
      const rect = target.getBoundingClientRect();
      const after = (e.clientY - rect.top) > rect.height / 2;
      container.insertBefore(dragEl, after ? target.nextSibling : target);
    }
  });
}

// ── Sidebar toggle (mobile) ────────────────────────────
function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.adm-sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

// ── Logout ─────────────────────────────────────────────
function adminLogout() {
  LUXE.adminLogout();
  window.location.href = '../admin-login.html';
}

// ── Bootstrap admin page ────────────────────────────────
async function initAdminPage(pageTitle) {
  await new Promise(r => setTimeout(r, 60));
  if (!adminGuard()) return false;
  // Set page title in topbar
  const tb = document.getElementById('adm-page-title');
  if (tb && pageTitle) tb.textContent = pageTitle;
  markActiveNav();
  initSidebarToggle();
  // Logout button
  document.querySelectorAll('.adm-logout-btn').forEach(btn => btn.addEventListener('click', adminLogout));
  // Brand name in sidebar
  const cfg = LUXE.getConfig();
  const sbl = document.getElementById('sidebar-brand');
  if (sbl && cfg.store) sbl.textContent = cfg.store.logo_text || cfg.store.name || 'LUXE';
  return true;
}
