import requests
import constant

url = f"https://discord.com/api/v8/applications/{constant.APPLICATION_ID}/guilds/{constant.GUILD_ID}/commands"
json = {
    "name": "rev",
    "description": "create review voice channel",
    "options": [
        {
            "name": "project",
            "description": "name of the reviewing project",
            "type": 3,
            "required": True,
            "choices": [
                {
                    "name": "libft",
                    "value": "libft"
                },
                {
                    "name": "old-cpp module 04",
                    "value": "old-cpp module 04"
                },
                {
                    "name": "get_next_line",
                    "value": "get_next_line"
                }
            ]
        },
        {
            "name": "time",
            "description": "starting time of review",
            "type": 3,
            "required": True
        },
        {
            "name": "reviewer",
            "description": "if you are reviewee, set reviewer's name",
            "type": 3,
            "required": False
        }
    ],
    "name": "done",
    "description": "delete review voice channel",
    "options": [
        {
            "name": "all",
            "description": "delete all voice channels with your id",
            "type": 5,
            "default": False
            "required": False
        },
        {
            "name": "current",
            "description": "delete the voice channel you are in which is not yours",
            "type": 5,
            "default": False
            "required": False
        }
    ]
}

# For authorization, you can use either your bot token
headers = {
    "Authorization": f"Bot {constant.TOKEN}"
}

r = requests.post(url, headers=headers, json=json)
print(r.json())
