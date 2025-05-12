from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Post, Comment
from datetime import datetime

api = Blueprint("api", __name__)


@api.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username exists"}), 400
    user = User(username=username, password=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Registered successfully"}), 201


@api.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Logged in", "username": user.username}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@api.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200


@api.route("/api/posts", methods=["GET", "POST"])
def posts():
    if request.method == "POST":
        if not current_user.is_authenticated:
            return jsonify({"error": "Login required"}), 401
        data = request.get_json()
        title = data.get("title")
        content = data.get("content")
        if not title or not content:
            return jsonify({"error": "Title and content are required"}), 400
        post = Post(title=title, content=content, user_id=current_user.id)
        db.session.add(post)
        db.session.commit()
        return jsonify({"message": "Post created"}), 201
    page = request.args.get("page", 1, type=int)
    per_page = 5
    posts = Post.query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=per_page
    )
    return jsonify(
        {
            "posts": [
                {
                    "id": p.id,
                    "title": p.title,
                    "content": p.content,
                    "author": p.author.username,
                    "created_at": p.created_at.isoformat(),
                }
                for p in posts.items
            ],
            "total": posts.total,
            "pages": posts.pages,
        }
    )


@api.route("/api/posts/<int:id>", methods=["GET", "PUT", "DELETE"])
@login_required
def post(id):
    post = Post.query.get_or_404(id)
    if post.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    if request.method == "PUT":
        data = request.get_json()
        title = data.get("title")
        content = data.get("content")
        if not title or not content:
            return jsonify({"error": "Title and content are required"}), 400
        post.title = title
        post.content = content
        db.session.commit()
        return jsonify({"message": "Post updated"})
    elif request.method == "DELETE":
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Post deleted"})
    return jsonify(
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author": post.author.username,
        }
    )


@api.route("/api/posts/<int:post_id>/comments", methods=["GET", "POST"])
@login_required
def comments(post_id):
    if request.method == "POST":
        data = request.get_json()
        content = data.get("content")
        if not content:
            return jsonify({"error": "Comment content is required"}), 400
        comment = Comment(content=content, user_id=current_user.id, post_id=post_id)
        db.session.add(comment)
        db.session.commit()
        return jsonify({"message": "Comment added"}), 201
    comments = (
        Comment.query.filter_by(post_id=post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )
    return jsonify(
        [
            {
                "id": c.id,
                "content": c.content,
                "author": c.author.username,
                "created_at": c.created_at.isoformat(),
            }
            for c in comments
        ]
    )
