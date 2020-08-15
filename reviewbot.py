import discord
from discord.ext import tasks
import datetime
import threading
import asyncio
import sched
import time
import re
import settings

# envファイルに設定したbotのトークンを取得
TOKEN = settings.DISCORD_TOKEN
# guild名
#GUILD = '42Tokyo_42cursus'
GUILD = 'U_challenge'
# ボイスチャンネルのカテゴリー名
VOICE_CATEGORY = 'Project Review'
# レビュー待機コーナー名
WAITING_CHANNEL = 'レビュー待機'

# 接続に必要なオブジェクトを生成
client = discord.Client()

# イベントループを取得
loop = asyncio.get_event_loop()

# targetがnameと同一人物か判定する
def match_name(name, target):
    if re.match(name+r'(?![a-z])', target):
        return True
    else:
        return False

# レビューの開始時間を読み込む （エラー処理まだ)
def get_time(s_time):
    flag = False
    if ':' in s_time:
        s_time = s_time.split(':')[0] + s_time.split(':')[1]
    if len(s_time) == 3:
        hour = '0' + s_time[0]
        min = s_time[1:]
        review = datetime.datetime.strptime(s_time)
    elif len(s_time) == 4:
        hour = s_time[:2]
        min = s_time[2:]
    hour = str(int(hour) % 24)
    if datetime.datetime.now().strftime('%H:%M') == f'{hour}:{min}':
        diff = 0
    else:
        ynow = datetime.datetime.now().strftime('%Y')
        mnow = datetime.datetime.now().strftime('%m')
        if datetime.datetime.now().strftime('%H:%M') < f'{hour}:{min}':
            dnow = datetime.datetime.now().strftime('%d')
        else:
            dnow = int(datetime.datetime.now().strftime('%d')) + 1
        review = datetime.datetime(year=int(ynow), month=int(mnow), day=int(dnow), hour=int(hour), minute=int(min))
        diff_timedelta = review - datetime.datetime.now()
        diff = diff_timedelta.total_seconds()
    return f'{hour}:{min}', diff

def notify_on_time(time, new_channel, member, prj, DM, invite):
    if new_channel == '':
        title = '【レビュー通知】'
        dm = f'{member.name}さん こんにちは。 レビューの時間です :)'
        embed = discord.Embed(title=title, description=dm, color=0x7FC4B8)
        embed.add_field(name='Project名', value=f'{prj}')
        embed.add_field(name='開始', value=f'{time}')
        embed.add_field(name='待機場所', value=invite)
        asyncio.ensure_future(DM.send(embed=embed), loop=loop)
    elif member.voice and member.voice.channel.name == WAITING_CHANNEL:
        # A: レビュー待機にいる場合
        asyncio.ensure_future(member.edit(mute=False, voice_channel=new_channel), loop=loop)
        return
    # B: レビュー待機にいない場合
    else:
        # invite = asyncio.ensure_future(new_channel.create_invite(), loop=loop)
        # if not member.dm_channel:
        #     asyncio.ensure_future(member.create_dm(), loop=loop)
        # print(member.dm_channel)
        title = '【レビュー通知】'
        dm = f'{member.name}さん こんにちは。\n時間になりましたので、以下のリンクからレビューに参加してください :)'
        embed = discord.Embed(title=title, description=dm, color=0x7FC4B8)
        embed.add_field(name='Project名', value=f'{prj}')
        embed.add_field(name='開始', value=f'{time}')
        embed.add_field(name='チャンネル', value=invite)
        asyncio.ensure_future(DM.send(embed=embed), loop=loop)
        # await member.dm_channel.send(invite)


def set_scheule(diff, t, new_channel, user, prj, dm, invite):
    print("@set_schedule")
    scheduler = sched.scheduler(time.time, time.sleep)
    scheduler.enter(diff, 1, notify_on_time, (t, new_channel, user, prj, dm, invite, ))
    scheduler.run()

    # print("@add_thread")
    # thread = threading.Thread(target=notify_on_time.start, args=(time, new_channel, user, prj,))
    # thread.start()

