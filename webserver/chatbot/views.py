from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render, HttpResponseRedirect
from django.views import View
from django.urls import reverse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User

# Create your views here.


class Chatbot(View):
    """Basic sign in view"""

    def get(self, request):
        # check if user is logged in
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("authentication:signin"))
        context = {'old_messages':{"old-message-0":"Hi, how are you?",
                                   "old-message-1":"Hello, are you John?"}}
        return render(request, "chatbot/chatbot.html", context)
    
