"""
菊池雄星投手の過去データを取得してテストデータとして使用するスクリプト
"""
import os
from datetime import datetime

import pandas as pd
from dotenv import load_dotenv
from data_fetcher import fetch_kikuchi_data, process_pitch_data, upload_to_supabase

def main():
    """メイン実行関数"""
    # 環境変数の読み込み
    load_dotenv()
    
    # 2019年のデータを取得（テスト用）
    start_date = "2019-04-01"  # シーズン開始
    end_date = "2019-04-30"    # 1ヶ月分のデータ
    
    try:
        print(f"Fetching data from {start_date} to {end_date}...")
        raw_data = fetch_kikuchi_data(start_date, end_date)
        
        if raw_data is not None and not raw_data.empty:
            print(f"Found {len(raw_data)} pitches. Processing data...")
            processed_data = process_pitch_data(raw_data)
            
            print("Uploading to Supabase...")
            upload_to_supabase(processed_data)
            print(f"Successfully uploaded {len(processed_data)} records")
            
            # 基本的な統計情報を表示
            print("\nBasic statistics:")
            print(f"Total pitches: {len(processed_data)}")
            print("\nPitch types:")
            print(processed_data['pitch_type'].value_counts())
            print("\nAverage velocity by pitch type:")
            print(processed_data.groupby('pitch_type')['velocity'].mean())
            
        else:
            print("No data found for the specified period")
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    main() 