// auth.js

  // Page role restrictions
  // ------------------------------
// ------------------------------
// Page protection (must run first)
// ------------------------------
const user = JSON.parse(sessionStorage.getItem('lm_user') || '{}');
const currentPage = window.location.pathname.split('/').pop().toLowerCase();

// Define role-specific pages
// Pages may be accessible to more than one role; list pages per role below.
const rolePages = {
  student: ['student-form-submit.html', 'application-history.html'],
  employer: ['employee-dashboard.html', 'employer-patient-tracker.html', 'employer-internship-tracker.html'],
  admin: ['admin-dashboard.html', 'admin-patient-tracker.html', 'employer-internship-tracker.html']
};

// Common pages accessible to all logged-in users
const commonPages = ['events.html', 'settings.html', 'profile.html'];

// Normalize page name (ignore query strings)
const pageName = currentPage.split('?')[0];

// Determine which roles (if any) are allowed to view this page
const allowedRoles = Object.entries(rolePages)
  .filter(([role, pages]) => pages.includes(pageName))
  .map(([role]) => role);

// Redirect if page is role-restricted and the current user is not signed-in or not in the allowed roles
if ((allowedRoles.length && (!user.email || !allowedRoles.includes(user.role))) ||
    (commonPages.includes(pageName) && !user.email)) {
  alert('sign in with the correct account to access this page');
  sessionStorage.removeItem('lm_user'); // Ensure user is fully logged out
  sessionStorage.removeItem('lm_profile'); // Clear profile data too
  window.location.href = 'login.html';
}


// dom content loaded

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // Utility function
  // ------------------------------
  const el = id => document.getElementById(id);

  // ------------------------------


  // ------------------------------
  // Demo users (replace with real backend)
  // ------------------------------
  const demoUsers = {
    'student@lancashiremedicare.co.uk': { password: 'password', role: 'student', name: 'student test' },
    'employer@lancashiremedicare.co.uk': { password: 'password', role: 'employer', name: 'Employer test' },
    'admin@lancashiremedicare.co.uk': { password: 'password', role: 'admin', name: 'Administrator test' }
  };

  // ------------------------------
  // Toggle password visibility
  // ------------------------------
  if (el('toggleLoginPwd')) {
    el('toggleLoginPwd').addEventListener('click', () => {
      const p = el('loginPassword');
      const icon = el('toggleLoginIcon');
      if (p.type === 'password') { p.type = 'text'; icon.className = 'bi bi-eye'; }
      else { p.type = 'password'; icon.className = 'bi bi-eye-slash'; }
    });
  }

  // ------------------------------
  // LOGIN FORM
  // ------------------------------
  if (el('loginForm')) {
    el('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      el('loginError').style.display = 'none';

      const email = (el('loginEmail').value || '').trim().toLowerCase();
      const pwd = el('loginPassword').value || '';

      if (!email || !pwd) {
        el('loginError').textContent = 'Enter email and password.';
        el('loginError').style.display = '';
        return;
      }

      const user = demoUsers[email];
      if (!user || user.password !== pwd) {
        el('loginError').textContent = 'Invalid credentials. Use demo accounts or create one.';
        el('loginError').style.display = '';
        return;
      }

      const name = user.name || email.split('@')[0];
      sessionStorage.setItem('lm_user', JSON.stringify({ email, role: user.role, name }));

      // Update header UI
      if (el('signedInUser') && el('notSigned')) {
        el('signedInUser').style.display = 'inline-flex';
        el('signedAvatar').src = '';
        el('signedName').textContent = name;
        el('notSigned').style.display = 'none';
      }

      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'student') window.location.href = 'application-history.html';
        else if (user.role === 'employer') window.location.href = 'employee-dashboard.html';
        else window.location.href = 'admin-dashboard.html';
      }, 400);
    });
  }

  // ------------------------------
  // SIGNUP FORM
  // ------------------------------
  if (el('roleSelect')) {
    el('roleSelect').addEventListener('change', (e) => {
      const val = e.target.value;
      const container = el('roleExtra');
      container.innerHTML = '';

      if (val === 'student') {
        container.innerHTML = `
          <div class="mb-3">
            <label class="form-label">Student ID</label>
            <input id="studentId" class="form-control" required>
          </div>
          <div class="mb-2 small-muted">You will be asked to verify student status.</div>`;
      } else if (val === 'employer') {
        container.innerHTML = `
          <div class="mb-3">
            <label class="form-label">Company / Institution</label>
            <input id="company" class="form-control" required>
          </div>`;
      } else if (val === 'admin') {
        container.innerHTML = `
          <div class="mb-3">
            <label class="form-label">Input Authentication code</label>
            <input id="adminCode" class="form-control" required>
          </div>`;
      }
    });
  }

  if (el('signupForm')) {
    el('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      el('signupMsg').style.display = 'none';

      const email = (el('signupEmail').value || '').trim().toLowerCase();
      const pwd = el('signupPassword').value || '';
      const confirm = el('confirmPassword').value || '';
      const role = el('roleSelect').value;

      if (!email || !pwd || !confirm || !role) {
        el('signupMsg').textContent = 'Complete all required fields.';
        el('signupMsg').style.display = '';
        return;
      }

      if (pwd.length < 8) {
        el('signupMsg').textContent = 'Password must be at least 8 characters.';
        el('signupMsg').style.display = ''; 
        return;
      }

      if (pwd !== confirm) {
        el('signupMsg').textContent = 'Passwords do not match.';
        el('signupMsg').style.display = ''; 
        return;
      }

      if (demoUsers[email]) {
        el('signupMsg').textContent = 'An account with that email already exists.';
        el('signupMsg').style.display = ''; 
        return;
      }

      if (role === 'admin' && (el('adminCode')?.value || '') !== 'ADM1N-SECRET') {
        el('signupMsg').textContent = 'Invalid admin passcode.';
        el('signupMsg').style.display = ''; 
        return;
      }

      const name = (el('firstName')?.value || '') + ' ' + (el('lastName')?.value || '');
      demoUsers[email] = { password: pwd, role, name };
      el('signupMsg').textContent = 'Account created (demo). Redirecting...';
      el('signupMsg').style.display = '';

      setTimeout(() => {
        sessionStorage.setItem('lm_user', JSON.stringify({ email, role, name }));
        if (role === 'student') window.location.href = 'student-form-submit.html';
        else if (role === 'employer') window.location.href = 'employee-dashboard.html';
        else window.location.href = 'admin-dashboard.html';
      }, 800);
    });
  }

