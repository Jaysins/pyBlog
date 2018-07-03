# coding=utf-8

"""
Blog
"""

from flask_uploads import UploadSet, configure_uploads, IMAGES, UploadNotAllowed
from flask import Flask, render_template, redirect, url_for, flash, request, session, jsonify, send_file
from flask_bootstrap import Bootstrap
from flask_mail import Mail, Message
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
from wtforms.validators import InputRequired, Length, Email
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, logout_user, login_required, login_user, current_user
from datetime import datetime
import os

app = Flask(__name__)
# file_path = os.path.abspath(os.getcwd()) + "\database.db"
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + file_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
photos = UploadSet('photos', IMAGES)
app.config['UPLOADED_PHOTOS_DEST'] = 'static/img'
configure_uploads(app, photos)
Bootstrap(app)
db = SQLAlchemy(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'jaysinscars@gmail.com'
app.config['MAIL_PASSWORD'] = 'hadiyyah'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

app.config['SECRET_KEY'] = 'secret!'
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin, db.Model):
    """
    creating User table
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(115), unique=True)
    email = db.Column(db.String(115), unique=True)
    password = db.Column(db.String(80))

    posts = db.relationship('BlogPost', backref='user', lazy='dynamic')
    about = db.relationship('About', backref='user', lazy='dynamic')


class About(db.Model):
    """
    abour
    """
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(120))
    content = db.Column(db.Text)
    social = db.Column(db.String(120))
    picture = db.Column(db.String(120))
    email = db.Column(db.String(50), unique=True)
    user_id = db.Column(db.String(115), db.ForeignKey('user.username'))


class BlogPost(db.Model):
    """
    blogpost
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    subtitle = db.Column(db.String(120))
    author = db.Column(db.String(120))
    date_posted = db.Column(db.DateTime)
    content = db.Column(db.Text)
    user_id = db.Column(db.String(120), db.ForeignKey('user.username'))

    comment = db.relationship('Comment', backref='blog_post', lazy='dynamic')

    like = db.relationship('Likes', backref='blog_post', lazy='dynamic')


class Comment(db.Model):
    """
    comment
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False)
    email = db.Column(db.String(120), unique=False)
    comment = db.Column(db.String(150), unique=False)
    date_posted = db.Column(db.DateTime, unique=False)
    fingerprint = db.Column(db.String(25))

    like = db.relationship('LikeComment', backref='comment', lazy='dynamic')
    reply = db.relationship('Reply', backref='comment', lazy='dynamic')
    BlogPost_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'))


class Reply(db.Model):
    """
    reply
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False)
    email = db.Column(db.String(120), unique=False)
    reply = db.Column(db.String(150), unique=False)
    date_posted = db.Column(db.DateTime, unique=False)
    fingerprint = db.Column(db.String(25))
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'))
    # like = db.relationship('LikeReply', backref='reply', lazy='dynamic')


class LikeReply(db.Model):
    """
    like comment database
    """
    id = db.Column(db.Integer, primary_key=True)
    fingerprint = db.Column(db.String(25))
    like = db.Column(db.Integer)
    reply_id = db.Column(db.Integer, db.ForeignKey('reply.id'))


class Likes(db.Model):
    """
    likes
    """
    id = db.Column(db.Integer, primary_key=True)
    fingerprint = db.Column(db.String(25))
    like = db.Column(db.Integer)
    BlogPost_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'))


class LikeComment(db.Model):
    """
    like comment database
    """
    id = db.Column(db.Integer, primary_key=True)
    fingerprint = db.Column(db.String(25))
    like = db.Column(db.Integer)
    Comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class RegisterForm(FlaskForm):
    """
    Register
    """
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    email = StringField('Email', validators=[InputRequired(), Email(message='invalid email'), Length(max=50)])
    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='password DONT match')
    ])
    confirm = PasswordField('Repeat Password')


class LoginForm(FlaskForm):
    """
    LoginForm
    """
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])


