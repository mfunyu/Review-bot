# Review bot for 42tokyo discord

## 目的

- レビュー時にスムーズなレビューを可能にする

## 概要

- レビューの時間に通知、又はチャンネルへの自動移遷をする
	→　レビューを忘れたり遅刻したりすることを防止
- レビューチャンネルをコマンドで立てる
	→　レビューチャンネル名の入力の手間を省く

## 詳細

- レビュワー　'''/'''
- レビュイー　'''//'''

- プロジェクト名と開始時間の登録でレビュー用チャンネルを立てる

- レビュー時間になったら、
	- A: レビュー待機にいる場合はレビューのボイスチャンネルに移動させる
	- B: レビュー待機にいない場合は招待リンクを含むdmを送る
- レビュー相手がこない場合、dmと招待リンクを送信する（ステータスがオンラインでない場合はその旨通知）


# Review-bot
