# backend/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    wheels = db.relationship('Wheel', backref='user', lazy=True)

class Wheel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    items = db.Column(db.PickleType, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

