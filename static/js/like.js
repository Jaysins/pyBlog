$('.reply').hide();

var client = new ClientJS(); // Create A New Client Object

var fingerprint = client.getFingerprint(); // Calculate Device/Browser Fingerprint
let like = 0
let replies = [];

var d = document.getElementById("likebutton");
let likeBtn = d;
var post_id = document.getElementById('post_id');
likeBtn.addEventListener('click', toggleLikeAnimation);

// req = $.ajax({
//     url : '/connect',
//     type : 'POST',
//     data : {fingerprint: fingerprint}
// });

$(document).ready(function () {
    var post_id = document.getElementById('post_id');
    $('#comments').hide();
    $('#comment-button').on('click', function () {
        $('#comments').toggle(300);
        $(window).on('beforeunload', function () {
            $('#comments').hide();
        });
    });

    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/connect', {
        fingerprint: fingerprint, post_id: post_id.value
    }, function (data) {
        if (data.like === 1) {
            document.getElementById("likebutton").className += " active";
        }

        if (data.comm.length >= 1) {
            for (var i = 0; i < data.comm.length; i++) {
                var get_head = document.getElementById('reply_head' + data.comm[i][0]);
                get_head.textContent = 'Replies';
                z = data.comm[i][3];
                var y = document.getElementById('show_reply' + data.comm[i][0]);
                if (y !== null) {
                    var b = document.createElement("div");
                    b.className = "post-preview";
                    var head = document.createElement("h3");
                    head.className = "post-title";
                    head.innerHTML = data.comm[i][2];
                    b.appendChild(head);
                    var sub = document.createElement("h4");
                    sub.className = "post-subtitle";
                    sub.innerHTML = data.comm[i][4];
                    b.appendChild(sub);
                    var day = document.createElement("p");
                    day.className = "post-meta";
                    day.innerHTML = 'posted on ' + data.comm[i][3];
                    b.appendChild(day);
                    var cont = document.createElement("div");
                    // cont.className = "container"
                    var butt = document.createElement("button");
                    butt.className = "like-btn";
                    butt.id = 'like_rep_button' + data.comm[i][1]
                    var span = document.createElement("span")
                    span.id = "sumd" + data.comm[i][1]
                    butt.appendChild(span)
                    var thumbs = document.createElement("i");
                    thumbs.className = "fa fa-thumbs-up";
                    thumbs.id = 'like_reply' + data.comm[i][1];
                    butt.appendChild(thumbs);
                    cont.appendChild(butt);
                    b.appendChild(cont);
                    y.appendChild(b);
                }
            }

        }
        if (data.len_rep.length >= 1) {
            for (i = 0; i < data.len_rep.length; i++) {
                var get_store = document.getElementById('rep_len' + data.len_rep[i][1]);
                get_store.innerText = data.len_rep[i][0];
            }
        }
        if (data.pers.length < 1) {
        }
        else if (data.pers.length === 1) {
            for (v = 0; v < data.pers.length; v++) {
                for (i = 0; i < data.pers[v].length - 1; i++) {
                    if (data.pers[i][1] === true) {
                        y = document.getElementById('like_rep_button' + data.pers[i][0])
                        y.className += ' active'
                    }
                }
            }
        }
        else {
            for (v = 0; v < data.pers.length; v++) {
                for (i = 0; i < data.pers[v].length; i++) {
                    if (data.pers[i][1] === true) {
                        y = document.getElementById('like_rep_button' + data.pers[i][0])
                        y.className += ' active'
                    }
                }
            }
        }


        if (data.likes === 0) {
            document.getElementById('sum').innerHTML = ''
        }
        else {
            document.getElementById('sum').innerHTML = data.likes
        }

        if (data.datas.length >= 1) {
            for (v = 0; v < data.datas.length; v++) {
                if (data.datas[v][1] > 0) {
                    document.getElementById('sumd' + data.datas[v][0]).innerHTML = data.datas[v][1]
                }
            }
        }


        if (data.ilike.length >= 1) {
            for (j = 0; j < data.ilike.length; j++) {
                if (data.ilike[j][1] > 0) {
                    document.getElementById('like_reply' + data.ilike[j][0]).parentElement.className += " active"
                }
            }
        }
        if (data.pers.length < 1) {
        }
        else if (data.pers.length === 1) {
            for (var v = 0; v < data.pers.length; v++) {
                for (i = 0; i < data.pers[v].length - 1; i++) {
                    if (data.pers[i][1] === true) {
                        y = document.getElementById('like_rep_button' + data.pers[i][0])
                        y.className += ' active'
                    }
                }
            }
        }
        else {
            for (v = 0; v < data.pers.length; v++) {
                for (i = 0; i < data.pers[v].length; i++) {
                    if (data.pers[i][1] === true) {
                        y = document.getElementById('like_rep_button' + data.pers[i][0])
                        y.className += ' active'
                    }
                }
            }
        }


        if (data.likes === 0) {
            document.getElementById('sum').innerHTML = ''
        }
        else {
            document.getElementById('sum').innerHTML = data.likes
        }

        if (data.datas.length >= 1) {
            for (v = 0; v < data.datas.length; v++) {
                if (data.datas[v][1] > 0) {
                    document.getElementById('sumd' + data.datas[v][0]).innerHTML = data.datas[v][1]
                }
            }
        }


        if (data.ilike.length >= 1) {
            for (j = 0; j < data.ilike.length; j++) {
                if (data.ilike[j][1] > 0) {
                    document.getElementById('like_reply' + data.ilike[j][0]).parentElement.className += " active"
                }
            }
        }
    });


    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/commconn', {
        fingerprint: fingerprint, post_id: post_id.value

    }, function (data) {
        if (data.comm_sum) {
            for (var i = 0; i < data.comm_sum.length; i++) {
                if (data.comm_sum[i][0] === 0) {
                    document.getElementById('sums' + data.comm_sum[i][1]).innerHTML = ''
                } else {
                    document.getElementById('sums' + data.comm_sum[i][1]).innerHTML = data.comm_sum[i][0]
                }
            }
        }

        if (data.like_comm) {
            for (i = 0; i < data.like_comm.length; i++) {
                if (data.like_comm[i][0] === fingerprint) {
                    if (data.like_comm[i][1] === 1) {
                        document.getElementById("like_comment_button " + data.like_comm[i][2]).parentElement.className += " active"
                    }
                }

            }

        }
        loading_screen.finish();
    });
});


