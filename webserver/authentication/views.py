import re
from django.shortcuts import render
from django.shortcuts import render, HttpResponseRedirect
from django.views import View
from django.urls import reverse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User


class SignIn(View):
    """Basic sign in view"""

    def get(self, request):
        # check if user is logged in
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("authentication:noti"))
        return render(request, "authentication/signin.html")

    def login(self, request):
        if request.user.is_authenticated:
            return True
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return True
        return False

    # API for sign in
    def post(self, request):
        # Get username and password from form
        verify = self.login(request)
        if verify:
            return HttpResponseRedirect(reverse("authentication:noti"))
        return render(
            request,
            "authentication/signin.html",
            {"message": "Wrong username or password!"},
        )


class SignUp(View):
    """Basic sign up view"""

    def get(self, request):
        # check if user is logged in
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("authentication:noti"))
        return render(request, "authentication/signup.html")

    def login(self, request):
        if request.user.is_authenticated:
            return True
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return True
        return False

    def valid_password(self, password):
        # At least 8 character
        if len(password) < 8:
            return False
        # At least one number
        elif len(re.findall("\\d", password)) == 0:
            print(2)
            return False
        # At least one special character
        elif len(re.findall("[!,@,#,$,%,^,&,*,(,)]", password)) == 0:
            print(3)
            return False
        # Does not contain space
        elif len(re.findall("\\s", password)) > 0:
            print(4)
            return False
        return True

    def valid_username(self, username):
        # At least 8 character
        if len(username) < 8:
            return False

        # No special character
        elif len(re.findall("\\W", username)) > 0:
            return False
        # Does not contain space
        elif len(re.findall("\\s", username)) > 0:
            return False
        return True

    def valid_useremail(self, useremail):
        return re.match("[a-zA-Z0-9]+@{1}khu.ac.kr", useremail) is not None

    def post(self, request):
        def noti(request, message):
            return render(
                request,
                "authentication/signup.html",
                {"message": message},
            )

        # Simple API for sign up
        username = request.POST["username"]
        password = request.POST["password"]
        useremail = request.POST["useremail"]
        message = ""
        if username and password and useremail:
            if not self.valid_password(password):
                return noti(
                    request,
                    "The password is invalid! Password must contain at least 8 character, a special character, a number and no space",
                )
            if not self.valid_username(username):
                return noti(
                    request,
                    "The username is invalid! Username must contain at least 8 character, no special character and no space",
                )
            if not self.valid_useremail(useremail):
                return noti(
                    request,
                    "The email is invalid! Only accept the @khu.ac.kr email",
                )
            # Do not existed
            if User.objects.filter(username=username).exists():
                message = "User existed, please choose another username!"
            else:
                User.objects.create_user(
                    username=username, password=password, email=useremail
                )
                message = "Successfully created a new user!"
        else:
            message = "Cannot leave any empty field in the form!"
        # Verify user and login
        verify = self.login(request)
        if verify:
            return HttpResponseRedirect(reverse("authentication:noti"))
        return noti(request, message)


class SignOut(View):
    """API for sign out"""

    def get(self, request):
        if request.user.is_authenticated:
            auth_logout(request)
        return HttpResponseRedirect(reverse("authentication:signin"))
