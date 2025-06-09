document.addEventListener('DOMContentLoaded', function() {
        // Sidebar logic
        document.getElementById('sidebar-toggle').addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.sidebar').classList.add('active');
            document.body.classList.add('sidebar-open');
            document.getElementById('sidebar-toggle').style.display = 'none';
        });
        document.getElementById('sidebar-close').addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.sidebar').classList.remove('active');
            document.body.classList.remove('sidebar-open');
            document.getElementById('sidebar-toggle').style.display = 'block';
        });
        document.addEventListener('click', function(e) {
            const sidebar = document.querySelector('.sidebar');
            const toggle = document.getElementById('sidebar-toggle');
            const closeBtn = document.getElementById('sidebar-close');
            if (
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                e.target !== toggle &&
                e.target !== closeBtn
            ) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                toggle.style.display = 'block';
            }
        });

        // Arena Breakout mobile button logic
        function showArenaMobileBtn() {
            var btn = document.getElementById('arena-mobile-btn');
            if (!btn) return;
            if (window.innerWidth <= 900) {
                btn.style.display = 'inline-block';
            } else {
                btn.style.display = 'none';
            }
        }
        window.addEventListener('resize', showArenaMobileBtn);
        showArenaMobileBtn();
        var btn = document.getElementById('arena-mobile-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                if (/android/i.test(userAgent)) {
                    window.location.href = "https://arenabreakout.com/download?platform=android";
                } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    window.location.href = "https://arenabreakout.com/download?platform=ios";
                } else {
                    window.location.href = "https://arenabreakout.com/download";
                }
            });
        }

        // Age gate logic
        function hideAgeGate() {
            document.getElementById('age-gate-overlay').style.display = 'none';
            sessionStorage.setItem('ageVerified', '1');
        }
        function showAgeGate() {
            document.getElementById('age-gate-overlay').style.display = 'flex';
        }
        if (sessionStorage.getItem('ageVerified') === '1') {
            hideAgeGate();
        } else {
            showAgeGate();
        }
        document.getElementById('age-yes').onclick = hideAgeGate;
        document.getElementById('age-no').onclick = function() {
            window.location.href = "https://www.google.com/search?q=responsible+gaming";
        };

        // Empire Drop button
        var empireBtn = document.getElementById('empire-claim-btn');
        if (empireBtn) {
            empireBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://empiredrop.com?r=seca', '_blank');
            });
        }

        // --- SCRATCH CARD LOGIC WITH TRANSLATION ---
        const SCRATCH_KEY = "scratchCardLastPlay";
        let SCRATCH_LANG = document.documentElement.lang || "en";

        function canScratchToday() {
            const last = localStorage.getItem(SCRATCH_KEY);
            if (!last) return true;
            const lastDate = new Date(parseInt(last, 10));
            const now = new Date();
            return (
                lastDate.getFullYear() !== now.getFullYear() ||
                lastDate.getMonth() !== now.getMonth() ||
                lastDate.getDate() !== now.getDate()
            );
        }
        function getScratchWaitTime() {
            const last = localStorage.getItem(SCRATCH_KEY);
            if (!last) return "";
            const lastDate = new Date(parseInt(last, 10));
            const nextPlay = new Date(lastDate);
            nextPlay.setHours(24, 0, 0, 0);
            const now = new Date();
            let diff = nextPlay - now;
            if (diff < 0) diff = 0;
            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
            const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
        }
        function setScratchPlayed() {
            localStorage.setItem(SCRATCH_KEY, Date.now().toString());
        }
        function showScratchResult(win, cardSection) {
            const lang = SCRATCH_LANG;
            const message = cardSection.querySelector('.scratch-message');
            const winImg = cardSection.querySelector('.scratch-win-image');
            const loseImg = cardSection.querySelector('.scratch-lose-image');
            if (win) {
                winImg.style.display = 'block';
                loseImg.style.display = 'none';
                message.innerText = translations[lang].scratch_congrats;
            } else {
                winImg.style.display = 'none';
                loseImg.style.display = 'block';
                message.innerText = translations[lang].scratch_noluck;
            }
            if (!win) updateScratchWait(cardSection);
        }
        function updateScratchWait(cardSection) {
            const waitElem = cardSection.querySelector('.scratch-wait');
            if (!waitElem) return;
            if (canScratchToday()) {
                waitElem.innerText = "";
                return;
            }
            function tick() {
                const time = getScratchWaitTime();
                if (time === "00:00:00") {
                    waitElem.innerText = "";
                    return;
                }
                waitElem.innerText = SCRATCH_LANG === "pt"
                    ? `Podes jogar novamente em: ${time}`
                    : `You can play again in: ${time}`;
                setTimeout(tick, 1000);
            }
            tick();
        }

        // SCRATCH CARD INIT
        document.querySelectorAll('.offer-card').forEach(cardSection => {
            const scratchContainer = cardSection.querySelector('.scratch-image-container');
            const scratchImage = cardSection.querySelector('.scratch-image');
            const message = cardSection.querySelector('.scratch-message');
            let waitElem = cardSection.querySelector('.scratch-wait');
            if (!scratchContainer || !scratchImage || !message) return;
            if (!waitElem) {
                waitElem = document.createElement('div');
                waitElem.className = "scratch-wait";
                waitElem.style.cssText = "margin-top:6px;color:#ffd700;font-size:0.98em;font-weight:bold;";
                message.after(waitElem);
            }
            message.innerText = translations[SCRATCH_LANG].scratch_try;
            cardSection.querySelector('h2').innerText = translations[SCRATCH_LANG].scratch_title;
            // Only allow scratch if not played today
            if (!canScratchToday()) {
                scratchImage.style.opacity = 0.3;
                scratchContainer.style.pointerEvents = 'none';
                message.innerText = translations[SCRATCH_LANG].scratch_already || "";
                updateScratchWait(cardSection);
            } else {
                waitElem.innerText = "";
                scratchImage.style.opacity = 1;
                scratchContainer.style.pointerEvents = 'auto';
                // Remove any previous result images
                cardSection.querySelector('.scratch-win-image').style.display = 'none';
                cardSection.querySelector('.scratch-lose-image').style.display = 'none';

                // SCRATCH CANVAS LOGIC
                let isDrawing = false;
                let lastPoint = null;
                let canvas = scratchContainer.querySelector('.scratch-canvas');
                if (canvas) canvas.remove();
                canvas = document.createElement('canvas');
                canvas.className = 'scratch-canvas';
                canvas.width = scratchImage.offsetWidth;
                canvas.height = scratchImage.offsetHeight;
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.zIndex = '10';
                canvas.style.pointerEvents = 'auto';
                // Add these two lines:
                canvas.style.borderRadius = '14px';
                canvas.style.overflow = 'hidden';
                scratchContainer.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                // Draw a silver/gray overlay to scratch off
                ctx.fillStyle = '#b0b0b0';
                ctx.globalAlpha = 0.95;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Optional: Add "SCRATCH ME" text
                ctx.globalAlpha = 1;
                ctx.font = "bold 2em Arial";
                ctx.fillStyle = "#444";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("SCRATCH ME", canvas.width / 2, canvas.height / 2);

                function getPointerPos(e) {
                    let rect = canvas.getBoundingClientRect();
                    let x, y;
                    if (e.touches) {
                        x = e.touches[0].clientX - rect.left;
                        y = e.touches[0].clientY - rect.top;
                    } else {
                        x = e.clientX - rect.left;
                        y = e.clientY - rect.top;
                    }
                    return { x, y };
                }

                function eraseAt(x, y) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    ctx.arc(x, y, 24, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                }

                function checkErased() {
                    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let pixels = imageData.data;
                    let transparent = 0;
                    for (let i = 3; i < pixels.length; i += 4) {
                        if (pixels[i] < 32) transparent++;
                    }
                    let percent = transparent / (canvas.width * canvas.height) * 100;
                    return percent;
                }

                function finishScratch() {
                    setScratchPlayed();
                    scratchContainer.style.pointerEvents = 'none';
                    scratchImage.style.opacity = 0;
                    canvas.remove();
                    const win = Math.floor(Math.random() * 100) === 0;
                    showScratchResult(win, cardSection);
                }

                function pointerDown(e) {
                    isDrawing = true;
                    lastPoint = getPointerPos(e);
                    eraseAt(lastPoint.x, lastPoint.y);
                    e.preventDefault();
                }
                function pointerMove(e) {
                    if (!isDrawing) return;
                    let point = getPointerPos(e);
                    eraseAt(point.x, point.y);
                    lastPoint = point;
                    if (checkErased() > 65) { // Require 65% to be scratched
                        isDrawing = false;
                        finishScratch();
                    }
                    e.preventDefault();
                }
                function pointerUp(e) {
                    isDrawing = false;
                    e.preventDefault();
                }

                canvas.addEventListener('mousedown', pointerDown);
                canvas.addEventListener('mousemove', pointerMove);
                canvas.addEventListener('mouseup', pointerUp);
                canvas.addEventListener('mouseleave', pointerUp);
                canvas.addEventListener('touchstart', pointerDown, { passive: false });
                canvas.addEventListener('touchmove', pointerMove, { passive: false });
                canvas.addEventListener('touchend', pointerUp, { passive: false });
            }
        });
        // --- LANGUAGE SWITCHER ---
        const langToggle = document.getElementById('lang-toggle');
        function setLanguage(lang) {
            var bonusMsg = document.getElementById('bonus-hunt-msg');
                if (bonusMsg) bonusMsg.innerText = translations[lang].bonus_hunt_msg;
            document.documentElement.lang = lang;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });
            document.getElementById('age-yes').innerText = translations[lang].yes_18;
            document.getElementById('age-no').innerText = translations[lang].no;
            document.querySelector('.footer-link[href*="terms"]').innerText = translations[lang].terms;
            document.querySelector('.footer-link[href*="begambleaware"]').innerText = translations[lang].responsible;
            document.querySelector('.footer-link[href="#contact"]').innerText = translations[lang].contact;
            document.querySelector('.footer-legal p').innerHTML = translations[lang].legal1;
            document.querySelector('.footer-legal p + p').innerHTML = translations[lang].copyright;
            document.querySelectorAll('.claim-button').forEach(btn => {
                if (btn.classList.contains('green')) btn.innerText = translations[lang].download_game;
                else if (btn.classList.contains('orange')) btn.innerText = translations[lang].creator_code;
                else if (btn.id === 'arena-mobile-btn') btn.innerText = translations[lang].download_mobile;
                else btn.innerText = translations[lang].claim_offer;
            });
            document.getElementById('lang-pt').style.opacity = lang === 'pt' ? '1' : '0.5';
            document.getElementById('lang-en').style.opacity = lang === 'en' ? '1' : '0.5';
            // Scratch card translation
            var scratchTitle = document.querySelector('.offer-card .scratch-card')?.parentElement.querySelector('h2');
            if (scratchTitle) scratchTitle.innerText = translations[lang].scratch_title;
            var scratchCover = document.querySelector('.scratch-cover');
            if (scratchCover) scratchCover.innerText = translations[lang].scratch_me;
            var scratchTry = document.querySelector('.scratch-message');
            if (scratchTry) scratchTry.innerText = translations[lang].scratch_try;
            if (!canScratchToday()) {
                if (scratchCover) scratchCover.innerText = translations[lang].scratch_come_back;
                if (scratchTry) scratchTry.innerText = translations[lang].scratch_already || "";
            }
            document.querySelectorAll('.scratch-try-footer').forEach(el => {
                el.innerText = translations[lang].scratch_try;
            });
        }
        langToggle.addEventListener('change', function() {
            SCRATCH_LANG = langToggle.checked ? "pt" : "en";
            setLanguage(SCRATCH_LANG);
            document.querySelectorAll('.offer-card').forEach(updateScratchWait);
        });
        setLanguage(SCRATCH_LANG);

        // --- SUPABASE LOGIN/PROFILE LOGIC ---
        const SUPABASE_URL = 'https://oytxhozuqrxeebdlnawb.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dHhob3p1cXJ4ZWViZGxuYXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODU0OTEsImV4cCI6MjA2NDM2MTQ5MX0.G18pV_EFVfbtQd62tG_S-ED_TRjCptWp-C8dcO2GEEA';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        async function signInWithTwitch() {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'twitch',
                options: {
                    redirectTo: 'https://osecaadegas.github.io/95/'
                }
            });
            if (error) alert('Login failed: ' + error.message);
        }

        function showLoginButton() {
            document.getElementById('profile-area').innerHTML = `
        <button class="twitch-login-btn" onclick="signInWithTwitch()">
            <img src="https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" alt="Twitch" style="height:1.3em;vertical-align:middle;">
            Login with Twitch
        </button>
    `;
    // Hide nav-auth-only links and bonus hunt message when logged out
    document.querySelectorAll('.nav-auth-only').forEach(el => el.style.display = 'none');
    document.getElementById('bonus-hunt-msg').style.display = 'block';
}

