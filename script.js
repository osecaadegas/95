// --- CONFIGURE YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM ELEMENTS ---
const scratchSection = document.getElementById('scratch-card-section');
const scratchLoginRequired = document.getElementById('scratch-login-required');
const scratchLoginBtn = document.getElementById('scratch-login-btn');
const scratchImage = document.querySelector('.scratch-image');
const scratchWinImage = document.querySelector('.scratch-win-image');
const scratchLoseImage = document.querySelector('.scratch-lose-image');
const scratchMessage = document.querySelector('.scratch-message');
const scratchTryFooter = document.querySelector('.scratch-try-footer');

// --- SCRATCH CARD LOGIC ---
let currentUser = null;
let scratchUsed = false;

// --- AUTH HANDLING ---
async function checkAuthAndSetupScratch() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    if (!user) {
        scratchSection.style.display = 'none';
        scratchLoginRequired.style.display = 'block';
        if (scratchMessage) scratchMessage.textContent = '';
        return;
    }
    scratchLoginRequired.style.display = 'none';
    scratchSection.style.display = 'block';
    checkScratchUsage();
}

// --- LOGIN BUTTON ---
if (scratchLoginBtn) {
    scratchLoginBtn.onclick = async () => {
        // Use Supabase magic link or OAuth (Google) for login
        // Example: Google OAuth
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };
}

// --- LISTEN FOR AUTH CHANGES ---
supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    checkAuthAndSetupScratch();
});

// --- CHECK SCRATCH USAGE ---
async function checkScratchUsage() {
    if (!currentUser) return;
    // Query for latest usage
    const { data, error } = await supabase
        .from('scratch_usage')
        .select('used_at')
        .eq('user_id', currentUser.id)
        .order('used_at', { ascending: false })
        .limit(1);

    if (error) {
        scratchMessage.textContent = 'Error checking scratch usage.';
        disableScratch();
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
            scratchMessage.textContent = `You already used the scratch card. Try again in ${hoursLeft} hour(s)!`;
            disableScratch();
            return;
        }
    }
    scratchUsed = false;
    enableScratch();
}

// --- ENABLE/DISABLE SCRATCH ---
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

// --- HANDLE SCRATCH ACTION ---
async function handleScratch() {
    if (scratchUsed || !currentUser) return;
    // Simulate win/lose (50/50 chance)
    const win = Math.random() < 0.5;
    if (win) {
        scratchWinImage.style.display = 'block';
        scratchLoseImage.style.display = 'none';
        scratchMessage.textContent = 'Congratulations! You won!';
    } else {
        scratchWinImage.style.display = 'none';
        scratchLoseImage.style.display = 'block';
        scratchMessage.textContent = 'Better luck next time!';
    }
    // Record usage in Supabase
    await supabase.from('scratch_usage').insert([
        { user_id: currentUser.id, used_at: new Date().toISOString() }
    ]);
    scratchUsed = true;
    disableScratch();
}

// --- USER PANEL BUTTONS ---
document.addEventListener('DOMContentLoaded', () => {
    // Save button logic
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            // Example: Save user profile data (customize as needed)
            // const profileData = { ... }; // Gather data from form fields
            // const { error } = await supabase.from('profiles').upsert(profileData);
            // if (!error) alert('Profile saved!');
            // else alert('Error saving profile.');
            alert('Save button clicked. Implement your save logic here.');
        });
    }

    // Logout button logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.reload();
        });
    }
});

// --- INITIALIZE ---
window.addEventListener('DOMContentLoaded', () => {
    checkAuthAndSetupScratch();
});

// --- OPTIONAL: LOGOUT HANDLER (if you want to add a logout button) ---
// document.getElementById('logout-btn').onclick = () => supabase.auth.signOut();
