import React, { useEffect, useState } from 'react';
import { useSupabase } from '../utils/supabaseContext';

interface PitchData {
  pitch_type: string;
  total_pitches: number;
  avg_velocity: number;
  avg_spin_rate: number;
  swinging_strikes: number;
  called_strikes: number;
  balls: number;
}

const Dashboard: React.FC = () => {
  const supabase = useSupabase();
  const [pitchStats, setPitchStats] = useState<PitchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPitchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('pitch_stats')
          .select('*');

        if (error) throw error;
        setPitchStats(data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : '統計データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPitchStats();
  }, [supabase]);

  if (loading) return <div>データを読み込み中...</div>;
  if (error) return <div className="text-red-600">エラー: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">投球分析ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pitchStats.map((stat) => (
          <div key={stat.pitch_type} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{stat.pitch_type}</h3>
            <div className="space-y-2">
              <p>投球数: {stat.total_pitches}</p>
              <p>平均球速: {stat.avg_velocity?.toFixed(1)} mph</p>
              <p>平均回転数: {stat.avg_spin_rate?.toFixed(0)} rpm</p>
              <p>空振り: {stat.swinging_strikes}</p>
              <p>見逃し: {stat.called_strikes}</p>
              <p>ボール: {stat.balls}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 