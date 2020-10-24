"""
42 Review-bot

"""

import discord
from datetime import datetime
import threading
import settings

import messege as msgs
import function as func

# for debugging use ---
# import settings_test as settings

# envファイルに設定したbotのトークンを取得
TOKEN = settings.DISCORD_TOKEN
# guild名
GUILD = settings.GUILD
# ボイスチャンネルのカテゴリー名
VOICE_CATEGORY = '📝Project Review'
# レビュー待機コーナー名
WAITING_CHANNEL = 'レビュー待機'

CATEGORY = ""

# 接続に必要なオブジェクトを生成
client = discord.Client()

TIMEZONE = func.TIMEZONE


EXCLAMATION = '\N{Heavy Exclamation Mark Symbol}'


# for debugging use ---
RM = 0
CLEAR = 0
DEL = 0
DONE = 0


def cnt_use(msg):
    global RM, CLEAR, DEL, DONE
    if msg == "/rm":
        RM += 1
    elif msg == "/clear":
        CLEAR += 1
    elif msg == "/del":
        DEL += 1
    elif msg == "/done":
        DONE += 1
# ---------------------


# 起動時に動作する処理
@client.event
async def on_ready():
    # guildを指定
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    global CATEGORY
    CATEGORY = discord.utils.get(guild.categories, name=VOICE_CATEGORY)


# メッセージ受信時に動作する処理
@client.event
async def on_message(message):
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

    elif message.content.startswith("/issue"):
        print("issue: {} | {}".format(message.content[7:],
                                      str(datetime.now(TIMEZONE))))
        await message.add_reaction('✅')
        await message.add_reaction('🙇')

    elif message.content.startswith("/show stat"):
        print("============")
        print("RM: ", RM)
        print("CLEAR: ", CLEAR)
        print("DONE: ", DONE)
        print("DEL: ", DEL)

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
            await msgs.send_msg(member.dm_channel,
                                await msgs.call_person(member.name,
                                                       message.author.name,
                                                       status, vc))
            if str(member.status) != 'online':
                reply = f'{member.name}さんはオンラインではない可能性があります。'
                await msgs.react_and_send_msg(message, EXCLAMATION, reply)
        await message.add_reaction('✅')

    elif (message.content == "/clear"
            or message.content == "/done"
            or message.content == "/del"
            or message.content == "/rm"):
        cnt_use(message.content)
        if func.status_in_vc(message.author, guild):
            vc = message.author.voice
            name = vc.channel.name.replace('/', '-').replace(':', '')[:-1]
            await vc.channel.delete()
            # delete text channel
            if name in str([c for c in CATEGORY.channels]):
                channel = discord.utils.get(guild.channels, name=name)
                await channel.delete()
            await message.add_reaction('✅')
            reply = 'レビューお疲れ様でした :)'
            await msgs.react_and_send_msg(message, '👏', reply)
            return
        reply = ''
        user = message.author.name
        for channel in [c for c in CATEGORY.channels]:
            if user in channel.name:
                reply += f'\"{channel.name}\" '
                await channel.delete()
        if not reply:
            reaction = '❓'
            reply = '{}を含むチャンネルはありませんでした'.format(user)
        else:
            reaction = '✅'
            reply += 'を削除しました'
        await msgs.react_and_send_msg(message, reaction, reply)

    elif message.content.startswith("/text"):
        name = ''
        if func.status_in_vc(message.author, guild):
            vc = message.author.voice
            name = vc.channel.name.replace('/', '-')
        elif len(msg) == 2:
            name = '{}-{}'.format(msg[1], message.author.name)
        elif len(msg) == 3:
            name = '{}-{}-{}'.format(msg[1], message.author.name,
                                     func.get_time(msg[2])[0])
        else:
            reply = "チャンネル名を指定してください ex) /text ex00"
            await msgs.react_and_send_msg(message, EXCLAMATION, reply)
            return
        new_channel = await CATEGORY.create_text_channel(name=name)
        reply = f'テキストチャンネル{new_channel.mention}を作成しました'
        await msgs.react_and_send_msg(message, '✅', reply)

    elif message.content.startswith("/cancel"):
        if len(msg) != 3:
            reply = "チャンネル名を指定してください ex) /cancel ex00 2342"
            await msgs.react_and_send_msg(message, EXCLAMATION, reply)
            return
        prj = msg[1]
        user = message.author.name
        time = func.get_time(msg[2])[0]
        name = '{}/{}/{}~'.format(prj, user, time)
        if name in str([c for c in CATEGORY.channels]):
            channel = discord.utils.get(guild.channels, name=name)
            await channel.delete()
            await message.add_reaction('✅')
        else:
            reply = '該当するチャンネルが見当たりません。チャンネル名を確認してください。'
            await msgs.react_and_send_msg(message, '❓', reply)
        # スレッドをキャンセルしたいけどできない…

    # レビュワーがレビュー用チャンネルを立てる
    elif message.content.startswith("/"):
        if len(msg) != 2 or not msg[1].split(':')[0].isdigit():
            return
        prj = msg[0][1:]
        user = message.author.name
        time, diff = func.get_time(msg[1])
        name = '{}/{}/{}~'.format(prj, user, time)
        if name in str([c for c in CATEGORY.channels]):
            reply = f'ボイスチャンネル {name} はすでに存在しています'
            await msgs.react_and_send_msg(message, '❓', reply)
        else:
            new_channel = await CATEGORY.create_voice_channel(name=name)
            if diff:
                if not message.author.dm_channel:
                    await message.author.create_dm()
                thread = threading.Thread(target=func.set_scheule, name=name,
                                          args=(diff, time, new_channel,
                                                message.author, prj,
                                                message.author.dm_channel,
                                                guild))
                thread.start()
            await message.add_reaction('✅')


# Botの起動とDiscordサーバーへの接続
client.run(TOKEN)
