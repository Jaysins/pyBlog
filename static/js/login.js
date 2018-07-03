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
    let username_state = false;
    let password_state = false;
    let error = document.getElementById("error");
    let message = document.getElementById('message');
    let userInput = document.getElementById('username');
    let passInput = document.getElementById('password');

    $('#username').on('blur', function () {
        error.className = 'error';
        let username = $('#username').val();
        let password = $('#password').val();


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
        $.getJSON(window.location.protocol + '//' + document.domain + ':' + location.port + '/check_log', {
                username: username, password: password
            },
            function (data) {
                if (data.response === 'U not legit') {
                    username_state = false;
                    password_state = false;
                    error.className += ' show';
                    message.innerText = 'Username does not exist';
                    passInput.className = 'input-error'
                }
                else {
                    username_state = true;
                    userInput.className = '';
                    error.className = 'error'

                }
            }
        )
    });

    $('#password').on('blur', function () {
        error.className = 'error';
        let username = $('#username').val();
        let password = $('#password').val();

        if (password === '' || password === ' ') {
            passInput.className = 'input-error'

        }
        else if (password.length <= 5) {
            password_state = false;
            passInput.className = 'input-error';
            error.className += ' show';
            message.innerText = 'password too short';
        }
        else {
            $.getJSON(window.location.protocol + '//' + document.domain + ':' + location.port + '/check_log', {
                    username: username, password: password
                },
                function (data) {
                    if (data.response === 'P not legit') {
                        password_state = false;
                        passInput.className = 'input-error';
                        error.className += ' show';
                        message.innerText = 'password incorrect';
                        return;
                    }
                    else if (data.response === 'U not legit') {
                        password_state = false;
                        return;
                    }
                    password_state = true;
                    passInput.className = '';
                    error.className = 'error'
                }
            )
        }
    });

    $('#register_form').on('submit', function () {
        let returning = false;

        let username = $('#username').val();
        let password = $('#password').val();


        if (username === '' || password === '') {
            error.className += ' show';
            message.innerText = 'fill the form first';
            returning = false;
        }
        else if (username_state === false || password_state === false) {
            error.className += ' show';
            message.innerText = 'fix all errors in the form first';
            returning = false;
        }
        else {
            let span = document.getElementById('load');
            span.className = 'loading';
            span.innerText = '';
            returning = true;

        }
        return returning
    });

});