def checking():
    """

    :return:
    """
    try:
        user = current_user.username
    except AttributeError:
        user = 'user'
    return user


@app.route('/')
def index():
    """

    :return:
    """
    posts = BlogPost.query.order_by(BlogPost.date_posted.desc()).limit(5).all()
    check = BlogPost.query.all()
    if len(check) == 0:
        check_older = 'No Posts Here'
    elif len(check) > 5:
        check_older = 'Older Posts'
    else:
        check_older = ''
    user = checking()
    return render_template('index.html', posts=posts, older=check_older, user=user)


# @app.route('/profile')
# @login_required
# def profile():
#     """
#
#     :return:
#     """
#     pour = About.query.filter_by(author=current_user.username).first()
#     user = checking()
#     return render_template('profile.html', pour=pour, user_id=current_user.username, user=user)


@app.route('/admin')
@login_required
def admin():
    """

    :return:
    """
    get_user_id = User.query.filter_by(username=current_user.username).first()
    user_id = get_user_id.username
    posts = BlogPost.query.filter_by(user_id=user_id).order_by(BlogPost.date_posted.desc()).all()
    user = checking()
    return render_template('admin.html', user_id=user_id, posts=posts, user=user)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """

    :return:
    """
    form = RegisterForm(request.form)
    error = ''
    if request.method == 'POST' and form.validate():
        username = form.username.data.title()
        email = form.email.data.capitalize()
        password = form.password.data
        check = User.query.filter((User.username == username) | (User.email == email)).first()
        if check:
            error = 'username or email already taken'
        else:
            hashed_password = generate_password_hash(password, method='sha256')
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            force_add = About(user_id=username, author=username, content='nothing yet',
                              social='jaysins.scars', picture='about-bg.jpg', email=email)
            db.session.add(force_add)
            db.session.commit()
            return redirect(url_for('login'))
    return render_template('signup.html', form=form, error=error)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    login form
    :return:
    """
    form = LoginForm(request.form)
    form.validate()
    print(form.errors)
    if request.method == 'POST' and form.validate():
        username = form.username.data.capitalize()
        password = form.password.data
        admin_user = User.query.filter_by(username=username).first()
        if admin_user:
            if check_password_hash(admin_user.password, password):
                login_user(admin_user)
                return redirect(url_for('admin'))
        return redirect(url_for('login'))
    return render_template('login.html', form=form)


@app.route('/contact/<user_id>')
def contact(user_id):
    """

    :param user_id:
    :return:
    """
    try:
        abouts = About.query.filter_by(user_id=user_id).first()
        reach = abouts.social
        user = checking()
        return render_template('contact.html', user_id=user_id, reach=reach, user=user)
    except AttributeError:
        # :TODO error message
        return jsonify({'error': 'use'})


@app.route('/about/<user_id>')
def about(user_id):
    """

    :param user_id:
    :return:
    """
    try:
        abouts = About.query.filter_by(user_id=user_id).first()
        reach = abouts.social
        image = abouts.picture
        user = checking()
        return render_template('about.html', about=abouts, user_id=user_id, reach=reach, image=image, user=user)
    except AttributeError:
        # :TODO error message
        return jsonify({'error': 'use'})


@app.route('/sendMessage/<user_id>', methods=['POST'])
def sendMessage(user_id):
    """

    :param user_id:
    :return:
    """
    try:
        name = request.form['name']
        mesage = request.form['message']
        email = request.form['email']
        phone = request.form['phone']

        get_user = About.query.filter_by(user_id=user_id).first()
        if get_user.email == '':
            flash('Author wishes to remain anonymous')
            return redirect(url_for('contact'))
        else:

            msg = Message('Blog Contact', sender='jaysinscars@gmail.com', recipients=[get_user.email])
            msg.html = "<p><b> hi, my name is </b></p> <br>" + name + "<p><b> my message </b></p><br>" + mesage + \
                       "<p><b> phone number </b></p> <br> " + phone + "<p><b> and my email address</b></p>" + email
            mail.send(msg)
            flash(' message sent ')
            return redirect(url_for('contact', user_id=user_id))
    except Exception as e:
        print(e)
        # :TODO error message
        return jsonify({'error': 'use'})


@app.route('/add')
@login_required
def add():
    try:
        get_user_id = User.query.filter_by(username=current_user.username).first()
        user_id = get_user_id.username
        user = checking()
        return render_template('add.html', user_id=user_id, user=user)
    except AttributeError:
        # :TODO error message
        return jsonify({'error': 'use'})


@app.route('/post/<int:post_id>')
def post(post_id):
    """

    :param post_id:
    :return:
    """
    try:
        posts = BlogPost.query.filter_by(id=post_id).first()
        user_id = posts.user_id
        comments = Comment.query.filter_by(BlogPost_id=post_id).order_by(Comment.date_posted.desc())
        get_about = About.query.filter_by(user_id=user_id).first()
        reach = get_about.social
        x = comments.count()
        user = checking()
        if x > 0:
            no = ''
        else:
            no = 'No'
        return render_template('post.html', post=posts, user_id=user_id, comments=comments, no=no, reach=reach, user=user)
    except AttributeError:
        return 'oops'


@app.route('/olderPost')
def older():
    """

    :return:
    """
    posts = BlogPost.query.order_by(BlogPost.date_posted.desc()).all()
    user = checking()
    return render_template('older.html', posts=posts, user=user)


@app.route('/addPost', methods=['POST'])
@login_required
def addPost():
    """

    :return:
    """
    try:
        title = request.form['title']
        subtitle = request.form['subtitle']
        author = current_user.username
        content = request.form['content']
        user = User.query.filter_by(username=author).first()
    except AttributeError:
        # :TODO error message
        return jsonify({'error': 'error'})
    posts = BlogPost(title=title, subtitle=subtitle, author=author, content=content, date_posted=datetime.now(),
                     user_id=user.username)
    db.session.add(posts)
    db.session.commit()
    return redirect(url_for('admin'))


@app.route('/edit/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit(post_id):
    """

    :param post_id:
    :return:
    """
    if request.method == 'POST':
        try:
            get = BlogPost.query.filter_by(id=post_id).first()
            title = request.form['title']
            subtitle = request.form['subtitle']
            content = request.form['content']
            if get:
                get.title = title
                get.subtitle = subtitle
                get.content = content
                db.session.commit()
                return redirect(url_for('admin'))
            else:
                return jsonify({'error': 'Post doesnt exist, go back to home page and try again'})
        except Exception as e:
            print(e)
            return 'OOPS'
    check = BlogPost.query.filter_by(id=post_id).first()
    if check:
        if check.author != current_user.username:
            return jsonify({'error': 'not ur post'})
        else:
            title = check.title
            subtitle = check.subtitle
            content = check.content
            user = checking()
            return render_template('edit.html', title=title, subtitle=subtitle, content=content, post_id=post_id,
                                   user=user)
    else:
        return jsonify({'error': 'Post doesnt exist, go back to home page and try again'})


@app.route('/delete/<int:post_id>')
@login_required
def delete(post_id):
    """

    :param post_id:
    :return:
    """
    delete_post = BlogPost.query.filter_by(id=post_id).first()
    if delete_post:
        db.session.delete(delete_post)
        db.session.commit()
        return redirect(url_for('admin'))
    else:
        return 'oops'


@app.route('/add_about', methods=['GET', 'POST'])
def add_about():
    """

    :return:
    """
    if request.method == 'POST':
        try:
            author = current_user.username
            content = request.form['content']
            social = request.form['id']
            email = request.form['email']
            user = User.query.filter_by(username=author).first()
            if '.' in social or social == '':
                check = About.query.filter_by(user_id=user.username).first()
                if check:
                    check.social = social
                    db.session.commit()
                    if content == '':
                        pass
                    else:
                        check.content = content
                        db.session.commit()
                else:
                    addAbout = About(author=author, content=content, user_id=user.username, social=social, email=email)
                    db.session.add(addAbout)
                    db.session.commit()
                print(request.files)
                if 'photo' in request.files:
                    try:
                        get_user = About.query.filter_by(author=current_user.username).first()
                        if get_user.picture:
                            filename = photos.save(request.files['photo'])
                            get_user.picture = filename
                            db.session.commit()
                    except UploadNotAllowed:
                        pass
                return redirect(url_for('about', user_id=current_user.username))
            else:
                flash('your facebook name is not your id')
                flash('example: jaysins.scars')
                flash('please go to your facebook profile '
                      'and scroll down to find it')
                return redirect(url_for('profile', user_id=current_user.username))
        except Exception as e:
            return jsonify({'error': e})
    pour = About.query.filter_by(author=current_user.username).first()
    user = checking()
    return render_template('profile.html', pour=pour, user_id=current_user.username, user=user)


@app.route('/logout')
@login_required
def logout():
    """

    :return:
    """

    logout_user()
    return redirect(url_for('index'))


@app.route('/connect')
def connect():
    """

    :return:
    """
    try:
        fingerprint = request.args['fingerprint']
        post_id = request.args['post_id']
        rep_store = {}
        store = {}
        data = []
        comm_store = []
        pers = []
        i_like = []
        store_id = []
        comments = Comment.query.filter_by(BlogPost_id=post_id).order_by(Comment.date_posted.desc())
        comm_store.clear()
        for comm in comments:
            checked = Reply.query.filter_by(comment_id=comm.id).all()
            store_id.append([Reply.query.filter_by(comment_id=comm.id).count(), comm.id])
            if checked:
                for it in checked:
                    sum_reply = LikeReply.query.filter_by(reply_id=it.id).all()
                    check_reply = LikeReply.query.filter_by(reply_id=it.id, fingerprint=str(fingerprint)).first()
                    if check_reply:
                        i_like.append([it.id, check_reply.like])
                    comm_store.append([comm.id, it.id, it.name, it.date_posted, it.reply])
                    if sum_reply:
                        rep_store.clear()
                        for lick in sum_reply:
                            rep_store[lick.fingerprint] = lick.like
                            if lick.fingerprint == fingerprint:
                                liked = True
                                pers.append([it.id, liked])
                        sum_replies = sum(rep_store.values())
                        data.append([it.id, sum_replies])
                    else:
                        sum_replies = 0
                        data.append([it.id, sum_replies])
        check = Likes.query.filter_by(BlogPost_id=post_id, fingerprint=str(fingerprint)).first()
        sum_likes = Likes.query.filter_by(BlogPost_id=post_id).all()
        if sum_likes:
            store.clear()
            for likez in sum_likes:
                store[likez.fingerprint] = likez.like
            sum_likes = sum(store.values())
        else:
            sum_likes = 0
        print(i_like)
        if check:
            return jsonify(
                {'fingerprint': fingerprint, 'like': int(check.like), 'comm': comm_store, 'likes': sum_likes, 'datas': data,
                 'ilike': i_like, 'pers': pers, 'len_rep': store_id})
        else:
            return jsonify({'fingerprint': fingerprint, 'like': 0, 'comm': comm_store, 'likes': sum_likes, 'datas': data,
                            'ilike': i_like, 'pers': pers, 'len_rep': store_id})

    except AttributeError:
        print('rrrpe')
        return jsonify({'error': 234})


@app.route('/commconn')
def commconn():
    """

    :return:
    """
    try:
        store = {}
        like_comm = []
        comm_sum = []
        fingerprint = request.args['fingerprint']
        post_id = request.args['post_id']
        comments = Comment.query.filter_by(BlogPost_id=post_id).order_by(Comment.date_posted.desc())
        like_comm.clear()
        for comm in comments:
            checks = LikeComment.query.filter_by(Comment_id=comm.id, fingerprint=str(fingerprint)).all()
            if checks:
                for c in checks:
                    like_comm.append([int(fingerprint), c.like, c.Comment_id])
            sum_likes = LikeComment.query.filter_by(Comment_id=comm.id).all()
            if sum_likes:
                store.clear()
                for likez in sum_likes:
                    likez.fingerprint = str(likez.fingerprint)
                    likez.Comment_id = str(likez.Comment_id)
                    store[likez.fingerprint + likez.Comment_id] = likez.like

                sum_likes = sum(store.values())
            else:
                sum_likes = 0
            comm_sum.append([sum_likes, comm.id])
        return jsonify({'comm_sum': comm_sum, 'like_comm': like_comm})
    except AttributeError:
        return jsonify({'error': 303})


@app.route('/get_comm')
def get_comm():
    """

    :return:
    """
    try:
        name = request.args['name']
        comment = request.args['message']
        email = request.args['email']
        post_id = request.args['post_id']
        fingerprint = request.args['fingerprint']
        check = Comment.query.filter_by(email=email).first()
        checks = Comment.query.filter_by(fingerprint=str(fingerprint)).first()
        if check:
            posts = Comment(name=check.name, email=check.email, comment=comment, date_posted=datetime.now(),
                            BlogPost_id=post_id, fingerprint=str(fingerprint))
            db.session.add(posts)
            db.session.commit()
        elif checks:
            posts = Comment(name=checks.name, email=checks.email, comment=comment, date_posted=datetime.now(),
                            BlogPost_id=post_id, fingerprint=checks.fingerprint)
            db.session.add(posts)
            db.session.commit()

        else:
            posts = Comment(name=name, email=email, comment=comment, date_posted=datetime.now(),
                            BlogPost_id=post_id, fingerprint=str(fingerprint))
            db.session.add(posts)
            db.session.commit()

        return jsonify({'id': posts.id, 'name': posts.name, 'time': posts.date_posted})
    except AttributeError:
        return jsonify({'error': 203})


@app.route('/get_reply')
def get_reply():
    """

    :return:
    """
    try:
        name = request.args['name']
        comment = request.args['message']
        email = request.args['email']
        rep = request.args['rep']
        fingerprint = request.args['fingerprint']
    except AttributeError:
        return 'oops'
    check = Reply.query.filter_by(email=email).first()
    checks = Reply.query.filter_by(fingerprint=str(fingerprint)).first()
    if checks:
        posts = Reply(name=checks.name, email=checks.email, reply=comment, date_posted=datetime.now(),
                      comment_id=rep, fingerprint=checks.fingerprint)
        db.session.add(posts)
        db.session.commit()
    elif check:
        posts = Reply(name=check.name, email=check.email, reply=comment, date_posted=datetime.now(),
                      comment_id=rep, fingerprint=str(fingerprint))
        db.session.add(posts)
        db.session.commit()

    else:
        posts = Reply(name=name, email=email, reply=comment, date_posted=datetime.now(), comment_id=rep,
                      fingerprint=str(fingerprint))
        db.session.add(posts)
        db.session.commit()
    return jsonify({'id': posts.id, 'name': posts.name, 'time': posts.date_posted, 'message': posts.reply})


@app.route('/get_like')
def get_like():
    """

    :return:
    """
    store = {}
    data = request.args
    try:
        got_like = data['like']
        fingerprint = str(data['fingerprint'])
        post_id = int(data['post_id'])
    except Exception as e:
        print(e)
        return 'oops'
    check = Likes.query.filter_by(BlogPost_id=post_id, fingerprint=fingerprint).first()
    if check:
        if got_like == 0:
            db.session.delete(check)
            db.session.commit()
        else:
            check.like = got_like
            db.session.commit()
        if check.like == -1:
            db.session.delete(check)
            db.session.commit()
    else:
        add_like = Likes(fingerprint=fingerprint, like=got_like, BlogPost_id=post_id)
        db.session.add(add_like)
        db.session.commit()
    sum_likes = Likes.query.filter_by(BlogPost_id=post_id).all()

    if sum_likes:
        store.clear()
        for likez in sum_likes:
            store[likez.fingerprint] = likez.like
        sum_likes = sum(store.values())
    else:
        sum_likes = 0
    total = sum_likes
    print(store)
    return jsonify({'like': total, 'id': post_id})


@app.route('/get_likedComment')
def get_liked_comment():
    """

    :return:
    """
    try:
        store = {}
        data = request.args
        got_like = data['likes']
        fingerprint = data['fingerprint']
        comm_id = data['comm_id']
        check = LikeComment.query.filter_by(Comment_id=comm_id, fingerprint=str(fingerprint)).first()
        if check:
            if got_like == 0:
                db.session.delete(check)
                db.session.commit()
            else:
                check.like = got_like
                db.session.commit()
            if check.like == -1:
                db.session.delete(check)
                db.session.commit()
        else:
            add_like = LikeComment(fingerprint=str(fingerprint), like=got_like, Comment_id=comm_id)
            db.session.add(add_like)
            db.session.commit()
        sum_likes = LikeComment.query.filter_by(Comment_id=comm_id).all()

        if sum_likes:
            store.clear()
            for likez in sum_likes:
                likez.fingerprint = str(likez.fingerprint)
                likez.Comment_id = str(likez.Comment_id)
                store[likez.fingerprint + likez.Comment_id] = likez.like

            sum_likes = sum(store.values())
        else:
            sum_likes = 0

        global liked_comm
        liked_comm = sum_likes

        return jsonify({'comm': liked_comm})
    except AttributeError:
        return jsonify({'error': 303})


@app.route('/get_likedReply')
def get_liked_reply():
    """

    :return:
    """
    try:
        store = {}
        data = request.args
        got_like = data['likes']
        got_fing = data['fingerprint']
        rep = data['rep_id']
        check = LikeReply.query.filter_by(reply_id=rep, fingerprint=str(got_fing)).first()
        if check:
            if got_like == 0:
                db.session.delete(check)
                db.session.commit()
            else:
                check.like = got_like
                db.session.commit()
            if check.like == -1:
                db.session.delete(check)
                db.session.commit()
        else:
            print('not in database')
            print(got_like)
            print(rep)
            add_like = LikeReply(fingerprint=str(got_fing), like=got_like, reply_id=rep)
            db.session.add(add_like)
            db.session.commit()
        sum_likes = LikeReply.query.filter_by(reply_id=rep).all()
        print(sum_likes)
        if sum_likes:
            print(store)
            store.clear()
            for likez in sum_likes:
                store[str(likez.fingerprint) + str(likez.reply_id)] = likez.like
            print('sum_checkI', store)
            sum_likes = sum(store.values())
            print('sum = I', sum_likes)
        else:
            sum_likes = 0
        return jsonify({'likes': sum_likes})
    except AttributeError:
        return jsonify({'error': 303})


@app.route('/check_log')
def check_log():
    """

    :return:
    """

    username = str(request.args.get('username', 0, type=str))
    password = str(request.args.get('password', 0, type=str))
    check = User.query.filter((User.username == username.title())).first()
    if check:
        if check_password_hash(check.password, password):
            error = 'P legit'
        else:
            error = 'P not legit'
    else:
        error = 'U not legit'
    return jsonify({'response': error})


@app.route('/check_sign')
def check_sign():
    """

    :return:
    """
    username = str(request.args.get('username', 0, type=str))
    email = str(request.args.get('email', 0, type=str))

    check_u = User.query.filter((User.username == username.title())).first()
    check_e = User.query.filter((User.email == email.capitalize())).first()
    if check_u:
        name = 'taken'
    else:
        name = 'not_taken'

    if check_e:
        e_mail = 'taken'
    else:
        e_mail = 'not_taken'

    return jsonify({'name': name, 'mail': e_mail})


if __name__ == '__main__':
    # app.run(host='192.168.137.18', port=8080, debug=True)
    # app.run(host='172.20.10.6', debug=True)
    app.run(debug=True)
