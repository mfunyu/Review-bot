import requests
import sys
import json
import settings
from FtApi import FtApi

class ReviewStat:

    def __init__(self, client_uid, client_secret):
        print("Initializing API connection ...")
        self.ftApi = FtApi(client_uid, client_secret)
        self.d_projects = {}
        self.d_reviews = {}

    def get_scale_teams(self) -> list:
        kwargs = {
            "filter" : {"campus_id" : 26},
            "range" : {"begin_at" : "2020-06-20T15:00:00.000Z,2022-01-09T15:00:00.000Z"},
            "page": {"size" : 100},
        }
        return self.ftApi.Scale_teams(**kwargs).Get()

    def get_projects(self, id):
        return self.ftApi.Projects(str(id)).Get()['name']

    def get_project_name(self, r: dict) -> str:
        project_id = r['team']['project_id']
        project_name = self.d_projects.get(project_id)

        # resolve project name and add to project dict
        if not project_name:
            project_name = self.get_projects(project_id)
            self.d_projects[project_id] = project_name

        return project_name

    def create_list(self, project_name: str, r: dict) -> dict:
        time = r['begin_at']
        reviewee = r['correcteds'][0]['login']
        reviewer = r['corrector']['login']
        # debug
        # print(f"{time} {project_name} {reviewee} {reviewer}")

        d_review = {
            (reviewer, reviewee) : {
                                        "time" : time,
                                        "project" : project_name
                                   }
        }
        return d_review

    def get_data(self):
        print("Collecting data ...")
        results = self.get_scale_teams()

        print("Parsing collected data ...")
        results = self.get_scale_teams()
        for r in results:
            project_name = self.get_project_name(r)
            if project_name == "C Piscine C":
                continue
            d = self.create_list(project_name, r)
            self.d_reviews.update(d)

    def print_data(self):
        for key, value in self.d_reviews.items():
            print (key, value)


g = ReviewStat(settings.CLIENT_UID, settings.CLIENT_SECRET)
g.get_data()
g.print_data()