// Default avatar for all pages
const defaultAvatarSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2369c0ff;stop-opacity:1"/><stop offset="100%" style="stop-color:%2363e6a0;stop-opacity:1"/></linearGradient></defs><circle cx="150" cy="150" r="150" fill="url(%23grad)"/><text x="50%" y="55%" font-family="Arial, sans-serif" font-size="120" fill="white" text-anchor="middle" alignment-baseline="middle">?</text></svg>';

// ------------------------------
// Header login state
// ------------------------------
const signedDivs = document.querySelectorAll('#signedInUser');
const notSignedDivs = document.querySelectorAll('#notSigned');
const nameEls = document.querySelectorAll('#signedName');
const avatarEls = document.querySelectorAll('#signedAvatar');
// Also get any "Signed in as" text nodes to hide/show
const signedInText = Array.from(document.querySelectorAll('#signedInUser'))
  .filter(el => el.childNodes[0]?.nodeType === Node.TEXT_NODE && el.childNodes[0].textContent.trim() === 'Signed in as')
  .map(el => el.childNodes[0]);

// Helpers to read session values dynamically
const getStoredUser = () => {
  const raw = sessionStorage.getItem('lm_user');
  return raw ? JSON.parse(raw) : null;
};
const getProfile = () => {
  const raw = sessionStorage.getItem('lm_profile');
  return raw ? JSON.parse(raw) : null;
};

function applyHeaderState() {
  const user = getStoredUser();
  const profile = getProfile();

  if (user) {
    signedDivs.forEach(div => div.style.display = 'inline-flex');
    const displayName = (profile && profile.name) ? profile.name : user.name;
    nameEls.forEach(el => el.textContent = displayName);
    avatarEls.forEach(el => {
      el.src = (profile && profile.image) ? profile.image : defaultAvatarSvg;
      el.style.display = '';
      el.classList.remove('d-none');
    });
    signedInText.forEach(node => node.textContent = 'Signed in as');
    notSignedDivs.forEach(div => div.style.display = 'none');
  } else {
    signedDivs.forEach(div => div.style.display = 'none');
    notSignedDivs.forEach(div => div.style.display = 'inline-flex');
    // Clear "Signed in as" text when logged out
    signedInText.forEach(node => node.textContent = '');
    // hide any avatar elements when signed out (prevents default pic showing)
    avatarEls.forEach(el => {
      el.style.display = 'none';
    });
  }
}

