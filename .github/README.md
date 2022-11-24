[English (en)](README.md) • [日本語 (ja)](README_ja.md) • [Instllation Guide](INSTALL.md)

<h1 align="center"> Review-bot </h1>
<p align="center">
Review-bot is a discord bot made for Review at 42 Tokyo. <br>
It reduces the annoyance of creating and deleting review channels,<br>allowing you to perform smooth reviews on Discord. </p>

## About

Due to COVID-19, the review of assignments at 42Tokyo shifted to online, and we began using a voice channel on Discord.
This added extra steps of creating a review voice channel before and deleting it after each review. The Review-bot has been created to make this review process a little less tedious.

Also, with online reviews, it has become more difficult to remember whether you have met the person over a previous review.
To be able to quickly check the review history in such situation, a `history` command has been implemented to display the review history using the 42API.

## Usage

Review-bot uses [Slash Commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ), a Discord feature to interact with users.

Since all interactions with Review-bot return ephemeral responses, the bot's responses are visible only to the user. In other words, no matter which text channel you write to, your interaction with the bot will not be visible to other users.

Thus, you can use any text channel you like to enter commands of the Review-bot.

<hr/>

### :loud_sound: `/review` : Create a review voice channel

-   A review channel is created with the review information: `project-name/login (reviewer)/xx:xx~ (begin-at)`
-   If the reviewer is not in the review channel even after the starting time, the bot will remind the user by mentioning them on the channel.

| Option       | Required | Details                                        |
| ------------ | -------- | ---------------------------------------------- |
| `[project]`  | ✔︎       | Name of the project to review                  |
| `[time]`     | ✔︎       | Starting time of the review（hhmm）            |
| `[reviewer]` |          | Set a user to the reviewer (default: yourself) |

<hr/>

### ️:wastebasket: `/done` : Delete review channels

-   Delete the review channel when it's over.
-   Only channels under the review category can be deleted.

| Command         | Details                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `/done choose`  | - Display the list of your review channels<br> - Delete the selected channels |
| `/done all`     | - Delete all your review channels                                             |
| `/done current` | - Delete review channel which you are connected now                           |

<hr/>

### ️:clock2: `/history` : Display review histories

-   Display at most 20 review historys up to yesterday.

| Option   | Required | Details                                     |
| -------- | -------- | ------------------------------------------- |
| None     |          | Display your recent review histories        |
| `[user]` |          | Display your review histories with the user |

> :warning: nickname of each users in the server must be set to 42 login name.

<hr/>

### ️:mega: `/help` : Display usage of the Review-bot
