"""
菊池雄星投手の投球データを取得するスクリプト
"""
import os
from datetime import datetime, timedelta

import pandas as pd
from dotenv import load_dotenv
from pybaseball import statcast_pitcher, playerid_lookup
from supabase import create_client, Client

# 環境変数の読み込み
load_dotenv()

# Supabase設定
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_kikuchi_id():
    """菊池雄星選手のMLB IDを取得"""
    player_info = playerid_lookup("Kikuchi", "Yusei")
    return player_info.iloc[0]["key_mlbam"]

def fetch_kikuchi_data(start_date: str, end_date: str):
    """指定期間の菊池投手の投球データを取得"""
    player_id = get_kikuchi_id()
    data = statcast_pitcher(start_date, end_date, player_id)
    return data

def process_pitch_data(df: pd.DataFrame):
    """投球データの前処理"""
    # 必要なカラムの選択と名前の変更
    columns = {
        "game_date": "game_date",
        "pitch_type": "pitch_type",
        "release_speed": "velocity",
        "release_spin_rate": "spin_rate",
        "release_pos_x": "release_x",
        "release_pos_z": "release_z",
        "plate_x": "plate_x",
        "plate_z": "plate_z",
        "description": "result",
        "stand": "batter_side",
        "events": "play_result",
        "launch_speed": "exit_velocity",
        "launch_angle": "launch_angle"
    }
    
    df = df[columns.keys()].rename(columns=columns)
    
    # データ型の変換
    df["game_date"] = pd.to_datetime(df["game_date"])
    
    return df

def upload_to_supabase(df: pd.DataFrame):
    """処理済みデータをSupabaseにアップロード"""
    # DataFrameを辞書のリストに変換
    records = df.to_dict("records")
    
    # Supabaseにデータを挿入
    data = supabase.table("pitches").insert(records).execute()
    return data

def main():
    """メイン実行関数"""
    # 昨日のデータを取得（実運用時は日次で実行）
    yesterday = datetime.now() - timedelta(days=1)
    date_str = yesterday.strftime("%Y-%m-%d")
    
    try:
        # データ取得
        raw_data = fetch_kikuchi_data(date_str, date_str)
        
        if raw_data is not None and not raw_data.empty:
            # データ処理
            processed_data = process_pitch_data(raw_data)
            
            # Supabaseにアップロード
            upload_to_supabase(processed_data)
            print(f"Successfully uploaded {len(processed_data)} records")
        else:
            print("No new data found for the specified date")
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    main() 