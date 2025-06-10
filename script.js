// --- CONFIGURE YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://oytxhozuqrxeebdlnawb.supabase.co'; // <-- replace with your real URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dHhob3p1cXJ4ZWViZGxuYXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODU0OTEsImV4cCI6MjA2NDM2MTQ5MX0.G18pV_EFVfbtQd62tG_S-ED_TRjCptWp-C8dcO2GEEA';  // <-- replace with your real anon key
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // --- HANDLE SUPABASE OAUTH HASH REDIRECT ---
    if (window.location.hash && window.location.hash.includes('access_token')) {
        // This will parse the hash and set the session
        await supabaseClient.auth.getSessionFromUrl({ storeSession: true });
        console.log('Session set from URL hash'); // <-- Add this line
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

    // --- SCRATCH CARD LOGIC ---
    const scratchSection = document.getElementById('scratch-card-section');
    const scratchImage = document.querySelector('.scratch-image');
    const scratchWinImage = document.querySelector('.scratch-win-image');
    const scratchLoseImage = document.querySelector('.scratch-lose-image');
    const scratchMessage = document.querySelector('.scratch-message');
    const scratchTryFooter = document.querySelector('.scratch-try-footer');
    let currentUser = null;
    let scratchUsed = false;

    // --- GLOBAL LOGIN BUTTON LOGIC ---
    const globalLoginBtn = document.getElementById('global-login-btn');
    if (globalLoginBtn) {
        globalLoginBtn.onclick = async () => {
            try {
                await supabaseClient.auth.signInWithOAuth({
                    provider: 'twitch',
                    options: {
                        redirectTo: 'https://osecaadegas.github.io/95/',
                    }
                });
            } catch (err) {
                console.error('Login error:', err);
            }
        };
    }

    async function checkAuthAndSetupScratch() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            console.log('Supabase getUser:', user, error);
            currentUser = user;
            // Show/hide global login button
            if (globalLoginBtn) globalLoginBtn.style.display = user ? 'none' : '';
            // Remove all scratch-login-required logic
            if (!user) {
                if (scratchSection) scratchSection.style.display = 'none';
                if (scratchMessage) scratchMessage.textContent = '';
                return;
            }
            if (scratchSection) scratchSection.style.display = 'block';
            checkScratchUsage();
        } catch (err) {
            console.error('Auth error:', err);
        }
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        currentUser = session?.user || null;
        checkAuthAndSetupScratch();
    });

    async function checkScratchUsage() {
        if (!currentUser) return;
        try {
            const { data, error } = await supabaseClient
                .from('scratch_usage')
                .select('used_at')
                .eq('user_id', currentUser.id)
                .order('used_at', { ascending: false })
                .limit(1);

            if (error) {
                if (scratchMessage) scratchMessage.textContent = 'Error checking scratch usage.';
                disableScratch();
                console.error('Scratch usage error:', error);
                return;
            }

            if (data && data.length > 0) {
                const lastUsed = new Date(data[0].used_at);
                const now = new Date();
                const diffMs = now - lastUsed;
                const diffHrs = diffMs / (1000 * 60 * 60);
                if (diffHrs < 24) {
                    scratchUsed = true;
                    const hoursLeft = Math.ceil(24 - diffHrs);
                    if (scratchMessage) scratchMessage.textContent = `You already used the scratch card. Try again in ${hoursLeft} hour(s)!`;
                    disableScratch();
                    return;
                }
            }
            scratchUsed = false;
            enableScratch();
        } catch (err) {
            if (scratchMessage) scratchMessage.textContent = 'Error checking scratch usage.';
            disableScratch();
            console.error('Scratch usage error:', err);
        }
    }

    function enableScratch() {
        if (scratchImage) {
            scratchImage.style.pointerEvents = 'auto';
            scratchImage.style.opacity = '1';
            scratchImage.onclick = handleScratch;
        }
        if (scratchMessage) scratchMessage.textContent = '';
        if (scratchTryFooter) scratchTryFooter.style.display = '';
        if (scratchWinImage) scratchWinImage.style.display = 'none';
        if (scratchLoseImage) scratchLoseImage.style.display = 'none';
    }

    function disableScratch() {
        if (scratchImage) {
            scratchImage.style.pointerEvents = 'none';
            scratchImage.style.opacity = '0.5';
            scratchImage.onclick = null;
        }
        if (scratchTryFooter) scratchTryFooter.style.display = 'none';
    }

    async function handleScratch() {
        if (scratchUsed || !currentUser) return;
        const win = Math.random() < 0.5;
        if (win) {
            if (scratchWinImage) scratchWinImage.style.display = 'block';
            if (scratchLoseImage) scratchLoseImage.style.display = 'none';
            if (scratchMessage) scratchMessage.textContent = 'Congratulations! You won!';
        } else {
            if (scratchWinImage) scratchWinImage.style.display = 'none';
            if (scratchLoseImage) scratchLoseImage.style.display = 'block';
            if (scratchMessage) scratchMessage.textContent = 'Better luck next time!';
        }
        try {
            await supabaseClient.from('scratch_usage').insert([
                { user_id: currentUser.id, used_at: new Date().toISOString() }
            ]);
        } catch (err) {
            console.error('Scratch insert error:', err);
        }
        scratchUsed = true;
        disableScratch();
    }

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

    async function showProfileCard(user) {
        if (!user) {
            if (profileCard) profileCard.style.display = 'none';
            return;
        }
        if (profileCard) profileCard.style.display = 'flex';
        if (profileEmail) profileEmail.textContent = user.email || user.id;
        // Load profile from Supabase
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('name,bio,avatar_url')
            .eq('id', user.id)
            .single();
        if (!error && data) {
            currentProfile = data;
            if (profileName) profileName.value = data.name || '';
            if (profileBio) profileBio.value = data.bio || '';
            if (profileAvatar) {
                profileAvatar.src = data.avatar_url
                    ? data.avatar_url
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || user.email || 'User')}`;
            }
        } else {
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
            alert('Profile saved!');
        } else {
            alert('Error saving profile.');
        }
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
            if (profileCard) profileCard.style.display = 'none';
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

    // --- INITIALIZE ---
    checkAuthAndSetupScratch();
});
