from flask import Flask, request, jsonify
import pymysql
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, 
    get_jwt_identity, get_jwt
)
from flask_cors import CORS
from datetime import timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# MySQL Connection Setup
def get_db_connection():
    return pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='wesign_db',
        port=3307,  # or change to the real port MySQL is using
        cursorclass=pymysql.cursors.DictCursor
    )


# ========== DECORATORS ==========

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ========== AUTH ROUTES ==========

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')

        if not all([full_name, email, password]):
            return jsonify({"error": "All fields required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({"error": "Email already registered"}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute(
            "INSERT INTO users (full_name, email, password_hash, role) VALUES (%s, %s, %s, 'student')",
            (full_name, email, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO user_progress (user_id, completed_tutorials, quiz_scores, signs_learned) VALUES (%s, '[]', '[]', '[]')",
            (user_id,)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Registration successful", "userId": user_id}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Registration failed"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({"error": "Invalid credentials"}), 401

        if not user['is_active']:
            conn.close()
            return jsonify({"error": "Account deactivated"}), 403

        if not bcrypt.check_password_hash(user['password_hash'], password):
            conn.close()
            return jsonify({"error": "Invalid credentials"}), 401

        cursor.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (user['id'],))
        conn.commit()
        conn.close()

        additional_claims = {
            "role": user['role'],
            "email": user['email']
        }
        access_token = create_access_token(
            identity=user['id'],
            additional_claims=additional_claims
        )

        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user['id'],
                "fullName": user['full_name'],
                "email": user['email'],
                "role": user['role']
            }
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Login failed"}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, email, role, created_at, last_login FROM users WHERE id = %s",
            (user_id,)
        )
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user}), 200

    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({"error": "Failed to fetch profile"}), 500

# ========== ADMIN ROUTES ==========

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, email, role, created_at, last_login, is_active FROM users ORDER BY created_at DESC"
        )
        users = cursor.fetchall()
        conn.close()
        return jsonify({"users": users}), 200

    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500

@app.route('/api/admin/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(user_id):
    try:
        data = request.get_json()
        new_role = data.get('role')

        if new_role not in ['student', 'admin', 'instructor']:
            return jsonify({"error": "Invalid role"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Role updated successfully"}), 200

    except Exception as e:
        print(f"Update role error: {e}")
        return jsonify({"error": "Failed to update role"}), 500

# ========== HEALTH CHECK ==========

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "database": "MySQL",
        "app": "WeSign Auth Backend"
    }), 200

if __name__ == '__main__':
    print("✅ WeSign Auth Backend running on http://localhost:5001")
    print("📊 MySQL Database: wesign_db")
    app.run(host='0.0.0.0', port=5001, debug=True)
