let comments = [];
// const button = document.getElementById('comment-btn'),
var output = document.querySelector('.comment-out'),
    nameInput = document.getElementById('name'),
    emailInput = document.getElementById('email'),
    input = document.getElementById('comment-input');



// button.addEventListener('submit', handleClick);

// window.addEventListener('load', getComments)

// function handleClick() {
// if (input.value === ''  || input.value === ' '){

// alert('Please enter your comment');

// };

// if(!document.getElementById("email").checkValidity()){
//     x = document.getElementById('email');
//     x.focus();

// }

// comments.push({
// name: nameInput.value,
// message: input.value,
// email: emailInput.value,
// time: `${new Date().getDate()} ${new Date().getMonth() + 1} ${new Date().getFullYear()}`
// });
// updateOutput();
// return false;
// }

var form = document.getElementById('contactForm');
form.onsubmit = function () {
    comments.push({
        name: nameInput.value,
        message: input.value,
        email: emailInput.value,
        time: `${new Date().getDate()} ${new Date().getMonth() + 1} ${new Date().getFullYear()}`
    });
    getComments(nameInput.value, input.value, emailInput.value);
    return false;
}


function getComments(name, msg, email) {
    req = $.ajax({
        url: '/get_comm',
        type: 'POST',
        data: {name: name, message: msg, email: email}
    });
    updateOutput();
    nameInput.value = '';
    emailInput.value = '';
    input.value = ''
    $('#comments').hide();
    return false
}


function updateOutput() {
    comments.reverse();
    var url = '/get_comm'
    $.getJSON(url, function (data) {
        const commentsTemplate = comments.map(comment = > {
            return(
            `
                <div class="post-preview">
                <h3 class="post-title">
                ${data.name}
                </h3>
                <h4 class="post-subtitle">
                ${comment.message}
                </h4>
                <p class="post-meta">Posted on
                ${data.time}
                </p>
                <div class="container">
                <button class="like-btn">
                <span id="sums${data.id}"></span>
                <i id="like_comment_button ${data.id}"class="fa fa-thumbs-up" aria-hidden="true"></i>
                </button>
                </div>
                </div>
                <br>
                <hr>
                `
    )
        return false
    })
        output.innerHTML = '';
        commentsTemplate.forEach(comment = > {
            output.innerHTML += comment;
    })

        return false
    });

    return false;

}

