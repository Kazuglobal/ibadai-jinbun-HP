# 菊池雄星投球分析ダッシュボード

## プロジェクト概要
MLBの公式データやStatcastデータベースを活用し、菊池雄星投手の投球データを分析・可視化するWebダッシュボードを構築するプロジェクトです。

## 技術スタック
- バックエンド: Supabase (PostgreSQL)
- データ取得: Python (pybaseball, requests)
- フロントエンド: React + D3.js
- インフラ: Supabase (BaaS)

## プロジェクト構造
```
baseball/
├── backend/          # バックエンド関連ファイル
├── frontend/         # フロントエンド関連ファイル
└── README.md        # このファイル
```

## セットアップ手順
1. バックエンドのセットアップ
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. フロントエンドのセットアップ
   ```bash
   cd frontend
   npm install
   ```

## 開発環境の起動
1. バックエンド
   ```bash
   # Supabaseの起動手順は別途記載
   ```

2. フロントエンド
   ```bash
   cd frontend
   npm run dev
   ```

## ライセンス
All rights reserved. 