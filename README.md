<h1 align="center"> Review-bot </h1>
<p align="center">
Review-bot は、42 における課題レビューのための bot です。<br>
レビューチャンネル作成・削除の手間を軽減し、Discord 上でのスムーズなレビューを可能にします。</p>

## About

コロナ禍によって、42Tokyo では課題のレビューがオンライン化し、Discord 上のボイスチャンネルで行われるようになりました。
それにより、レビューを開始する前にレビューチャンネルを作成し、終了時に削除するという手順が毎回のレビュー時に追加されました。レビューの手間を少しでも減らすために、Review-bot が作成されました。

また、レビューのオンライン化によって、レビューする・してもらう人とこれまでにレビューで会ったことがあるかどうかわからない、覚えていないということが増えました。
そんなときにレビュー履歴を手早く確認できるように、42API を使ってレビュー履歴を表示するための`history`コマンドも実装されました。

## Usage

Review-bot は Discord の機能である [Slash Commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) を使用しています。

Review-bot の全てのインタラクションが ephemeral なレスポンスを返すため、bot の応答は使用者のみに表示されます。すなわち、どこのテキストチャンネルに書き込んでも、bot とのやりとりが他のユーザーに表示されることはありません。

よって、コマンドを入力するテキストチャンネルを選ばずに、Review-bot を使用することができます。

<hr/>

### :loud_sound: `/review` : レビューチャンネルを作成する

-   `プロジェクト名/login名 (レビュワー)/〇〇:〇〇~ (開始時間)` の形式で、レビューの情報を含んだボイスチャンネルを作成します。
-   レビューの開始時間になっても、レビュワーがレビューチャンネルにいない場合には、レビューチャンネルで該当ユーザーにメンションを飛ばします。

| オプション   | 必須 | 詳細                                                     |
| ------------ | ---- | -------------------------------------------------------- |
| `[project]`  | ✔︎   | レビューするプロジェクトの名前を入力する                 |
| `[time]`     | ✔︎   | レビューの開始時間を入力する（hhmm）                     |
| `[reviewer]` |      | 指定のユーザーをレビュワーに設定する（デフォルトは自分） |

<hr/>

### ️:wastebasket: `/done` : レビューチャンネルを削除する

-   レビュー終了時にボイスチャンネルを削除するためのコマンドです。
-   レビューカテゴリー以下に存在するボイスチャンネルのみが削除の対象となっています。

| コマンド        | 詳細                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `/done choose`  | - 自分のレビューチャンネルの一覧を表示<br> - 選択したレビューチャンネルを削除する |
| `/done all`     | - 自分がレビュワーである全てのレビューチャンネルを削除する                        |
| `/done current` | - 現在入室中のレビューチャンネルを削除する                                        |

<hr/>

### ️:clock2: `/history` : レビュー履歴を表示する

-   先日以前のレビュー履歴を最大 20 件表示します。

| オプション | 必須 | 詳細                                     |
| ---------- | ---- | ---------------------------------------- |
| なし       |      | 自分の直近のレビュー履歴を表示する       |
| `[user]`   |      | 指定のユーザーとのレビュー履歴を表示する |

<hr/>

### ️:mega: `/help` : Review-bot の使い方を表示する
