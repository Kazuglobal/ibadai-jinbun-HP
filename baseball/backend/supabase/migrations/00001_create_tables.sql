-- Create pitches table
CREATE TABLE IF NOT EXISTS pitches (
    id BIGSERIAL PRIMARY KEY,
    game_date DATE NOT NULL,
    pitch_type VARCHAR(10),
    velocity FLOAT,
    spin_rate FLOAT,
    release_x FLOAT,
    release_z FLOAT,
    plate_x FLOAT,
    plate_z FLOAT,
    result VARCHAR(50),
    batter_side CHAR(1),
    play_result VARCHAR(50),
    exit_velocity FLOAT,
    launch_angle FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_pitches_game_date ON pitches(game_date);
CREATE INDEX IF NOT EXISTS idx_pitches_pitch_type ON pitches(pitch_type);
CREATE INDEX IF NOT EXISTS idx_pitches_result ON pitches(result);

-- Create view for pitch statistics
CREATE OR REPLACE VIEW pitch_stats AS
SELECT 
    pitch_type,
    COUNT(*) as total_pitches,
    AVG(velocity) as avg_velocity,
    AVG(spin_rate) as avg_spin_rate,
    COUNT(CASE WHEN result = 'swinging_strike' THEN 1 END) as swinging_strikes,
    COUNT(CASE WHEN result = 'called_strike' THEN 1 END) as called_strikes,
    COUNT(CASE WHEN result LIKE '%ball%' THEN 1 END) as balls
FROM pitches
GROUP BY pitch_type;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_pitches_updated_at
    BEFORE UPDATE ON pitches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 