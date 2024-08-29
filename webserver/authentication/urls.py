import hashlib
from django.urls import path

from . import views

app_name = "authentication"

signout = hashlib.sha256(b"this URL is for sign out").hexdigest()

urlpatterns = [
    path("", views.SignIn.as_view(), name="signin"),
    path("signup/", views.SignUp.as_view(), name="signup"),
    path("signout/".format(str(signout)), views.SignOut.as_view(), name="signout"),
]
