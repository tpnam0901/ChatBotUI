import json
import os
import requests
from datetime import datetime
from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.views import View
from django.urls import reverse
from django.conf import settings

join = os.path.join
exists = os.path.exists

# Create your views here.
os.makedirs(settings.USER_DATA_ROOT, exist_ok=True)


class Chatbot(View):
    """Basic sign in view"""

    def get(self, request):
        # check if user is logged in
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("authentication:signin"))
        context = {"base_url": request.build_absolute_uri()}

        username = request.user.username
        userdata = {"index": 0}
        userpath = join(settings.USER_DATA_ROOT, username + ".json")
        if exists(userpath):
            with open(userpath, "r") as openfile:
                userdata = json.load(openfile)
        old_messages = {}
        for k, v in userdata.items():
            if k != "index":
                old_messages.update({k: v[0]["text"]})
        context.update({"old_messages": old_messages})
        context.update({"start_message_id": userdata["index"]})
        return render(request, "chatbot/chatbot.html", context)


def gpt2_api(request, url):
    username = request.user.username
    userdata = {"index": 0}
    userpath = join(settings.USER_DATA_ROOT, username + ".json")
    if exists(userpath):
        with open(userpath, "r") as openfile:
            userdata = json.load(openfile)

    messageID = request.POST["messageID"]
    userdata["index"] = int(messageID.split("-")[-1])

    messages = userdata.get(messageID, [])
    messages.append(
        {
            "sender": request.POST["sender"],
            "text": request.POST["message"],
            "timestamp": request.POST["timestamp"],
        }
    )

    try:
        # Call API
        r = requests.post(
            url,
            json=json.dumps({"TOKEN": settings.GPT_TOKEN, "messages": messages}),
        )
        timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M")
        response = {"text": json.loads(r.json())["text"], "timestamp": timestamp}
    except Exception as e:
        print(e)
        timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M")
        response = {
            "text": "I'm busy right now! Please try again later",
            "timestamp": timestamp,
        }

    messages.append(
        {
            "sender": "Bot",
            "text": response["text"],
            "timestamp": response["timestamp"],
        }
    )
    userdata[messageID] = messages
    with open(userpath, "w", encoding="utf-8") as f:
        json.dump(userdata, f, ensure_ascii=False, indent=4)
    return HttpResponse(json.dumps(response))


def gpt2_owt_api(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("authentication:signin"))
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse("Required sign-in to call API")
        return gpt2_api(request, f"{settings.GPT_API_URL}:{settings.GPT_OWT_PORT}")


def gpt2_cd_api(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("authentication:signin"))
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse("Required sign-in to call API")
        return gpt2_api(request, f"{settings.GPT_API_URL}:{settings.GPT_CD_PORT}")


def get_history_api(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("authentication:signin"))
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse("Required sign-in to call API")

        username = request.user.username

        userdata = {"index": 0}
        userpath = join(settings.USER_DATA_ROOT, username + ".json")
        if exists(userpath):
            with open(userpath, "r") as openfile:
                userdata = json.load(openfile)

        messageID = request.POST["messageID"]
        messages = userdata.get(messageID, [])

        return HttpResponse(json.dumps({"history": messages}))


def delete_history_api(request):
    if request.method == "GET":
        return HttpResponseRedirect(reverse("authentication:signin"))
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse("Required sign-in to call API")

        username = request.user.username

        userdata = {"index": 0}
        userpath = join(settings.USER_DATA_ROOT, username + ".json")
        if exists(userpath):
            with open(userpath, "r") as openfile:
                userdata = json.load(openfile)

        messageID = request.POST["messageID"]
        userdata.pop(messageID)
        with open(userpath, "w", encoding="utf-8") as f:
            json.dump(userdata, f, ensure_ascii=False, indent=4)
        return HttpResponse("Done!")
