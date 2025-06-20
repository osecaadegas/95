// Overlay Authentication & Access Control
// This script handles authentication and authorization for your overlay

class OverlayAuth {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        this.currentUser = null;
        this.userRole = null;
        this.allowedRoles = ['admin', 'moderator', 'streamer']; // Define who can access overlay
        this.overlayId = this.getOverlayId(); // Get overlay ID from URL params
        
        this.init();
    }

    async init() {
        // Check for existing session
        await this.checkSession();
        
        // Listen for auth state changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Overlay auth state changed:', event);
            this.handleAuthChange(session);
        });

        // Handle OAuth redirect
        if (window.location.hash && window.location.hash.includes('access_token')) {
            await this.handleOAuthRedirect();
        }
    }

    getOverlayId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('overlay') || 'default';
    }

    async checkSession() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            
            if (user) {
                this.currentUser = user;
                await this.checkUserPermissions();
            } else {
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.showLoginScreen();
        }
    }

    async handleOAuthRedirect() {
        try {
            const { data, error } = await this.supabase.auth.exchangeCodeForSession(window.location.hash);
            if (error) throw error;
            
            console.log('OAuth session established');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        } catch (error) {
            console.error('OAuth redirect error:', error);
            this.showError('Authentication failed. Please try again.');
        }
    }

    async handleAuthChange(session) {
        if (session && session.user) {
            this.currentUser = session.user;
            await this.checkUserPermissions();
        } else {
            this.currentUser = null;
            this.userRole = null;
            this.showLoginScreen();
        }
    }

    async checkUserPermissions() {
        try {
            // Get user profile and role from database
            const { data: profile, error: profileError } = await this.supabase
                .from('profiles')
                .select('role, twitch_username, is_active')
                .eq('id', this.currentUser.id)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                this.showError('Unable to verify permissions.');
                return;
            }

            this.userRole = profile?.role || 'user';
            const isActive = profile?.is_active !== false;

            // Check if user has overlay access
            const hasOverlayAccess = await this.checkOverlayAccess();
            
            if (this.allowedRoles.includes(this.userRole) && isActive && hasOverlayAccess) {
                this.showOverlay();
                this.logAccess('granted');
            } else {
                this.showAccessDenied();
                this.logAccess('denied');
            }
        } catch (error) {
            console.error('Permission check error:', error);
            this.showError('Permission verification failed.');
        }
    }

    async checkOverlayAccess() {
        try {
            // Check if user has specific overlay permissions
            const { data: overlayPermission, error } = await this.supabase
                .from('overlay_permissions')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('overlay_id', this.overlayId)
                .eq('is_active', true)
                .single();

            // If no specific permission found, check if user has global overlay access
            if (error && error.code === 'PGRST116') {
                return this.allowedRoles.includes(this.userRole);
            }

            return !!overlayPermission;
        } catch (error) {
            console.error('Overlay access check error:', error);
            return false;
        }
    }

    async logAccess(status) {
        try {
            await this.supabase
                .from('overlay_access_logs')
                .insert({
                    user_id: this.currentUser.id,
                    overlay_id: this.overlayId,
                    access_status: status,
                    ip_address: await this.getClientIP(),
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                });
        } catch (error) {
            console.error('Access logging error:', error);
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    showLoginScreen() {
        document.body.innerHTML = `
            <div class="overlay-auth-container">
                <div class="overlay-auth-card">
                    <div class="auth-header">
                        <h2>Overlay Access Required</h2>
                        <p>Please authenticate with Twitch to access this overlay</p>
                    </div>
                    <button id="twitch-login-btn" class="twitch-login-btn">
                        <img src="https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" alt="Twitch" width="20" height="20">
                        Login with Twitch
                    </button>
                    <div class="auth-footer">
                        <p>Only authorized users can access this overlay</p>
                    </div>
                </div>
            </div>
        `;

        const loginBtn = document.getElementById('twitch-login-btn');
        loginBtn.addEventListener('click', () => this.loginWithTwitch());

        this.addAuthStyles();
    }

    showAccessDenied() {
        document.body.innerHTML = `
            <div class="overlay-auth-container">
                <div class="overlay-auth-card access-denied">
                    <div class="auth-header">
                        <h2>Access Denied</h2>
                        <p>You don't have permission to access this overlay</p>
                    </div>
                    <div class="user-info">
                        <p><strong>User:</strong> ${this.currentUser.email}</p>
                        <p><strong>Role:</strong> ${this.userRole}</p>
                        <p><strong>Required Roles:</strong> ${this.allowedRoles.join(', ')}</p>
                    </div>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                    <div class="auth-footer">
                        <p>Contact an administrator for access</p>
                    </div>
                </div>
            </div>
        `;

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => this.logout());

        this.addAuthStyles();
    }

    showOverlay() {
        // Hide auth screen and show the actual overlay
        const authContainer = document.querySelector('.overlay-auth-container');
        if (authContainer) {
            authContainer.style.display = 'none';
        }

        // Show overlay content
        const overlayContent = document.getElementById('overlay-content');
        if (overlayContent) {
            overlayContent.style.display = 'block';
        }

        // Initialize overlay functionality
        this.initializeOverlay();
    }

    showError(message) {
        document.body.innerHTML = `
            <div class="overlay-auth-container">
                <div class="overlay-auth-card error">
                    <div class="auth-header">
                        <h2>Error</h2>
                        <p>${message}</p>
                    </div>
                    <button id="retry-btn" class="retry-btn">Try Again</button>
                </div>
            </div>
        `;

        const retryBtn = document.getElementById('retry-btn');
        retryBtn.addEventListener('click', () => location.reload());

        this.addAuthStyles();
    }

    async loginWithTwitch() {
        try {
            const { error } = await this.supabase.auth.signInWithOAuth({
                provider: 'twitch',
                options: {
                    redirectTo: window.location.href,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async logout() {
        try {
            await this.supabase.auth.signOut();
            this.currentUser = null;
            this.userRole = null;
            location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    initializeOverlay() {
        // Add user info to overlay (optional)
        this.addUserInfo();
        
        // Set up real-time subscriptions for overlay data
        this.setupRealtimeSubscriptions();
        
        console.log('Overlay initialized for user:', this.currentUser.email);
    }

    addUserInfo() {
        // Add a small user info display to the overlay
        const userInfo = document.createElement('div');
        userInfo.id = 'overlay-user-info';
        userInfo.innerHTML = `
            <div class="overlay-user-badge">
                <span>${this.userRole}</span>
                <button id="overlay-logout" title="Logout">×</button>
            </div>
        `;
        document.body.appendChild(userInfo);

        document.getElementById('overlay-logout').addEventListener('click', () => this.logout());
    }

    setupRealtimeSubscriptions() {
        // Subscribe to real-time updates for overlay data
        const channel = this.supabase
            .channel('overlay-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'overlay_data'
            }, (payload) => {
                console.log('Overlay data updated:', payload);
                this.handleOverlayUpdate(payload);
            })
            .subscribe();
    }

    handleOverlayUpdate(payload) {
        // Handle real-time overlay updates
        console.log('Handling overlay update:', payload);
        // Implement your overlay update logic here
    }

    addAuthStyles() {
        if (document.getElementById('overlay-auth-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'overlay-auth-styles';
        styles.textContent = `
            .overlay-auth-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #16213e 60%, #274472 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            }

            .overlay-auth-card {
                background: linear-gradient(135deg, #16213e 80%, #6ec1e422 100%);
                border-radius: 18px;
                border: 2px solid #6ec1e4;
                box-shadow: 0 8px 32px #6ec1e433;
                padding: 32px;
                text-align: center;
                max-width: 400px;
                color: #eaf6fb;
            }

            .overlay-auth-card.access-denied {
                border-color: #ff6b6b;
                box-shadow: 0 8px 32px #ff6b6b33;
            }

            .overlay-auth-card.error {
                border-color: #ff8787;
                box-shadow: 0 8px 32px #ff878733;
            }

            .auth-header h2 {
                color: #6ec1e4;
                margin-bottom: 8px;
                font-size: 1.5em;
            }

            .auth-header p {
                color: #a3b9d7;
                margin-bottom: 24px;
            }

            .twitch-login-btn {
                display: inline-flex;
                align-items: center;
                background: linear-gradient(90deg, #9147ff 0%, #6441a5 100%);
                color: #fff;
                font-weight: 600;
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 1em;
                gap: 8px;
                margin-bottom: 16px;
            }

            .twitch-login-btn:hover {
                background: linear-gradient(90deg, #6441a5 0%, #9147ff 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 16px #9147ff44;
            }

            .user-info {
                background: rgba(22,33,62,0.5);
                border-radius: 8px;
                padding: 16px;
                margin: 16px 0;
                text-align: left;
            }

            .user-info p {
                margin: 4px 0;
                font-size: 0.9em;
            }

            .logout-btn, .retry-btn {
                background: linear-gradient(90deg, #6ec1e4 0%, #16213e 100%);
                color: #fff;
                border: none;
                border-radius: 8px;
                padding: 8px 16px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .logout-btn:hover, .retry-btn:hover {
                background: linear-gradient(90deg, #16213e 0%, #6ec1e4 100%);
                transform: translateY(-1px);
            }

            .auth-footer {
                margin-top: 16px;
                font-size: 0.8em;
                color: #a3b9d7;
            }

            #overlay-user-info {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
            }

            .overlay-user-badge {
                background: rgba(22,33,62,0.9);
                border: 1px solid #6ec1e4;
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 0.8em;
                color: #6ec1e4;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #overlay-logout {
                background: none;
                border: none;
                color: #ff6b6b;
                cursor: pointer;
                font-size: 1.2em;
                padding: 0;
                width: 16px;
                height: 16px;
                line-height: 1;
            }

            #overlay-logout:hover {
                color: #ff5252;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in overlay files
window.OverlayAuth = OverlayAuth;
