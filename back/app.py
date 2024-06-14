# backend/app.py
from flask import Flask, request, jsonify
from models import db, User, Wheel

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "User already exists", "user_id": existing_user.id}), 400

    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added", "user_id": new_user.id}), 201

@app.route('/users/<int:user_id>/wheel', methods=['POST'])
def save_wheel(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    wheel = Wheel.query.filter_by(user_id=user.id).first()
    if wheel:
        wheel.items = data['items']
    else:
        wheel = Wheel(user_id=user.id, items=data['items'])
        db.session.add(wheel)
    db.session.commit()
    return jsonify({"message": "Wheel saved"}), 201

@app.route('/users/<int:user_id>/wheel', methods=['GET'])
def get_wheel(user_id):
    user = User.query.get_or_404(user_id)
    wheel = Wheel.query.filter_by(user_id=user.id).first()
    if wheel:
        return jsonify({"items": wheel.items}), 200
    else:
        return jsonify({"message": "No wheel found"}), 404

@app.route('/users', methods=['GET'])
def get_user():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"user_id": user.id}), 200
    else:
        return jsonify({"message": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
