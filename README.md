# Review-bot

Review-bot は、42 における課題レビューのための bot です。

レビューチャンネル作成の手間を軽減し、Discord 上でのスムーズなレビューを可能にします。

# Usage

## :loud_sound: `/review`: レビューチャンネルを作成する

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

## ️:mega: `/help`: Review-bot の使い方を表示する
