// --- CONFIGURE YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
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
    const scratchLoginRequired = document.getElementById('scratch-login-required');
    const scratchLoginBtn = document.getElementById('scratch-login-btn');
    const scratchImage = document.querySelector('.scratch-image');
    const scratchWinImage = document.querySelector('.scratch-win-image');
    const scratchLoseImage = document.querySelector('.scratch-lose-image');
    const scratchMessage = document.querySelector('.scratch-message');
    const scratchTryFooter = document.querySelector('.scratch-try-footer');
    let currentUser = null;
    let scratchUsed = false;

    async function checkAuthAndSetupScratch() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            currentUser = user;
            if (!user) {
                if (scratchSection) scratchSection.style.display = 'none';
                if (scratchLoginRequired) scratchLoginRequired.style.display = 'block';
                if (scratchMessage) scratchMessage.textContent = '';
                return;
            }
            if (scratchLoginRequired) scratchLoginRequired.style.display = 'none';
            if (scratchSection) scratchSection.style.display = 'block';
            checkScratchUsage();
        } catch (err) {
            console.error('Auth error:', err);
        }
    }

    if (scratchLoginBtn) {
        scratchLoginBtn.onclick = async () => {
            try {
                await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
            } catch (err) {
                console.error('Login error:', err);
            }
        };
    }

    supabaseClient.auth.onAuthStateChange((_event, session) => {
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

    // --- USER PANEL BUTTONS (direct binding only) ---
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            alert('Save button clicked. Implement your save logic here.');
        });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.reload();
        });
    }

    // --- INITIALIZE ---
    checkAuthAndSetupScratch();
});
