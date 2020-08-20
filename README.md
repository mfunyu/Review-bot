# Review bot for 42tokyo discord

## 🤖目的

- レビュー時にスムーズなレビューを可能にする

## 🤖概要

- レビューの時間に通知、又はチャンネルへの自動移遷をする
	→　レビューを忘れたり遅刻したりすることを防止
- レビューチャンネルをコマンドで立てる
	→　レビューチャンネル名の入力の手間を省く

## 🤖詳細

### 自分がレビュワーの場合　``/``

#### ⭐️レビュー用ボイスチャンネルを立てる
1. プロジェクト名と開始時間を登録する
	 - ```/[project] [time]```
	 - ex)  `/C00 2342`

2. レビュー時間になったら、
	 - レビュー待機にいる場合、レビューのボイスチャンネルに自動移遷
	 - レビュー待機にいない場合、ボイスチャンネル名を示すDMを送信

#### ⭐️レビュー時間登録を解除する
- レビューチャンネルを削除して、時間での通知を解除する
  - ```/cancel [project] [time]```
  - ex) `/cancel C00 2342`

### 自分がレビュイーの場合　`//`

#### ⭐️レビュー時間に通知を受ける
1. プロジェクト名と開始時間を登録する
	 - ```//[project] [time]```
	 - ex)  `//C00 2342`

2. レビュー時間になったら、
   - レビュー待機にいない場合、レビュー待機への案内を含むDMを送信

- (現在は一度レビュー時間を登録すると時間通知は解除できません🙇‍♂️）

### その他
#### ⭐️Review-botの使い方を表示する
　　-  ```/help```

#### ⭐️テキストチャンネルを作成する
1. ボイスチャンネルにいる場合、ボイスチャンネルと同じ名前のテキストチャンネルを立てる
2. チャンネル名を指定して立てる
   - ```/text [name]```
   - ex) `/text C00`
   - ```/text [name] [time]```
   - ex) `/text C00 2342`

#### ⭐️レビュー相手を呼び出す
1. レビューボイスチャンネルに入る
2. ユーザー名を指定
   - ```/call [user]```
   - ex) ``/call username``

   - レビュー待機にいる場合、自分のいるレビューチャンネルに呼ぶ
   - レビュー待機にいない場合、招待リンクを含むDMを送信（ステータスがオンラインでない場合はその旨通知）

#### ⭐️レビューボイスチャンネルを削除する
- レビューボイスチャンネルにいる状態でコマンドを打つ
   - ```/done```

#### ⭐️レビューボイスチャンネル,テキストチャンネルを削除する
- Project Reviewカテゴリー内の自分のユーザー名を含むチャンネルを全て消去する
　　- ```/clear```
  

## 🤖 運用

ー　herokuを使用しています
ー　まだ開発途中なので、プルリク等歓迎です
ー　問題があればissuesにお願いします🙇‍♂️