applyHeaderState();
//----------------------------
  // Logout (works on all pages)
  // ------------------------------
  // Broadcast channel for session sync across tabs
  const channel = new BroadcastChannel('lm_session');

  // Listen for messages from other tabs
  channel.onmessage = (ev) => {
    const msg = ev.data || {};
    if (msg.type === 'profile_update') {
      if (msg.profile) sessionStorage.setItem('lm_profile', msg.profile);
      if (msg.user) sessionStorage.setItem('lm_user', msg.user);
      applyHeaderState();
    } else if (msg.type === 'logout') {
      // Another tab logged out - redirect this tab
      window.location.href = 'login.html';
    }
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.logoutBtn')) {
      e.preventDefault();
      // Notify other tabs to logout as well
      channel.postMessage({ type: 'logout' });
      sessionStorage.removeItem('lm_user');
      sessionStorage.removeItem('lm_profile');
      window.location.href = 'login.html';
    }
  });

  // ------------------------------
  // Profile page: avatar upload and save
  // ------------------------------
  if (el('avatarInput') || el('avatarPreview') || el('profileForm')) {
    const avatarInput = el('avatarInput');
    const avatarPreview = el('avatarPreview');
    const displayNameEl = el('displayName');
    const firstNameEl = el('firstName');
    const lastNameEl = el('lastName');
    const emailEl = el('email');

  // Get current user data
  const userData = getStoredUser();
  const profile = getProfile();
    
    // Fill in form with user data if available
    if (userData) {
      // Split name into first and last
      const nameParts = userData.name.split(' ');
      if (firstNameEl) firstNameEl.value = nameParts[0] || '';
      if (lastNameEl) lastNameEl.value = nameParts.slice(1).join(' ') || '';
      if (emailEl) {
        emailEl.value = userData.email;
        emailEl.readOnly = true; // Make email readonly since it's their login
      }
      if (displayNameEl) displayNameEl.textContent = userData.name;
    }

    // Load any additional profile data if it exists
    if (profile) {
      if (avatarPreview && profile.image) avatarPreview.src = profile.image;
      if (displayNameEl && profile.name) displayNameEl.textContent = profile.name;
      // If profile has different name parts, use those (they may have updated it)
      if (profile.name) {
        const profileNameParts = profile.name.split(' ');
        if (firstNameEl) firstNameEl.value = profileNameParts[0] || '';
        if (lastNameEl) lastNameEl.value = profileNameParts.slice(1).join(' ') || '';
      }
    }

    if (avatarInput) {
      avatarInput.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
          alert('Image too large. Max 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          // Update preview
          if (avatarPreview) {
            avatarPreview.src = dataUrl;
          }
          
          // Save to profile and update all avatars
          const newProfile = Object.assign({}, profile || {}, { image: dataUrl });
          sessionStorage.setItem('lm_profile', JSON.stringify(newProfile));
          
          // Update all avatars on current page
          avatarEls.forEach(el => {
            el.src = dataUrl;
            el.style.display = '';
            el.classList.remove('d-none');
          });

          // Notify other tabs via BroadcastChannel
          try { channel.postMessage({ type: 'profile_update', profile: JSON.stringify(newProfile) }); } catch (err) { /* ignore */ }
        };
        reader.readAsDataURL(f);
      });
    }

    if (el('profileForm')) {
      el('profileForm').addEventListener('submit', (e) => {
        // keep native submit behavior for servers, but update local preview/storage
        const first = (el('firstName')?.value || '').trim();
        const last = (el('lastName')?.value || '').trim();
        const full = `${first} ${last}`.trim();
        const newProfile = Object.assign({}, profile || {}, { name: full || undefined });
        sessionStorage.setItem('lm_profile', JSON.stringify(newProfile));

        // also update lm_user.name if user is logged in
        const su = sessionStorage.getItem('lm_user');
        let up = null;
        if (su) {
          try {
            up = JSON.parse(su);
            up.name = full || up.name;
            sessionStorage.setItem('lm_user', JSON.stringify(up));
          } catch (err) { /* ignore */ }
        }

        // broadcast changes to other tabs
        try { channel.postMessage({ type: 'profile_update', profile: JSON.stringify(newProfile), user: up ? JSON.stringify(up) : null }); } catch (err) { /* ignore */ }

        // update header and small preview name
        if (displayNameEl && newProfile.name) displayNameEl.textContent = newProfile.name;
        applyHeaderState();
        // allow form to submit normally in case server expects it
      });
    }
  }

  // (SessionStorage is not shared between tabs, we use BroadcastChannel above to sync)

  // ------------------------------
  // Optional UI helpers
  // ------------------------------
  const authListItems = document.querySelectorAll('.auth-side ul li');
  if (authListItems.length) {
    authListItems.forEach(li => li.style.listStyle = 'disc');
  }

});
