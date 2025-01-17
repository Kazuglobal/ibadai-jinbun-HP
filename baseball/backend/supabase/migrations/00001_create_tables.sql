-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS update_pitches_updated_at ON pitches;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP VIEW IF EXISTS pitch_stats;
DROP TABLE IF EXISTS pitches;

-- Create pitches table
CREATE TABLE pitches (
    id BIGSERIAL PRIMARY KEY,
    game_date DATE NOT NULL,
    pitch_type VARCHAR(10),
    velocity NUMERIC(5,2),
    spin_rate NUMERIC(7,2),
    release_x NUMERIC(5,2),
    release_z NUMERIC(5,2),
    plate_x NUMERIC(5,2),
    plate_z NUMERIC(5,2),
    result VARCHAR(50),
    batter_side CHAR(1) CHECK (batter_side IN ('L', 'R')),
    play_result VARCHAR(50),
    exit_velocity NUMERIC(5,2),
    launch_angle NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX idx_pitches_game_date ON pitches(game_date);
CREATE INDEX idx_pitches_pitch_type ON pitches(pitch_type);
CREATE INDEX idx_pitches_result ON pitches(result);

-- Create materialized view for better performance
CREATE MATERIALIZED VIEW pitch_stats AS
SELECT 
    pitch_type,
    COUNT(*) as total_pitches,
    ROUND(AVG(velocity)::numeric, 2) as avg_velocity,
    ROUND(AVG(spin_rate)::numeric, 0) as avg_spin_rate,
    COUNT(CASE WHEN result = 'swinging_strike' THEN 1 END) as swinging_strikes,
    COUNT(CASE WHEN result = 'called_strike' THEN 1 END) as called_strikes,
    COUNT(CASE WHEN result LIKE '%ball%' THEN 1 END) as balls
FROM pitches
WHERE pitch_type IS NOT NULL
GROUP BY pitch_type;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_pitch_stats_pitch_type ON pitch_stats(pitch_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_pitches_updated_at
    BEFORE UPDATE ON pitches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_pitch_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY pitch_stats;
    RETURN NULL;
END;
$$;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_pitch_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON pitches
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_pitch_stats(); 