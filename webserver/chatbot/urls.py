import hashlib
from django.urls import path

from . import views

app_name = "chatbot"


urlpatterns = [
    path("", views.Chatbot.as_view(), name="chatbot"),
    path("gpt2owt/", views.gpt2_owt_api, name="gpt2owt"),
    path("gpt2cd/", views.gpt2_cd_api, name="gpt2cd"),
    path("gethistory/", views.get_history_api, name="gethistory"),
    path("delhistory/", views.delete_history_api, name="delhistory"),
]
