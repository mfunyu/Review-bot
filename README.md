# Review-bot

Review-bot は、42 における課題レビューのための bot です。

レビューチャンネル作成の手間を軽減し、Discord 上でのスムーズなレビューを可能にします。

# Usage

Review-bot は Discord の機能である [Slash Commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) を使用しています。

Review-bot の全てのインタラクションが ephemeral なレスポンスを返すため、bot の応答は使用者のみに表示されます。すなわち、どこのテキストチャンネルに書き込んでも、bot とのやりとりが他のユーザーに表示されることはありません。

よって、コマンドを入力するテキストチャンネルを選ばずに、Review-bot を使用することができます。

## :loud_sound: `/review`: レビューチャンネルを作成する

オンラインレビューを行う際に、`プロジェクト名/login名 (レビュワー)/〇〇:〇〇~ (開始時間)` の形式で、レビューの情報を含んだボイスチャンネルを作成します。

-   `[project]`: レビューするプロジェクトの名前を入力する
-   `[time]`: レビューの開始時間を入力する（hhmm）
-   `[reviewer] (optional)`: 指定のユーザーをレビュワーに設定する（デフォルトは自分）

## ️:wastebasket: `/done`: レビューチャンネルを削除する

-   `/done choose` :
    -   自分のレビューチャンネルの一覧を表示
    -   選択したレビューチャンネルを削除する
-   `/done all` :
    -   自分がレビュワーである全てのレビューチャンネルを削除する
-   `/done current` :
    -   現在入室中のレビューチャンネルを削除する

## ️:clock2: `/history`: レビュー履歴を表示する

> 直近のレビュー履歴を最大 20 件表示する

-   `[user] (optional)`: 指定のユーザーとのレビュー履歴を表示する

## ️:mega: `/help`: Review-bot の使い方を表示する
