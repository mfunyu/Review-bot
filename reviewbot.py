import constant
import function as func
import messege as msg
import threading
import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = discord.Client()
CATEGORY = ""
# または:
# bot = commands.Bot(command_prefix='@', intents=discord.Intents.all())

slash_client = SlashCommand(bot)

@slash_client.slash(name="rev")
async def create_vc(ctx, project: str, time: str):
    for guild in bot.guilds:
        if guild.name == constant.GUILD:
            break
    username = ctx.author.nick
    if not username:
        username = ctx.author.name
    time, diff = func.get_time(time)
    ch_name = '{}/{}/{}~'.format(project, username, time)
    if ch_name in str([c for c in CATEGORY.channels]):
        reply = f'ボイスチャンネル {ch_name} はすでに存在しています'
        await ctx.send(content=reply, hidden=True)
        return
    new_channel = await CATEGORY.create_voice_channel(name=ch_name)
    if diff:
        if not ctx.author.dm_channel:
            await ctx.author.create_dm()
        thread = threading.Thread(
                    target=func.set_scheule, name=ch_name,
                    args=(diff, time, new_channel, ctx.author, project, ctx.author.dm_channel, guild)
                )
        thread.start()
    reply = f'ボイスチャンネル {ch_name} を作成しました'
    await ctx.send(content=reply, hidden=True)




@bot.event
async def on_ready():
    global CATEGORY
    if not CATEGORY:
        # guild を指定
        for guild in bot.guilds:
            if guild.name == constant.GUILD:
                break
        # カテゴリーを指定
        CATEGORY = discord.utils.get(guild.categories, name=constant.VOICE_CATEGORY)

    # guildを指定
    for guild in bot.guilds:
        if guild.name == constant.GUILD:
            break
    print('bot ready.')

bot.run(constant.TOKEN)

