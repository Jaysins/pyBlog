// Elements References
const toggler = document.querySelector('.menu-toggler');
const menu = document.querySelector('.full-page-menu');
const fileInputs = document.querySelectorAll('.file-input');

// Functions
function toggleMenu() {
    if (menu.classList.contains('show')) {
        this.classList.remove('open')
        menu.classList.add('animate-out');
    } else {
        this.classList.add('open')
        menu.classList.add('show');
        menu.classList.add('animate-in');
    }
}

function animationEnded(e) {
    if (e.animationName === 'scale-out') {
        this.classList.remove('show');
        this.classList.remove('animate-in');
        this.classList.remove('animate-out');
    }
}

function escapeKeyClose(e) {
    if (e.keyCode === 27 && menu.classList.contains('show')) {
        menu.classList.add('animate-out');
        toggler.classList.remove('open');
    }
}

// Event Listeners
toggler.addEventListener('click', toggleMenu)
menu.addEventListener('animationend', animationEnded)
window.addEventListener('keyup', escapeKeyClose)

$('document').ready(function () {
    var username_state = false;
    var email_state = false;
    var password_state = false;
    var r_password_state = false;
    var error = document.getElementById("error");
    var message = document.getElementById('message');
    var userInput = document.getElementById('username');
    var passInput = document.getElementById('password');
    var emailInput = document.getElementById('email');
    var r_passInput = document.getElementById('r_password');


    $('#username').on('blur', function () {
        error.className = 'error';
        var username = $('#username').val();
        var email = $('#email').val();
        if (username === '') {
            username_state = false;
            return;
        }

        else if (username.length <= 5) {
            username_state = false;
            error.className += ' show';
            userInput.className = 'input-error';
            message.innerText = 'Username too short';
            return;
        }
        $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/check_sign', {
                username: username,
                email: email
            },
            function (data) {
                if (data.name === 'taken') {
                    username_state = false;
                    error.className += ' show';
                    userInput.className = 'input-error';
                    message.innerText = 'Sorry... Username already taken';
                }
                else if (data.name === 'not_taken') {
                    username_state = true;
                    error.className = 'error';
                    message.innerText = '';
                    userInput.className = '';
                }
            }
        )
    });
    $('#email').on('blur', function () {
        error.className = 'error';
        var username = $('#username').val();
        var email = $('#email').val();
        if (email === '') {
            email_state = false;
            return;
        }

        $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/check_sign', {
                username: username,
                email: email,
            },
            function (data) {
                if (data.mail === 'taken') {
                    email_state = false;
                    error.className += ' show';
                    emailInput.className = 'input-error';
                    message.innerText = 'Sorry... Email already taken';
                }
                else if (data.mail === 'not_taken') {
                    email_state = true;
                    error.className = 'error';
                    emailInput.className = '';
                    message.innerText = '';
                }
            }
        )
    });
    $('#password').on('blur', function () {
        error.className = 'error';
        var password = $('#password').val();
        if (password === '' || password === ' ') {
            passInput.className = 'input-error';
            return
        }
        if (password.length <= 5) {
            password_state = false;
            error.className += ' show';
            passInput.className = 'input-error';
            message.innerText = 'password too short';
        }
        else {
            password_state = true;
            error.className = 'error';
            passInput.className = '';
            message.innerText = '';
        }
    });
    $('#r_password').on('blur', function () {
        error.className = 'error';
        var password = $('#password').val();
        var r_password = $('#r_password').val();
        if (password === '' && r_password === '') {
            r_password_state = false
        }
        else if (password !== r_password) {
            r_password_state = false;
            error.className += ' show';
            r_passInput.className = 'input-error';
            message.innerText = 'password dont match';
        }
        else {
            r_password_state = true;
            error.className = 'error';
            r_passInput.className = '';
            message.innerText = ''
        }
    });
    $('#register_form').on('submit', function () {
        var returning = false;

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var r_password = $('#r_password').val();
        if (username === '' || email === '' || password === '' || r_password === '') {
            $('#error_msg').text('Fill form first');
            returning = false;
        }
        else if (username_state === false) {
            error.className += ' show';
            message.innerText = 'Username error';
            returning = false;
        }
        else if (email_state === false){
            error.className += ' show';
            message.innerText = 'email error';
            returning = false;
        }
        else if(password_state === false){
            error.className += ' show';
            message.innerText = 'password error';
            returning = false;
        }
        else if(r_password_state === false){
            error.className += ' show';
            message.innerText = 'password dont match';
            returning = false;
        }
        else {
            returning = true;
        }
        return returning
    });
});
