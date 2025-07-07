// Offer Info Modal Logic
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('offer-info-modal');
  const card = document.getElementById('offer-info-card');
  const closeBtn = document.getElementById('offer-info-close');
  const nameEl = document.getElementById('offer-info-name');
  const imgEl = document.getElementById('offer-info-image');
  const claimBtn = document.getElementById('offer-info-claim');
  const catEl = document.getElementById('offer-info-categories');
  const bonusesEl = document.getElementById('offer-info-bonuses');
  const vipEl = document.getElementById('offer-info-vip');
  const paymentsEl = document.getElementById('offer-info-payments');

  // Attach event to all info buttons
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const offer = JSON.parse(this.getAttribute('data-offer'));
      nameEl.textContent = offer.name;
      imgEl.src = offer.image;
      claimBtn.href = offer.claimUrl;
      // Categories
      let cats = '';
      for (const [key, val] of Object.entries(offer.categories)) {
        cats += `<div style="margin-bottom:4px;"><strong>${key}:</strong> ${val}</div>`;
      }
      catEl.innerHTML = cats;
      // Show bonuses, VIP, payments
      if (bonusesEl) bonusesEl.textContent = offer.bonuses || '';
      if (vipEl) vipEl.textContent = offer.vip || '';
      if (paymentsEl) paymentsEl.textContent = offer.payments || '';
      modal.style.display = 'flex';
    });
  });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
});
// --- CONFIGURE YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://oytxhozuqrxeebdlnawb.supabase.co'; // <-- replace with your real URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dHhob3p1cXJ4ZWViZGxuYXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODU0OTEsImV4cCI6MjA2NDM2MTQ5MX0.G18pV_EFVfbtQd62tG_S-ED_TRjCptWp-C8dcO2GEEA';  // <-- replace with your real anon key
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // --- HANDLE SUPABASE OAUTH HASH REDIRECT ---
    if (window.location.hash && window.location.hash.includes('access_token')) {
        // For Supabase v2: use exchangeCodeForSession for OAuth redirect
        try {
            const { data, error } = await supabaseClient.auth.exchangeCodeForSession(window.location.hash);
            if (error) {
                console.error('OAuth session exchange error:', error);
            } else {
                console.log('Session set from URL hash');
            }
        } catch (err) {
            console.error('OAuth session exchange exception:', err);
        }
        // Remove the hash from the URL for cleanliness
        window.location.hash = '';
    }

    // --- AGE GATE LOGIC ---
    const ageGateOverlay = document.getElementById('age-gate-overlay');
    const ageYesBtn = document.getElementById('age-yes');
    const ageNoBtn = document.getElementById('age-no');
    if (localStorage.getItem('ageGatePassed') === 'true') {
        if (ageGateOverlay) ageGateOverlay.style.display = 'none';
    } else {
        if (ageGateOverlay) ageGateOverlay.style.display = 'flex';
    }
    if (ageYesBtn) {
        ageYesBtn.onclick = () => {
            localStorage.setItem('ageGatePassed', 'true');
            if (ageGateOverlay) ageGateOverlay.style.display = 'none';
        };
    }
    if (ageNoBtn) {
        ageNoBtn.onclick = () => {
            window.location.href = 'https://www.begambleaware.org/';
        };
    }

    // --- GLOBAL LOGIN BUTTON LOGIC ---
    const globalLoginBtn = document.getElementById('global-login-btn');
    if (globalLoginBtn) {
        globalLoginBtn.onclick = async () => {
            try {
                await supabaseClient.auth.signInWithOAuth({
                    provider: 'twitch',
                    options:
                    {
                        redirectTo: 'https://osecaadegas.github.io/95/',
                    }
                });
            } catch (err) {
                console.error('Login error:', err);
            }
        };
    }

    let currentUser = null;

    async function checkAuthAndSetupScratch() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            console.log('Supabase getUser:', user, error);
            currentUser = user;
            // Show/hide global login button
            if (globalLoginBtn) globalLoginBtn.style.display = user ? 'none' : '';
            // Remove all scratch-login-required logic
            if (!user) {
                return;
            }
        } catch (err) {
            console.error('Auth error:', err);
        }
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        currentUser = session?.user || null;
        checkAuthAndSetupScratch();
    });

    // --- SIDEBAR LOGIC ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    document.addEventListener('click', (e) => {
        if (
            sidebar &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            e.target !== sidebarToggle
        ) {
            sidebar.classList.remove('active');
        }
    });

    // --- PROFILE CARD LOGIC ---
    const profileCard = document.getElementById('profile-card');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const profileSaveBtn = document.getElementById('profile-save-btn');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    const avatarUpload = document.getElementById('avatar-upload');

    let currentProfile = {};
    let currentUserRole = 'user'; // Default role

    async function showProfileCard(user) {
        if (!user) {
            if (profileCard) profileCard.style.display = 'none';
            return;
        }
        if (profileCard) {
            profileCard.style.display = 'flex';
            profileCard.classList.add('collapsed'); // Start collapsed after login
        }
        if (profileEmail) profileEmail.textContent = user.email || user.id;
        // Load profile from Supabase, now including 'role'
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('name,bio,avatar_url,role')
            .eq('id', user.id)
            .single();
        if (!error && data) {
            currentProfile = data;
            currentUserRole = data.role || 'user';
            if (profileName) profileName.value = data.name || '';
            if (profileBio) profileBio.value = data.bio || '';
            if (profileAvatar) {
                profileAvatar.src = data.avatar_url
                    ? data.avatar_url
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || user.email || 'User')}`;
            }
            // Example: Show admin panel if admin
            if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
                // document.getElementById('admin-panel').style.display = 'block';
            }
            // Restrict Overlay link to moderators and above
            const overlayLink = document.querySelector('.nav-link[href*="overlay"]');
            if (overlayLink) {
                if (
                    currentUserRole === 'moderator' ||
                    currentUserRole === 'admin' ||
                    currentUserRole === 'superadmin'
                ) {
                    overlayLink.style.display = '';
                    overlayLink.removeAttribute('aria-disabled');
                    overlayLink.classList.remove('disabled');
                } else {
                    overlayLink.style.display = 'none';
                    overlayLink.setAttribute('aria-disabled', 'true');
                    overlayLink.classList.add('disabled');
                }
            }
        } else {
            currentUserRole = 'user';
            // Defaults
            if (profileName) profileName.value = '';
            if (profileBio) profileBio.value = '';
            if (profileAvatar) profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}`;
        }
    }

    async function saveProfile() {
        if (!currentUser) return;
        const updates = {
            id: currentUser.id,
            name: profileName ? profileName.value : '',
            bio: profileBio ? profileBio.value : '',
            updated_at: new Date().toISOString()
        };
        // If avatar changed, add avatar_url
        if (currentProfile.avatar_url) {
            updates.avatar_url = currentProfile.avatar_url;
        }
        const { error } = await supabaseClient.from('profiles').upsert(updates, { onConflict: ['id'] });
        if (!error) {
            showToast('Profile saved!');
            collapseProfileCard(); // Collapse after saving
        } else {
            showToast('Error saving profile.');
        }
    }

    // Collapse profile card to avatar only
    function collapseProfileCard() {
        if (profileCard) {
            profileCard.classList.add('collapsed');
        }
    }

    // Expand profile card for editing
    function expandProfileCard() {
        if (profileCard) {
            profileCard.classList.remove('collapsed');
        }
    }

    // Add click event to avatar to expand/collapse card
    if (profileAvatar) {
        profileAvatar.addEventListener('click', () => {
            if (profileCard && profileCard.classList.contains('collapsed')) {
                expandProfileCard();
            } else if (profileCard && !profileCard.classList.contains('collapsed')) {
                collapseProfileCard();
            }
        });
    }

    // Avatar upload (base64 demo, not for production)
    if (avatarUpload) {
        avatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async function(evt) {
                if (profileAvatar) profileAvatar.src = evt.target.result;
                currentProfile.avatar_url = evt.target.result; // For demo, store base64 in DB
            };
            reader.readAsDataURL(file);
        });
    }

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener('click', saveProfile);
    }
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.reload();
        });
    }

    // Show/hide profile card on auth change
    async function handleProfileUI(user) {
        currentUser = user;
        if (user) {
            await showProfileCard(user);
        } else {
            if (profileCard) {
                profileCard.style.display = 'none';
                profileCard.classList.remove('collapsed');
            }
        }
    }

    // On page load and auth change
    supabaseClient.auth.getUser().then(({ data: { user }, error }) => {
        console.log('Initial getUser:', user, error); // <-- Add this line
        handleProfileUI(user);
    });
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Profile Auth state changed:', event, session); // <-- Add this line
        handleProfileUI(session?.user || null);
    });

    // --- SESSION CHECK (log user or no active session) ---
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log('User is logged in:', session.user);
        } else {
            console.log('No active session');
        }
    });

    // --- TRANSLATION LOGIC ---
    const translations = {
        en: {
            everything_here: "Everything you need is here",
            offers: "OFFERS",
            register_cashback: "Register to our brands for constant giveaways",
            sapphire_percent: "Open a Discord Ticket",
            sapphire_condition: "For a Gentle gift",
            oscarspin_percent: "1st deposit cashback up to 20€",
            oscarspin_condition: "No double accounts are covered",
            vicibet_percent: "+100% +200 Free Spins",
            vicibet_condition: "+15% cashback for losses over 100€ monthly",
            buran_percent: "1st deposit cashback up to 20€",
            buran_condition: "+15% cashback for losses over 100€ monthly",
            arena_code: "Code: secaadegas",
            arena_condition: "use my code for in-game rewards",
            rollingslots_percent: "No Deposit",
            rollingslots_condition: "40x free spins"
        },
        pt: {
            everything_here: "Tudo o que você precisa está aqui",
            offers: "OFERTAS",
            register_cashback: "Regista-te nas nossas marcas para sorteios constantes",
            sapphire_percent: "Abra um ticket no Discord",
            sapphire_condition: "Para um presente gentil",
            oscarspin_percent: "Cashback de até 20€ no 1º depósito",
            oscarspin_condition: "Contas duplicadas não são cobertas",
            vicibet_percent: "+100% +200 Rodadas Grátis",
            vicibet_condition: "+15% de cashback para perdas acima de 100€ por mês",
            buran_percent: "Cashback de até 20€ no 1º depósito",
            buran_condition: "+15% de cashback para perdas acima de 100€ por mês",
            arena_code: "Código: secaadegas",
            arena_condition: "use meu código para recompensas no jogo",
            rollingslots_percent: "Sem Depósito",
            rollingslots_condition: "40x rodadas grátis"
        }
    };

    function setLanguage(lang) {
        const dict = translations[lang] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            // Map old keys to new ones for compatibility
            let mappedKey = key;
            if (key === 'infinity_percent') mappedKey = 'vicibet_percent';
            if (key === 'infinity_condition') mappedKey = 'vicibet_condition';
            if (dict[mappedKey]) el.textContent = dict[mappedKey];
        });
        // Update toggle UI
        document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');
        document.getElementById('lang-pt')?.classList.toggle('active', lang === 'pt');
    }

    // Language toggle logic
    const langToggle = document.getElementById('lang-toggle');
    function getSavedLang() {
        return localStorage.getItem('lang') || 'en';
    }
    function saveLang(lang) {
        localStorage.setItem('lang', lang);
    }
    function updateLangFromToggle() {
        const lang = langToggle && langToggle.checked ? 'pt' : 'en';
        setLanguage(lang);
        saveLang(lang);
    }
    if (langToggle) {
        // Set initial state from storage
        const savedLang = getSavedLang();
        langToggle.checked = savedLang === 'pt';
        setLanguage(savedLang);
        langToggle.addEventListener('change', updateLangFromToggle);
    } else {
        setLanguage(getSavedLang());
    }

    // --- INITIALIZE ---
    checkAuthAndSetupScratch();
});

// Add this function near the top or bottom of your script
function showToast(msg) {
    let toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.top = '24px';
    toast.style.right = '32px';
    toast.style.background = '#1a2233';
    toast.style.color = '#6ec1e4';
    toast.style.padding = '12px 22px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 4px 24px #000a';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '1em';
    toast.style.zIndex = 9999;
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// Example usage anywhere in your code:
// if (currentUserRole === 'superadmin') { /* show superadmin features */ }
// if (currentUserRole === 'moderator') { /* show moderator features */ }