function toggleLikeAnimation() {
    post_id = document.getElementById('post_id');
    if (d.classList.contains('active')) {
        d.classList.remove('active');
        like = like - 1;
        if (like === -1) {
            like = 0
        }
    }
    else {
        d.classList.add('active');
        if (like === -1) {
            like = 0
        }
        like = like + 1;
    }
    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/get_like', {
        like: like, fingerprint: fingerprint, post_id: post_id.value
    }, function (data) {
        if (data.like === 0) {
            document.getElementById('sum').innerHTML = ''
        }
        else {
            document.getElementById('sum').innerHTML = data.like
        }
    })
}


function toggleLikeAnimations(s, comm_id) {
    let likes = 0;
    if (s.classList.contains('active')) {
        s.classList.remove('active');
        likes = likes - 1;
        if (likes === -1) {
            likes = 0
        }
    }
    else {
        s.classList.add('active');
        if (likes === -1) {
            likes = 0
        }
        likes = likes + 1;
    }

    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/get_likedComment', {
        likes: likes, fingerprint: fingerprint, comm_id: comm_id
    }, function (data) {
        if (data.comm === 0) {
            document.getElementById('sums' + comm_id).innerHTML = ''
        } else {
            document.getElementById('sums' + comm_id).innerHTML = data.comm
        }
    })
}

function toggleLikeAnimationd(s, rep_id) {
    let likes = 0;
    if (s.classList.contains('active')) {
        s.classList.remove('active');
        likes = likes - 1;
        if (likes === -1) {
            likes = 0
        }
    }
    else {
        s.classList.add('active');
        if (likes === -1) {
            likes = 0
        }
        likes = likes + 1;
    }
    $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/get_likedReply', {
        likes: likes, fingerprint: fingerprint, rep_id: rep_id
    }, function (data) {
        if (data.likes === 0) {
            document.getElementById('sumd' + rep_id).innerHTML = ''
        } else {
            document.getElementById('sumd' + rep_id).innerHTML = data.likes
        }

    });
}


