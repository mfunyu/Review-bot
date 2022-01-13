import function as func
import constant as co


class Status:

    category = ''

    def __init__(self, user, guild):
        if not Status.category:
            Status.category = func.set_category(Status.guild)

        self.user = user
        self.in_vc = Status.status_in_vc(self)

        if self.in_vc:
            self.vc = self.user.voice

    def status_in_vc(self):
        try:
            vc = self.user.voice
        except:
            return False
        if (vc.channel.category == Status.category
                and vc.channel.name != co.WAITING_CHANNEL):
            return True
        return False

    def in_waiting_ch(self):
        try:
            vc = self.user.voice
        except:
            return False
        if (vc.channel.category == Status.category
                and vc.channel.name == co.WAITING_CHANNEL):
            return True
        return False
