from flask import Flask, jsonify, request
from flask_cors import CORS
from models import Todo, todos_db
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Todo API is running'}), 200

# Get all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Retrieve all todos"""
    return jsonify([todo.to_dict() for todo in todos_db.values()]), 200

# Get single todo
@app.route('/api/todos/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    """Retrieve a specific todo by ID"""
    todo = todos_db.get(todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    return jsonify(todo.to_dict()), 200

# Create new todo
@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    if not data['title'].strip():
        return jsonify({'error': 'Title cannot be empty'}), 400
    
    todo_id = str(uuid.uuid4())
    todo = Todo(
        id=todo_id,
        title=data['title'].strip(),
        completed=data.get('completed', False)
    )
    
    todos_db[todo_id] = todo
    return jsonify(todo.to_dict()), 201

# Update todo
@app.route('/api/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Update an existing todo"""
    todo = todos_db.get(todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        if not data['title'].strip():
            return jsonify({'error': 'Title cannot be empty'}), 400
        todo.title = data['title'].strip()
    
    if 'completed' in data:
        todo.completed = bool(data['completed'])
    
    return jsonify(todo.to_dict()), 200

# Delete todo
@app.route('/api/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo"""
    if todo_id not in todos_db:
        return jsonify({'error': 'Todo not found'}), 404
    
    del todos_db[todo_id]
    return jsonify({'message': 'Todo deleted successfully'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting Todo API...")
    print("📍 Server running on http://localhost:5000")
    print("📋 API endpoints:")
    print("   GET    /api/todos       - Get all todos")
    print("   POST   /api/todos       - Create todo")
    print("   GET    /api/todos/:id   - Get single todo")
    print("   PUT    /api/todos/:id   - Update todo")
    print("   DELETE /api/todos/:id   - Delete todo")
    app.run(debug=True, port=5000)