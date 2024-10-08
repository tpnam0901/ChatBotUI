
window.onload = function (){
    var username = document.getElementById('username');
    var useremail = document.getElementById('useremail');
    var password = document.getElementById('password');
    var username_noti = document.getElementById("username-noti");
    var useremail_noti = document.getElementById("useremail-noti");
    var password_noti = document.getElementById("password-noti");
    var signup_noti = document.getElementById("signup-noti");
    username_noti.style.display = 'none';
    // set signup notification to red
    signup_noti.style.color = "red";
    // add some space to the top of the notification
    signup_noti.style.paddingTop = "20px";

    username.addEventListener("invalid", function(event){
        // prevent the default action
        event.preventDefault();
        // remove the invalid username or password notification
        signup_noti.style.display = 'none';
        // set the username notification
        username_noti.textContent = 'Username should not be empty.';
        // show the username notification
        username_noti.style.display = 'block';
        // set the text color to red
        username_noti.style.color = 'red';
        // set the max length to 80% of the parent
        username_noti.style.width = '80%';
        // set focus to username
        username.focus();
    });

    username.addEventListener("valid", function(event){
        username_noti.style.display = 'none';
    });

    username.addEventListener("input", function(event){
        // remove the invalid username or password notification
        signup_noti.textContent = '';
        // show the username notification
        username_noti.style.display = 'none';
    });

    // similar to the username event listener
    password.addEventListener("invalid", function(event){
        event.preventDefault();
        signup_noti.style.display = 'none';
        password_noti.textContent = 'Password should not be empty.';
        password_noti.style.display = 'block';
        password_noti.style.color = 'red';
        password_noti.style.width = '80%';
        password.focus();
    });

    // similar to the username event listener
    password.addEventListener("input", function(event){
        // remove the invalid username or password notification
        signup_noti.textContent = '';
        // show the username notification
        password_noti.style.display = 'none';
    });

    useremail.addEventListener("invalid", function(event){
        event.preventDefault();
        signup_noti.style.display = 'none';
        useremail_noti.textContent = 'Email should not be empty.';
        useremail_noti.style.display = 'block';
        useremail_noti.style.color = 'red';
        useremail_noti.style.width = '80%';
        useremail.focus();
    });

    // similar to the username event listener
    useremail.addEventListener("input", function(event){
        // remove the invalid username or password notification
        signup_noti.textContent = '';
        // show the username notification
        useremail_noti.style.display = 'none';
    });
}
