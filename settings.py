from dotenv import load_dotenv
from pathlib import Path  # python3 only
import os

load_dotenv()

# OR, the same with increased verbosity
load_dotenv(verbose=True)

# OR, explicitly providing path to '.env'
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

DISCORD_TOKEN = os.getenv("MY_DISCORD_TOKEN")
VOICE_CATEGORY = os.environ["VOICE_CATEGORY"]
