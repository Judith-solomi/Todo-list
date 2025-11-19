from dataclasses import dataclass
from typing import Dict

@dataclass
class Todo:
    """Todo model representing a task"""
    id: str
    title: str
    completed: bool = False
    
    def to_dict(self) -> Dict:
        """Convert todo to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed
        }

# In-memory database (use SQLite/PostgreSQL in production)
todos_db: Dict[str, Todo] = {}

# Seed data for testing
def seed_data():
    """Add sample todos for development"""
    sample_todos = [
        Todo(id='1', title='Learn React', completed=False),
        Todo(id='2', title='Build Flask API', completed=True),
        Todo(id='3', title='Connect Frontend & Backend', completed=False)
    ]
    for todo in sample_todos:
        todos_db[todo.id] = todo

# Initialize with sample data
seed_data()
```

**backend/requirements.txt:**
```
Flask==3.0.0
flask-cors==4.0.0