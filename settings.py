from dotenv import load_dotenv
import os
from pathlib import Path  # python3 only

load_dotenv()

# OR, the same with increased verbosity
load_dotenv(verbose=True)

# OR, explicitly providing path to '.env'
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

DISCORD_TOKEN = os.getenv("FT_DISCORD_TOKEN")
GUILD = "42Tokyo_42cursus"
