import discord
import re

from datetime import datetime
import sched
import time
import asyncio

import constant
import messege as msgs

GUILD = constant.GUILD
VOICE_CATEGORY = constant.VOICE_CATEGORY
WAITING_CHANNEL = constant.WAITING_CHANNEL
TIMEZONE = constant.TIMEZONE

CATEGORY = ""

# 接続に必要なオブジェクトを生成
client = discord.Client()

# イベントループを取得
loop = asyncio.get_event_loop()


def set_category(guild):
    global CATEGORY
    CATEGORY = discord.utils.get(guild.categories, name=VOICE_CATEGORY)


# targetがnameと同一人物か判定する
def match_name(name, target):
    if re.match(name+r'(?![a-z])', target):
        return True
    else:
        return False


# レビューの開始時間を読み込む （エラー処理まだ)
def get_time(s_time):

    s_time = ''.join(s_time.split(':'))
    minute = s_time[-2:]
    hour = '0' + s_time[:-2]
    hour = str(int(hour[-2:]) % 24)

    ynow = datetime.now(TIMEZONE).strftime('%Y')
    mnow = datetime.now(TIMEZONE).strftime('%m')
    dnow = datetime.now(TIMEZONE).strftime('%d')
    input_time = datetime(year=int(ynow), month=int(mnow),
                          day=int(dnow), hour=int(hour), minute=int(minute))
    aware_time = TIMEZONE.localize(input_time)
    diff_timedelta = aware_time - datetime.now(TIMEZONE)
    diff = diff_timedelta.total_seconds()
    # late || soon
    if (-3600 <= diff <= 30):
        diff = 0
    # tomorrow
    elif (diff < 0):
        diff += 60 * 60 * 24

    return f'{hour}:{minute}', diff


def notify_on_time(time, new_channel, member, prj, DM, guild):
    if not CATEGORY:
        set_category(guild)
    if new_channel.name not in str([c for c in CATEGORY.channels]):
        return
    # すでにチャンネルにいる場合
    if member.voice and member.voice.channel.name == new_channel.name:
        return
    elif member.voice and member.voice.channel.name == WAITING_CHANNEL:
        # A: レビュー待機にいる場合
        asyncio.ensure_future(
            member.edit(mute=False, voice_channel=new_channel),
            loop=loop
        )
        return
    # B: レビュー待機にいない場合
    else:
        asyncio.ensure_future(
            DM.send(
                embed=msgs.review_notify(member.name, prj,
                                         time, new_channel.name)
            ),
            loop=loop
        )


def set_scheule(diff, t, new_channel, user, prj, dm, guild):
    scheduler = sched.scheduler(time.time, time.sleep)
    scheduler.enter(diff, 1, notify_on_time,
                    (t, new_channel, user, prj, dm, guild, ))
    scheduler.run()


def status_in_vc(msgauthor, guild):
    if not CATEGORY:
        set_category(guild)
    try:
        vc = msgauthor.voice
    except:
        return False
    if (vc and vc.channel.category == CATEGORY
            and vc.channel.name != WAITING_CHANNEL):
        return True
    return False
