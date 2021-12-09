"""
42 Review-bot

"""

import discord
from datetime import datetime
import threading
import constant

import messege as msgs
import function as func
import constant as co

TOKEN = co.TOKEN
TIMEZONE = co.TIMEZONE
GUILD = co.GUILD
VOICE_CATEGORY = co.VOICE_CATEGORY
WAITING_CHANNEL = co.WAITING_CHANNEL

CATEGORY = ""

# 接続に必要なオブジェクトを生成
client = discord.Client()


# メッセージ受信時に動作する処理
@client.event
async def on_message(message):

    global CATEGORY
    if not CATEGORY:
        # guild を指定
        for guild in client.guilds:
            if guild.name == GUILD:
                break
        # カテゴリーを指定
        CATEGORY = discord.utils.get(guild.categories, name=VOICE_CATEGORY)

    # メッセージ送信者がBotだった場合は無視する
    if message.author.bot:
        return

    # guildを指定
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    msg = message.content.split()

    # ヘルプ：botの使い方を表示する
    if message.content.startswith("/help"):
        await msgs.send_msg(message.channel, await msgs.create_help())

    # 呼び出し：名前を指定して相手にdmを送る
    elif message.content.startswith("/call"):
        if len(msg) != 2:
            return
        name = msg[1]
        member = discord.utils.find(lambda m: func.match_name(name, m.name),
                                    guild.members)
        if not member:
            reply = '該当するユーザーが見つかりません。ユーザー名を確認してください。'
            await msgs.react_and_send_msg(message, '❓', reply)
            return
        if (func.status_in_vc(message.author, guild) and member.voice
                and member.voice.channel.name == WAITING_CHANNEL):
            await member.edit(mute=False,
                              voice_channel=message.author.voice.channel)
        else:
            if not member.dm_channel:
                await member.create_dm()
            vc = ""
            status = func.status_in_vc(message.author, guild)
            if status:
                vc = message.author.voice
            username = message.author.nick
            if not username:
                username = message.author.name
            await msgs.send_msg(member.dm_channel,
                                await msgs.call_person(member.name,
                                                       username,
                                                       status, vc))
            if str(member.status) != 'online':
                reply = f'{member.name}さんはオンラインではない可能性があります。'
                await msgs.react_and_send_msg(message, co.EXCLAMATION, reply)
        await message.add_reaction('✅')

    elif (message.content == "/clear"
            or message.content == "/done"
            or message.content == "/del"
            or message.content == "/rm"):
        username = message.author.nick
        if not username:
            username = message.author.name
        if func.status_in_vc(message.author, guild):
            vc = message.author.voice
            if username in vc.channel.name:
                await vc.channel.delete()
                await message.add_reaction('✅')
                reply = 'レビューお疲れ様でした :)'
                await msgs.react_and_send_msg(message, '👏', reply)
                return
        reply = ''
        for channel in CATEGORY.channels:
            if username in channel.name:
                reply += f'\"{channel.name}\" '
                await channel.delete()
        if not reply:
            reaction = '❓'
            reply = '{}を含むチャンネルはありませんでした'.format(username)
        else:
            reaction = '✅'
            reply += 'を削除しました'
        await msgs.react_and_send_msg(message, reaction, reply)

    # レビュワーがレビュー用チャンネルを立てる
    elif message.content.startswith("/"):
        if len(msg) != 2 or not msg[1].split(':')[0].isdigit():
            return
        prj = msg[0][1:]
        username = message.author.nick
        if not username:
            username = message.author.name
        time, diff = func.get_time(msg[1])
        ch_name = '{}/{}/{}~'.format(prj, username, time)
        if ch_name in str([c for c in CATEGORY.channels]):
            reply = f'ボイスチャンネル {ch_name} はすでに存在しています'
            await msgs.react_and_send_msg(message, '❓', reply)
        else:
            new_channel = await CATEGORY.create_voice_channel(name=ch_name)
            if diff:
                if not message.author.dm_channel:
                    await message.author.create_dm()
                thread = threading.Thread(target=func.set_scheule, name=ch_name,
                                          args=(diff, time, new_channel,
                                                message.author, prj,
                                                message.author.dm_channel,
                                                guild))
                thread.start()
            await message.add_reaction('✅')


# Botの起動とDiscordサーバーへの接続
client.run(TOKEN)
