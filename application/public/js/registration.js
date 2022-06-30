function formValidation()
{
    var username = document.getElementById("uname").value;
    var password = document.getElementById("pword").value;
    var password2 = document.getElementById("pword2").value;

    if (username[0].match(/[a-zA-z]/i) == null){
        window.alert("Enter a username that begins with a character.");
        document.getElementById("uname").focus();
        return false;
    }
    if (username.match(/(.*[a-zA-Z0-9].*){3}/gi) == null){
        window.alert("Enter a username that is 3 or more alphanumeric characters.");
        document.getElementById("uname").focus();
        return false;
    }
    if (password.match(/(?=.*[A-Z])(?=.*\d)(?=.*[-/*+!@#$^&])[A-Za-z\d-/*+!@#$^&]{8}/gi) == null){
        window.alert("enter a password that is 8 or more characters AND contains at least 1 upper case letter AND 1 number and 1 of the following special characters.");
        document.getElementById("pword").focus();
        return false;
    }
    if (password.match(password2) == null){
        window.alert("the password and confirm password inputs should be the same.");
        document.getElementById("pword2").focus();
        return false;
    }
    
    window.alert("The form was submitted");
    return true;
}

function formValidation2(username, password, password2)
{
    if (username[0].match(/[a-zA-z]/i) == null){
        window.alert("Enter a username that begins with a character.");
        document.getElementById("uname").focus();
        return false;
    }
    if (username.match(/(.*[a-zA-Z0-9].*){3}/gi) == null){
        window.alert("Enter a username that is 3 or more alphanumeric characters.");
        document.getElementById("uname").focus();
        return false;
    }
    if (password.match(/(?=.*[A-Z])(?=.*\d)(?=.*[-/*+!@#$^&])[A-Za-z\d-/*+!@#$^&]{8}/gi) == null){
        window.alert("enter a password that is 8 or more characters AND contains at least 1 upper case letter AND 1 number and 1 of the following special characters.");
        document.getElementById("pword").focus();
        return false;
    }
    if (password.match(password2) == null){
        window.alert("the password and confirm password inputs should be the same.");
        document.getElementById("pword2").focus();
        return false;
    }
    
    window.alert("The form was submitted");
    return true;
}