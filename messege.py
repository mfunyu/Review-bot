from discord import Embed


async def send_msg(channel, msg: Embed):
    await channel.send(embed=msg)


async def send_msg_check(msg, reaction, reply):
    await msg.add_reaction('✅')
    await msg.channel.send(reply)


async def react_and_send_msg(msg, reaction, reply):
    await msg.add_reaction(reaction)
    await msg.channel.send(reply)


async def create_help() -> Embed:
    embed = Embed(
        title='【Reveiw botの使い方】',
        color=0xFFD865
    )
    embed.add_field(
        name='For ReviewER',
        value='''
``/[project] [time]``\nex) /libft 1642
1a.レビューボイスチャンネルを作成\n1b.時間になったらDMで通知''',
        inline=False
    )
    embed.add_field(
        name='Invite (call)',
        value='''
``/call [user]``\nex) /call nop
1a.レビュー相手にレビュー開始のDMを送る\n1b.onlineでない場合その旨通知''',
        inline=False
    )
    embed.add_field(
        name='Terminate',
        value='''
``/done``,``/clear``,``/del``,``/rm``
入室中のレビューボイスチャンネルと、レビューテキストチャンネルを消去
Project_Review内の自分の名前を含むチャンネルを全て消去\n''',
        inline=False
    )
    embed.add_field(
        name='Issue',
        value='``/issue``\n当botのバグ、または機能の改善等のご意見を匿名で受け付けています（botにDM可能です）\n',
        inline=False
    )
    return embed


async def call_person(name, author, vc_on, vc) -> Embed:
    dm = f'{name}さん、こんにちは。\n{author}さんとのレビューの時間です :)'
    embed = Embed(
        title='【レビュー通知】',
        description=dm,
        color=0xffa500
    )
    if vc_on:
        embed.add_field(
            name='channel',
            value=f'''macOS: ``CMD+K !{vc.channel.name}``
Windows: ``Ctrl+K !{vc.channel.name}``'''
        )
    return embed


def review_notify(name, prj, time, channel) -> Embed:
    title = '【レビュー通知】'
    dm = f'{name}さん こんにちは。\n時間になりましたので、以下のチャンネルからレビューに参加してください :)'
    embed = Embed(
        title=title,
        description=dm,
        color=0xd2b48c
    )
    embed.add_field(
        name='Project名',
        value=f'{prj}'
    )
    embed.add_field(
        name='開始',
        value=f'{time}'
    )
    embed.add_field(
        name='チャンネル',
        value=f'macOS: ``CMD+K !{channel}``\nWindows: ``Ctrl+K !{channel}``'
    )
    return embed