# 起動時に動作する処理
@client.event
async def on_ready():
    # 起動したらターミナルにログイン通知が表示される
    print('ログインしました')

    # guildを指定
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    # guildにいるメンバーを出力
    print(
        f'{client.user} is connected to the following guild:\n'
        f'{guild.name}(id: {guild.id})\n')

    members = '\n - '.join([member.name for member in guild.members])
    print(f'Guild Members:\n - {members}')

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

    category = discord.utils.get(guild.categories, name=VOICE_CATEGORY)
    msg = message.content.split()

    # ヘルプ：botの使い方を表示する
    if message.content.startswith("/help"):
        embed = discord.Embed(title='【Reveiw botの使い方】', color=0xFFD865)
        embed.add_field(name='For ReviewER', value='``/[project] [time]``\nex) /C00 2342\n1.レビューボイスチャンネルを作成\n2a.レビュー待機にいる場合、時間になったらチャンネルに自動移遷\n2b.それ以外の場合、時間になったら招待リンクをDMで通知',inline=False)
        embed.add_field(name='For ReviewEE', value='``//[project] [time]``\nex) //C00 2342\n時間になったらDMで通知',inline=False)
        embed.add_field(name='Text', value='``/text ([project] [time])``\nex) /text\n自分のいるボイスチャンネルの名前のテキストチャンネルを作成\nex) /text C00\n時間やプロジェクト名を指定し自分のテキストチャンネルを作成',inline=False)
        embed.add_field(name='Invite (call)', value='``/call [user]``\nex) /call nop\n1a.相手がレビュー待機にいる場合、自分のいるレビューチャンネルに呼ぶ\n1b.それ以外の場合、招待リンクをDMで送る\n2.onlineでない場合その旨通知',inline=False)
        embed.add_field(name='Terminate', value='``/done``\n自分のいるレビューボイスチャンネルとレビューテキストチャンネルを消去\n',inline=False)
        embed.add_field(name='Clear', value='``/clear``\nProject_Review内の自分の名前を含むチャンネルを全て消去\n',inline=False)
        await message.channel.send(embed=embed)

    # 呼び出し：名前を指定して相手にdmを送る
    elif message.content.startswith("/call"):
        if len(msg) != 2:
            return
        name = msg[1]
        member = discord.utils.find(lambda m: match_name(name, m.name), guild.members)
        category = discord.utils.get(guild.categories, name=VOICE_CATEGORY)
        if not member:
            await message.add_reaction('❓')
            reply = '該当するユーザーが見つかりません。ユーザー名を確認してください。'
            await message.channel.send(reply)
        else:
            flag = False
            vc = message.author.voice
            if vc and vc.channel.category == category and vc.channel.name != WAITING_CHANNEL:
                if member.voice and member.voice.channel.name == WAITING_CHANNEL:
                    await member.edit(mute=False, voice_channel=vc.channel)
                    flag = True
            if not flag:
                if not member.dm_channel:
                    await member.create_dm()
                dm = f'{member.name}さん、こんにちは。\n{message.author.name}さんとのレビューの時間です :)'
                embed = discord.Embed(title='【レビュー呼び出し】', description=dm, color=0x00AFB9)
                if vc and vc.channel.category == category and vc.channel != WAITING_CHANNEL:
                    invite = await vc.channel.create_invite(max_age=600, max_uses=1)
                    embed.add_field(name='channel', value=invite)
                await member.dm_channel.send(embed=embed)
                if str(member.status) != 'online':
                    reply = f'{member.name}さんはオンラインではない可能性があります。'
                    await message.add_reaction('\N{Heavy Exclamation Mark Symbol}')
                    await message.channel.send(reply)
                flag = True
            if not flag:
                await message.add_reaction('❌')
            else:
                await message.add_reaction('✅')


    # elif message.content.startswith("/add"):

    # レビュー終了：レビューチャンネルを消去 ＋ メッセージを送る
    elif message.content == "/done":
        vc = message.author.voice
        if vc and vc.channel.category == category and vc.channel.name != WAITING_CHANNEL:
            name = vc.channel.name.replace('/', '-').replace(':', '')[:-1]
            await vc.channel.delete()
            if name in str([c for c in category.channels]):
                channel = discord.utils.get(guild.channels, name=name)
                await channel.delete()
            await message.add_reaction('✅')
        reply = 'レビューお疲れ様でした :)'
        await message.channel.send(reply)
        await message.add_reaction('👏')

    elif message.content == "/clear":
        reply = ''
        user = message.author.name
        for channel in [c for c in category.channels]:
            if user in channel.name:
                reply += f'\"{channel.name}\" '
                await channel.delete()
        if not reply:
            await message.add_reaction('❓')
            reply = '{}を含むチャンネルはありませんでした'.format(user)
        else:
            await message.add_reaction('✅')
            reply += 'を削除しました'
        await message.channel.send(reply)

    # 全削除：カテゴリー内の空のチャンネルを全削除する（レビュー待機以外）
    elif message.content == "/remove-all":
        reply = ''
        for channel in [c for c in category.channels if not c.members if c.name != WAITING_CHANNEL]:
            reply += f'\"{channel.name}\" '
            await channel.delete()
        if not reply:
            await message.add_reaction('❓')
            reply = '空のチャンネルはありませんでした'
        else:
            await message.add_reaction('✅')
            reply += 'を削除しました'
        await message.channel.send(reply)

    # 削除：カテゴリー内の指定のチャンネルを削除する
    elif message.content.startswith("/remove"):
        if len(msg) != 2:
            return
        channel_name = msg[1]
        channel = discord.utils.get(guild.channels, name=channel_name)
        if not channel:
            await message.add_reaction('❓')
            reply = '該当するチャンネルが見当たりません。チャンネル名を確認してください。'
        else:
            await channel.delete()
            await message.add_reaction('✅')
            reply = f'{channel_name} を削除しました'
        await message.channel.send(reply)

    # elif message.content == "/rm":
    #     reply = ''
    #     for channel in [c for c in category.channels if not c.members if c.name != WAITING_CHANNEL]:
    #         reply += f'{channel.name} '
    #         await channel.delete()
    #     if not reply:
    #         await message.add_reaction('❓')
    #         reply = '空のチャンネルはありませんでした'
    #     else:
    #         await message.add_reaction('✅')
    #         reply += 'を削除しました'
    #     await message.channel.send(reply)

    elif message.content.startswith("/text"):
        name = ''
        vc = message.author.voice
        if vc and vc.channel.category == category and vc.channel.name != WAITING_CHANNEL:
            name = vc.channel.name.replace('/', '-')
        elif len(msg) == 2:
            name = '{}-{}'.format(msg[1], message.author.name)
        elif len(msg) == 3:
            name = '{}-{}-{}'.format(msg[1], message.author.name, get_time(msg[2])[0])
        else:
            reply = f'チャンネル名を指定してください ex) /text ex00'
            await message.add_reaction('\N{Heavy Exclamation Mark Symbol}')
            await message.channel.send(reply)
            return
        new_channel = await category.create_text_channel(name=name)
        await message.add_reaction('✅')
        reply = f'テキストチャンネル{new_channel.mention}を作成しました'
        await message.channel.send(reply)

    # レビュイーがdmを設定する
    elif message.content.startswith("//"):
        prj = msg[0][2:]
        user = message.author.name
        time = get_time(msg[1])[0]
        diff = get_time(msg[1])[1]
        if not message.author.dm_channel:
            await message.author.create_dm()
        channel = discord.utils.get(guild.channels, name=WAITING_CHANNEL)
        invite = await channel.create_invite(max_age=600, max_uses=1)
        new_channel = ''
        thread = threading.Thread(target=set_scheule, args=(diff, time, new_channel, message.author, prj, message.author.dm_channel, invite))
        thread.start()
        await message.add_reaction('✅')

    # チャンネル名を指定してボイスチャンネルを作成してそのチャンネルに移動させる
    elif message.content.startswith("/voice"):
        user = message.author.name
        channel = msg[1]
        await Guild.change_voice_state(voice_channel=channel)
        reply = f'参加しました'
        await message.channel.send(reply)

    elif message.content.startswith("/cancel"):
        prj = msg[1]
        user = message.author.name
        time = get_time(msg[2])[0]
        name = '{}/{}/{}~'.format(prj, user, time)
        if name in str([c for c in category.channels]):
            channel = discord.utils.get(guild.channels, name=name)
            await channel.delete()
        await message.add_reaction('✅')
        # スレッドをキャンセルしたいけどできない…
        # print(threading.enumerate())
        # print(threading.active_count())
        # print(threading.Thread.name)

    # レビュワーがレビュー用チャンネルを立てる
    elif message.content.startswith("/"):
        if len(msg) != 2:
            return
        prj = msg[0][1:]
        user = message.author.name
        time = get_time(msg[1])[0]
        diff = get_time(msg[1])[1]
        name = '{}/{}/{}~'.format(prj, user, time)
        if name in str([c for c in category.channels]):
            reply = f'ボイスチャンネル {name} はすでに存在しています'
            await message.add_reaction('❓')
            await message.channel.send(reply)
        else:
            new_channel = await category.create_voice_channel(name=name)
            if not message.author.dm_channel:
                await message.author.create_dm()
            invite = await new_channel.create_invite(max_age=600, max_uses=1)
            thread = threading.Thread(target=set_scheule, name=name, args=(diff, time, new_channel, message.author, prj, message.author.dm_channel, invite))
            thread.start()
            # await message.add_reaction('✅')
            # notify_on_time.start(time, new_channel, message.author, prj)

