-- Supabase SQL Schema for Overlay Access Control
-- Run these queries in your Supabase SQL editor

-- 1. Update profiles table to include role and active status
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS twitch_username TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create overlay_permissions table for granular access control
CREATE TABLE IF NOT EXISTS overlay_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overlay_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, overlay_id)
);

-- 3. Create overlay_access_logs table for audit trail
CREATE TABLE IF NOT EXISTS overlay_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overlay_id TEXT NOT NULL,
    access_status TEXT NOT NULL CHECK (access_status IN ('granted', 'denied')),
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create overlay_data table for real-time overlay content
CREATE TABLE IF NOT EXISTS overlay_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    overlay_id TEXT NOT NULL,
    data_type TEXT NOT NULL, -- 'chat', 'donation', 'follower', etc.
    content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_overlay_permissions_user_overlay ON overlay_permissions(user_id, overlay_id);
CREATE INDEX IF NOT EXISTS idx_overlay_permissions_active ON overlay_permissions(is_active);
CREATE INDEX IF NOT EXISTS idx_overlay_access_logs_user ON overlay_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_overlay_access_logs_overlay ON overlay_access_logs(overlay_id);
CREATE INDEX IF NOT EXISTS idx_overlay_access_logs_timestamp ON overlay_access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_overlay_data_overlay_type ON overlay_data(overlay_id, data_type);
CREATE INDEX IF NOT EXISTS idx_overlay_data_active ON overlay_data(is_active);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE overlay_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE overlay_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE overlay_data ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies

-- Overlay permissions policies
CREATE POLICY "Users can view their own overlay permissions" ON overlay_permissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all overlay permissions" ON overlay_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Overlay access logs policies  
CREATE POLICY "Users can view their own access logs" ON overlay_access_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert access logs" ON overlay_access_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all access logs" ON overlay_access_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Overlay data policies
CREATE POLICY "Authorized users can view overlay data" ON overlay_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator', 'streamer')
        ) OR
        EXISTS (
            SELECT 1 FROM overlay_permissions 
            WHERE user_id = auth.uid() 
            AND overlay_id = overlay_data.overlay_id 
            AND is_active = true
        )
    );

CREATE POLICY "Authorized users can manage overlay data" ON overlay_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator', 'streamer')
        )
    );

-- 8. Create functions for common operations

-- Function to grant overlay access
CREATE OR REPLACE FUNCTION grant_overlay_access(
    target_user_id UUID,
    target_overlay_id TEXT,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    permission_id UUID;
    current_user_role TEXT;
BEGIN
    -- Check if current user has permission to grant access
    SELECT role INTO current_user_role 
    FROM profiles 
    WHERE id = auth.uid();
    
    IF current_user_role NOT IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to grant overlay access';
    END IF;
    
    -- Insert or update permission
    INSERT INTO overlay_permissions (user_id, overlay_id, granted_by, expires_at)
    VALUES (target_user_id, target_overlay_id, auth.uid(), expires_at)
    ON CONFLICT (user_id, overlay_id) 
    DO UPDATE SET 
        is_active = true,
        granted_by = auth.uid(),
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW()
    RETURNING id INTO permission_id;
    
    RETURN permission_id;
END;
$$;

-- Function to revoke overlay access
CREATE OR REPLACE FUNCTION revoke_overlay_access(
    target_user_id UUID,
    target_overlay_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Check if current user has permission to revoke access
    SELECT role INTO current_user_role 
    FROM profiles 
    WHERE id = auth.uid();
    
    IF current_user_role NOT IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to revoke overlay access';
    END IF;
    
    -- Update permission to inactive
    UPDATE overlay_permissions 
    SET is_active = false, updated_at = NOW()
    WHERE user_id = target_user_id 
    AND overlay_id = target_overlay_id;
    
    RETURN FOUND;
END;
$$;

-- Function to check if user has overlay access
CREATE OR REPLACE FUNCTION check_overlay_access(
    target_user_id UUID,
    target_overlay_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
    has_permission BOOLEAN DEFAULT false;
BEGIN
    -- Get user role
    SELECT role INTO user_role 
    FROM profiles 
    WHERE id = target_user_id;
    
    -- Check if user has global access through role
    IF user_role IN ('admin', 'super_admin', 'moderator', 'streamer') THEN
        RETURN true;
    END IF;
    
    -- Check specific overlay permission
    SELECT EXISTS(
        SELECT 1 FROM overlay_permissions 
        WHERE user_id = target_user_id 
        AND overlay_id = target_overlay_id 
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$;

-- 9. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_overlay_permissions_updated_at 
    BEFORE UPDATE ON overlay_permissions 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_overlay_data_updated_at 
    BEFORE UPDATE ON overlay_data 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 10. Insert default admin user (replace with your Twitch user ID)
-- You'll need to get your user ID from the auth.users table after logging in
-- INSERT INTO profiles (id, role, twitch_username, is_active) 
-- VALUES ('your-user-id-here', 'admin', 'your-twitch-username', true)
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;

-- Example: Grant overlay access to a user
-- SELECT grant_overlay_access('user-id-here', 'chat-overlay', NULL);

-- Example: Check if user has access
-- SELECT check_overlay_access('user-id-here', 'chat-overlay');
