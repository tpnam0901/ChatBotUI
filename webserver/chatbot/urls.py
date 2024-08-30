import hashlib
from django.urls import path

from . import views

app_name = "chatbot"


urlpatterns = [
    path("", views.Chatbot.as_view(), name="chatbot"),
]