# memberのボイスステータスがかわると起動
@client.event
async def on_voice_state_update(member, before, after):
    # guildを指定
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    # 特定のカテゴリーのチャンネルから離脱したときに
    # そこが空かつWAITING_CHANNELでないなら削除する
        # if before.channel:
        #     if before.channel.name != WAITING_CHANNEL:
        #         if not before.channel.members:
        #             if before.channel.category == category:
        #                 await before.channel.delete()

    # ボイスチャンネルから移動したらサーバーミュートを解除する
        # if before.mute:
        #     if before.channel:
        #         if before.channel.name == WAITING_CHANNEL:
        #             if after.channel != before.channel:
        #                 await member.edit(mute=False)
        # これではサーバー離脱したときにエラーがおこる

    # レビュー待機ではmute, それ以外ではmuteOffにする
    if member.voice:
        if after.mute:
            if after.channel.name != WAITING_CHANNEL:
                await member.edit(mute=False)
        else:
            if after.channel.name == WAITING_CHANNEL:
                await member.edit(mute=True)


# レビュー時間に
# A: レビュワーがレビュー待機にいる場合はレビューボイスチャンネルに移動させる
# B: レビュワーがレビュー待機にいない場合は招待用dmを送る
# @tasks.loop(seconds=10)
    # async def notify_on_time(time, new_channel, member, prj):
    #     now = datetime.datetime.now().strftime('%H:%M')
    #     if now == time:
    #         flag = False
    #         if member.voice:
    #             # A: レビュー待機にいる場合
    #             if member.voice.channel.name == WAITING_CHANNEL:
    #                 await member.edit(mute=False, voice_channel=new_channel)
    #                 flag = True
    #         # B: レビュー待機にいない場合
    #         if flag == False:
    #             invite = await new_channel.create_invite()
    #             if not member.dm_channel:
    #                 await member.create_dm()
    #             title = '【レビュー通知】'
    #             dm = f'{member.name}さん こんにちは。 以下のリンクからレビューに参加してください :)'
    #             embed = discord.Embed(title=title, description=dm, color=0x7FC4B8)
    #             embed.add_field(name='Project名', value=f'{prj}')
    #             embed.add_field(name='開始', value=f'{time}')
    #             embed.add_field(name='チャンネル', value=invite)
    #             await member.dm_channel.send(embed=embed)
    #             # await member.dm_channel.send(invite)
    #         notify_on_time.stop()


# Botの起動とDiscordサーバーへの接続

client.run(TOKEN)