async function showProfileEditor(user) {
    // Show nav-auth-only links and hide bonus hunt message
    document.querySelectorAll('.nav-auth-only').forEach(el => el.style.display = 'inline-flex');
    document.getElementById('bonus-hunt-msg').style.display = 'none';

    let { data: profile, error: fetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (fetchError) {
        document.getElementById('profile-area').innerHTML = `<div style="color:#ff4d4f;">Failed to load profile. Please try again later.</div>`;
        return;
    }

    document.getElementById('profile-area').innerHTML = `
        <div class="profile-editor" style="display:flex;flex-direction:column;align-items:flex-start;gap:12px;">
            <label style="display:flex;align-items:center;gap:10px;">
                <img id="profile-avatar" src="${profile?.avatar_url || 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png'}" alt="Avatar" style="width:48px;height:48px;border-radius:50%;border:2px solid #6ec1e4;">
                <input type="file" id="avatar-upload" accept="image/*" style="display:none;">
                <button id="avatar-upload-btn" type="button" style="margin-left:8px;">Change Avatar</button>
            </label>
            <label>
                Username:<br>
                <input type="text" id="username" maxlength="24" value="${profile?.username || ''}" style="width:180px;">
            </label>
            <label>
                Bio:<br>
                <textarea id="bio" rows="2" maxlength="120" style="width:220px;">${profile?.bio || ''}</textarea>
            </label>
            <div id="profile-error" style="color:#ff4d4f;font-size:0.98em;min-height:18px;"></div>
            <div id="profile-success" style="color:#4caf50;font-size:0.98em;min-height:18px;"></div>
            <div style="display:flex;gap:10px;">
                <button id="save-profile-btn" class="profile-btn save" style="padding:4px 16px;">Save</button>
                <button id="logout-btn" class="profile-btn logout" style="padding:4px 16px;">Logout</button>
            </div>
            <button id="back-profile-btn" class="profile-btn" style="margin-top:8px;padding:2px 10px;font-size:0.95em;">Back</button>
        </div>
    `;

    const errorElem = document.getElementById('profile-error');
    const successElem = document.getElementById('profile-success');
    const saveBtn = document.getElementById('save-profile-btn');
    const avatarBtn = document.getElementById('avatar-upload-btn');
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImg = document.getElementById('profile-avatar');

    // Avatar upload button logic
    avatarBtn.onclick = function() {
        avatarInput.click();
    };
    avatarInput.addEventListener('change', async (e) => {
        errorElem.innerText = '';
        successElem.innerText = '';
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            errorElem.innerText = 'Please select a valid image file.';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            errorElem.innerText = 'Image must be less than 2MB.';
            return;
        }
        avatarBtn.disabled = true;
        avatarBtn.innerText = 'Uploading...';
        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(`${user.id}/${file.name}`, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${file.name}`);
            const { error: updateError } = await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
            if (updateError) throw updateError;
            avatarImg.src = urlData.publicUrl;
            successElem.innerText = 'Avatar updated!';
        } catch (err) {
            errorElem.innerText = 'Failed to upload avatar. Please try again.';
        } finally {
            avatarBtn.disabled = false;
            avatarBtn.innerText = 'Change Avatar';
        }
    });

    saveBtn.onclick = async function() {
        errorElem.innerText = '';
        successElem.innerText = '';
        const username = document.getElementById('username').value.trim();
        const bio = document.getElementById('bio').value.trim();

        // Validation
        if (!username) {
            errorElem.innerText = 'Username cannot be empty.';
            return;
        }
        if (username.length < 3) {
            errorElem.innerText = 'Username must be at least 3 characters.';
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errorElem.innerText = 'Username can only contain letters, numbers, and underscores.';
            return;
        }
        if (bio.length > 120) {
            errorElem.innerText = 'Bio must be 120 characters or less.';
            return;
        }

        saveBtn.disabled = true;
        saveBtn.innerText = 'Saving...';
        try {
            const { error: updateError } = await supabase.from('profiles').update({ username, bio }).eq('id', user.id);
            if (updateError) throw updateError;
            successElem.innerText = 'Profile updated!';
            setTimeout(() => showProfileHeader(user), 1200);
        } catch (err) {
            errorElem.innerText = 'Failed to update profile. Please try again.';
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'Save';
        }
    };

    document.getElementById('logout-btn').onclick = async function() {
        await supabase.auth.signOut();
        showLoginButton();
    };

    document.getElementById('back-profile-btn').onclick = function() {
        showProfileHeader(user);
    };
}

// Show a simple profile header with avatar, username, and logout
async function showProfileHeader(user) {
    // Show nav-auth-only links and hide bonus hunt message
    document.querySelectorAll('.nav-auth-only').forEach(el => el.style.display = 'inline-flex');
    document.getElementById('bonus-hunt-msg').style.display = 'none';

    let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    document.getElementById('profile-area').innerHTML = `
        <div class="profile-header" style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <img src="${profile?.avatar_url || 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png'}" alt="Avatar" style="width:38px;height:38px;border-radius:50%;border:2px solid #6ec1e4;">
            <span style="color:#eaf6fb;font-weight:bold;">${profile?.username || 'User'}</span>
            <button id="logout-btn" class="profile-btn logout" style="margin-left:10px;padding:4px 14px;font-size:0.95em;">Logout</button>
        </div>
    `;
    document.querySelector('.profile-header').addEventListener('click', function(e) {
        if (e.target.id !== 'logout-btn') showProfileEditor(user);
    });
    document.getElementById('logout-btn').onclick = async function(e) {
        e.stopPropagation();
        await supabase.auth.signOut();
        showLoginButton();
    };
}

        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                // Fetch or create profile
                let { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (!profile) {
                    await supabase.from('profiles').insert([
                        { id: session.user.id, username: session.user.user_metadata.name, avatar_url: session.user.user_metadata.avatar_url }
                    ]);
                }
                showProfileEditor(session.user);
            } else {
                showLoginButton();
            }
        });

        // On page load, check session
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
                showProfileEditor(session.user);
            } else {
                showLoginButton();
            }
        })();

        // Make signInWithTwitch globally available for the button
        window.signInWithTwitch = signInWithTwitch;
    });

    // --- TRANSLATIONS ---
    const translations = {
       en: {
        everything_here: "Everything you need is here",
        offers: "OFFERS",
        register_cashback: "Register and use the codes to get 15% cashback from me",
        empire_percent: "+100%",
        empire_condition: "on the first deposit",
        infinity_percent: "+100% +200 Free Spins",
        infinity_condition: "+15% cashback for losses over 100€ monthly",
        buran_percent: "1st deposit cashback up to 20€",
        buran_condition: "+15% cashback for losses over 100€ monthly",
        arena_code: "Code: secaadegas",
        arena_condition: "use my code for in-game rewards",
        claim_offer: "CLAIM OFFER",
        download_game: "Download the Game",
        creator_code: "Creator code input",
        download_mobile: "Download Mobile",
        yes_18: "Yes, I am 18 or older",
        no: "No",
        bonus_hunt_msg: "For using the Bonus Hunt Tracker You must First Log in",
        terms: "Terms & Conditions",
        responsible: "Responsible Gaming",
        contact: "Contact",
        legal1: `This website is an affiliate and is not a gambling operator. Offers are for 18+ only. Please gamble responsibly.
            All offers are subject to terms and conditions of the respective casino.
            If you have a gambling problem, visit <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" class="footer-link">BeGambleAware</a> or your local support service.`,
        copyright: "&copy; 2025 osecaadegas95. All rights reserved.",
        scratch_title: "Daily Scratch Card",
        scratch_me: "SCRATCH ME",
        scratch_win: "🎉 YOU WIN! 10 Euros in one of our Casinos 🎉",
        scratch_lose: "🙁 Try again tomorrow!",
        scratch_congrats: "Congratulations! Come back tomorrow for another chance.",
        scratch_noluck: "No luck today. Try again tomorrow!",
        scratch_already: "",
        scratch_come_back: "Come back tomorrow!",
        scratch_try: "Try your luck every day!",
        // --- MISSING TRANSLATIONS ---
        points: "Points",
        login_with_twitch: "Login with Twitch",
        logout: "Logout",
        are_you_18: "Are you 18 or older?",
        must_be_18: "You must be at least 18 years old to access this website.<br>Please confirm your age.",
        no_access: "No access",
        play_again_in: "You can play again in:",
        twitch_store: "Twitch Store",
        discord: "Discord",
        stream: "Stream",
        youtube: "Youtube",
        tiktok: "TikTok",
        telegram: "Telegram",
        instagram: "Instagram"
    },
    pt: {
        everything_here: "Tudo o que precisas está aqui",
        offers: "OFERTAS",
        register_cashback: "Regista-te e usa os códigos para receber 15% cashback de mim",
        empire_percent: "+100%",
        empire_condition: "no primeiro depósito",
        infinity_percent: "+100% +200 Free Spins",
        infinity_condition: "+15% cashback por perdas acima de 100€ por mês",
        buran_percent: "Cashback no 1º depósito até 20€",
        buran_condition: "+15% cashback por perdas acima de 100€ por mês",
        arena_code: "Código: secaadegas",
        arena_condition: "usa o meu código para recompensas no jogo",
        claim_offer: "RECEBER OFERTA",
        download_game: "Descarregar o Jogo",
        creator_code: "Inserir código de criador",
        download_mobile: "Descarregar Mobile",
        yes_18: "Sim, tenho 18 ou mais anos",
        no: "Não",
        bonus_hunt_msg: "Para usar o Bonus Hunt Tracker tens de iniciar sessão primeiro",
        terms: "Termos & Condições",
        responsible: "Jogo Responsável",
        contact: "Contacto",
        legal1: `Este site é um afiliado e não é um operador de jogos. Ofertas apenas para maiores de 18 anos. Jogue com responsabilidade.
            Todas as ofertas estão sujeitas aos termos e condições do respetivo casino.
            Se tem problemas com o jogo, visite <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" class="footer-link">BeGambleAware</a> ou o serviço de apoio local.`,
        copyright: "&copy; 2025 osecaadegas95. Todos os direitos reservados.",
        scratch_title: "Raspadinha Diária",
        scratch_me: "RASPA-ME",
        scratch_win: "🎉 GANHASTE! 10 Euros num casino de parceria! 🎉",
        scratch_lose: "🙁 Tenta novamente amanhã!",
        scratch_congrats: "Parabéns! Volta amanhã para outra oportunidade.",
        scratch_noluck: "Sem sorte hoje. Tenta novamente amanhã!",
        scratch_already: "",
        scratch_come_back: "Volta amanhã!",
        scratch_try: "Tenta a tua sorte todos os dias!",
        // --- MISSING TRANSLATIONS ---
        points: "Pontos",
        login_with_twitch: "Entrar com Twitch",
        logout: "Sair",
        are_you_18: "Tens 18 anos ou mais?",
        must_be_18: "Tens de ter pelo menos 18 anos para aceder a este site.<br>Por favor confirma a tua idade.",
        no_access: "Sem acesso",
        play_again_in: "Podes jogar novamente em:",
        twitch_store: "Loja Twitch",
        discord: "Discord",
        stream: "Stream",
        youtube: "Youtube",
        tiktok: "TikTok",
        telegram: "Telegram",
        instagram: "Instagram"
    }
};