$(document).click(function () {
    var text = $(event.target)[0].id;
    check = text.split(/\s+|\./).includes("like_comment_button");
    var checks = text.includes("reply_button");
    var views = text.includes("view_all");
    var like_reply = text.includes("like_reply");
    if (check === true) {
        var id = text.replace("like_comment_button ", "");
        var get = document.getElementById(text);
        toggleLikeAnimations(get.parentElement, id)
    }
    //
    else if (like_reply === true) {
        id = text.replace("like_reply", "");
        get = document.getElementById(text);
        toggleLikeAnimationd(get.parentElement, id);
    }

    else if (checks === true) {
        var rep = text.replace("reply_button", "");
        $('#reply' + rep).toggle(300);
        output = document.querySelector('.reply-out' + rep),
            nameInput = document.getElementById('reply-name' + rep),
            emailInput = document.getElementById('reply-email' + rep),
            input = document.getElementById('reply-input' + rep)
        var form = document.getElementById('replyForm' + rep);
        form.onsubmit = function () {
            replies.push({
                name: nameInput.value,
                message: input.value,
                email: emailInput.value,
            });
            getComments(nameInput.value, input.value, emailInput.value, rep);
            return false;
        }
    }
    else if (views === true) {
        var rep = text.replace("view_all", "");
        $('#replies' + rep).toggle(300);
    }
    else if ($(event.target)[0].parentElement !== undefined) {
        var rechecked = $(event.target)[0].parentElement.id
        var checked = rechecked.includes("reply_button");
        var viewed = rechecked.includes("view_all");
        if (checked === true) {
            var rep = rechecked.replace("reply_button", "");
            $('#reply' + rep).toggle(300);
            output = document.querySelector('.reply-out' + rep),
                nameInput = document.getElementById('reply-name' + rep),
                emailInput = document.getElementById('reply-email' + rep),
                input = document.getElementById('reply-input' + rep)
            var form = document.getElementById('replyForm' + rep);
            form.onsubmit = function () {
                replies.push({
                    name: nameInput.value,
                    message: input.value,
                    email: emailInput.value,
                });
                getComments(nameInput.value, input.value, emailInput.value, rep);
                return false;
            }

        }
        else if (viewed === true) {
            var rep = rechecked.replace("view_all", "");
            $('#replies' + rep).toggle(300);
        }

        else if (like_reply === true) {
            get = document.getElementById(text);
            toggleLikeAnimationd(get.parentElement)
        }

    }

    function getComments(name, msg, email, rep) {
        $.getJSON(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/get_reply', {
            name: name, message: msg, email: email, fingerprint: fingerprint, rep: rep
        }, function (data) {
            updateOutput(data.name, data.time, data.id, data.message, rep);
        });
        nameInput.value = '';
        emailInput.value = '';
        input.value = '';
        $('#reply' + rep).hide();
        return false
    }


    function updateOutput(name, time, id, message, rep_id) {
        var get_head = document.getElementById('reply_head' + rep_id);
        get_head.textContent = 'Replies';
        var out = document.getElementById('reply-out' + rep_id);
        var b = document.createElement("div");
        b.className = "post-preview";
        var head = document.createElement("h3");
        head.className = "post-title";
        head.innerHTML = name;
        b.appendChild(head);
        var sub = document.createElement("h4");
        sub.className = "post-subtitle";
        sub.innerHTML = message;
        b.appendChild(sub);
        var day = document.createElement("p");
        day.className = "post-meta";
        day.innerHTML = 'posted on ' + time;
        b.appendChild(day);
        var cont = document.createElement("div");
        // cont.className = "container"
        var butt = document.createElement("button");
        butt.className = "like-btn";
        butt.id = 'like_rep_button' + id;
        var span = document.createElement("span");
        span.id = "sumd" + id;
        butt.appendChild(span);
        var thumbs = document.createElement("i");
        thumbs.className = "fa fa-thumbs-up";
        thumbs.id = 'like_reply' + id;
        butt.appendChild(thumbs);
        cont.appendChild(butt);
        b.appendChild(cont);
        if (out !== null) {
            out.insertBefore(b, out.childNodes[0]);
        }
        else {
            out.appendChild(b)
        }
        return false;
    }

});
