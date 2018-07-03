var client = new ClientJS(); // Create A New Client Object

var fingerprint = client.getFingerprint();
var post_id = '';
let comments = [];
// const button = document.getElementById('comment-btn'),
output = document.querySelector('.comment-out'),
    nameInput = document.getElementById('name'),
    emailInput = document.getElementById('email'),
    input = document.getElementById('comment-input')
var form = document.getElementById('contactForm');
form.onsubmit = function () {
    debugger
    comments.push({
        name: nameInput.value,
        message: input.value,
        email: emailInput.value,
        time: `${new Date().getDate()} ${new Date().getMonth() + 1} ${new Date().getFullYear()}`
    });
    getComments(nameInput.value, input.value, emailInput.value);
    return false;
};

function getComments(name, msg, email) {
    post_id = document.getElementById('post_id').value;

    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/get_comm', {
        name: name, message: msg, email: email, post_id: post_id, fingerprint: fingerprint

    }, function (data) {
        updateOutput(data.name, data.time, data.id);
    });
    nameInput.value = '';
    emailInput.value = '';
    input.value = ''
    $('#comments').hide();
    return false
}


function updateOutput(name, time, id) {
    comments.reverse();
    var get_head = document.getElementById('comment_head');
    get_head.textContent = 'Comments';
    const commentsTemplate = comments.map(comment => {
        return (
            `
                <div class="post-preview">
                    <h3 class="post-title">
                        ${name}
                    </h3>
                    <h4 class="post-subtitle">
                        ${comment.message}
                    </h4>
                    <p class="post-meta">Posted on
                        ${time}
                    </p>
                    <div class="container">
                        <button class="like-btn">
                            <span id="sums${id}"></span>
                            <i id="like_comment_button ${id}" class="fa fa-thumbs-up" aria-hidden="true"></i>
                        </button>
                        <button class="like-btn" id="reply_button${id}">
                            <i class="fa fa-comments" aria-hidden="true"></i>
                        </button>
                        <button class="like-btn" id="view_all${id}">
                            <i class="fa fa-comments" aria-hidden="true" id="rep_len${id}" ></i>
                        </button>
                    </div>

                    <div class="container">
                        <div class="reply" id="reply${id}" style="display: none;">
                    <div class="">
                    <form action="#" name="sendMessage" id="replyForm${id}" method="post">
                    <div class="control-group">
                    <div class="form-group col-xs-12 floating-label-form-group controls">
                    <label>Name</label>
                    <input autocomplete="name" type="text" class="form-control"
                    placeholder="Name" name="name"
                    id="reply-name${id}" required
                    data-validation-required-message="Please enter your name.">
                    <p class="help-block text-danger"></p>
                    </div>
                    </div>
                    <div class="control-group">
                    <div class="form-group col-xs-12 floating-label-form-group controls">
                    <label>Email</label>
                    <input autocomplete="email" type="email" class="form-control"
                    placeholder="Email"
                    name="email" id="reply-email${id}"
                    required
                    data-validation-required-message="Please enter your email address.">
                    </div>
                    </div>
                    <div class="control-group">
                    <div class="form-group floating-label-form-group controls">
                    <div class="comment-wrap">
                    <div class="comment-in">
                    <div class="input-wrap">
                    <textarea name="comment-input" id="reply-input${id}"
                    placeholder="Post a comment" required></textarea>
                    </div>
                    <div class="btn-wrap">
                    <button class="btn" id="reply-btn${id}">Post</button>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    <br>
                    </form>
                    </div>
                    <!--</div>-->
                    </div>
                    </div>
                    <div class="reply" id="replies${id}" style="display: none;">
                    <div class="post-heading">
                    <h2 class="post-title" style="text-align:center;" id="reply_head${id}">
                    No Replies
                    </h2>
                    </div>
                    <div class="container">
                    <div class="row">
                    <div class="col-lg-12 col-md-12" id="show_reply${id}">
                    <div id="reply-out${id}"></div>
                    </div>
                    </div>
                    </div>
                    </div>
                    <div class="clearfix">
                    </div>
                    </div>
                    `
        )
    });
    output.innerHTML = '';
    commentsTemplate.forEach(comment => {
        output.innerHTML += comment;
    })
    return false;

}
