import React, { useState, useEffect } from 'react';

// Simple SVG icons to replace react-feather
const Plus = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Trash2 = ({ size = 18 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const Check = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eff6ff 0%, #c7d2fe 100%)",
    padding: "2rem 1rem",
    fontFamily: "sans-serif"
  },
  card: {
    background: "#fff",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: "1.5rem",
    marginBottom: "1.5rem"
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "0.5rem"
  },
  headerDesc: {
    color: "#64748b"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginTop: "1rem"
  },
  statBox: (bg, color) => ({
    background: bg,
    borderRadius: "0.75rem",
    padding: "0.75rem",
    textAlign: "center"
  }),
  statNumber: color => ({
    fontSize: "1.5rem",
    fontWeight: "bold",
    color
  }),
  statLabel: {
    fontSize: "0.9rem",
    color: "#64748b"
  },
  form: {
    display: "flex",
    gap: "0.5rem"
  },
  input: {
    flex: 1,
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    outline: "none",
    fontSize: "1rem"
  },
  inputFocus: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 2px #2563eb33"
  },
  addBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "0.5rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background 0.2s"
  },
  addBtnHover: {
    background: "#1d4ed8"
  },
  error: {
    marginTop: "1rem",
    padding: "0.75rem",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "0.5rem",
    fontSize: "0.95rem"
  },
  todoList: {
    marginTop: 0
  },
  todoItem: completed => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    borderRadius: "0.75rem",
    border: "1px solid",
    borderColor: completed ? "#e5e7eb" : "#d1d5db",
    background: completed ? "#f9fafb" : "#fff",
    transition: "all 0.2s"
  }),
  checkBtn: completed => ({
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "0.375rem",
    border: "2px solid",
    borderColor: completed ? "#22c55e" : "#d1d5db",
    background: completed ? "#22c55e" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    cursor: "pointer"
  }),
  todoTitle: completed => ({
    flex: 1,
    color: completed ? "#6b7280" : "#1e293b",
    textDecoration: completed ? "line-through" : "none",
    fontSize: "1rem"
  }),
  deleteBtn: {
    color: "#ef4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.25rem",
    transition: "color 0.2s"
  },
  deleteBtnHover: {
    color: "#b91c1c"
  },
  loading: {
    textAlign: "center",
    padding: "2rem 0",
    color: "#6b7280"
  },
  empty: {
    textAlign: "center",
    padding: "2rem 0",
    color: "#6b7280"
  },
  apiInfo: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#64748b"
  }
};

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  // Simulated API calls (replace with actual fetch calls to Flask backend)
  const api = React.useMemo(() => ({
    getTodos: async () => [
      { id: 1, title: 'Learn React', completed: false },
      { id: 2, title: 'Build Flask API', completed: true },
      { id: 3, title: 'Connect Frontend & Backend', completed: false }
    ],
    createTodo: async (title) => ({ id: Date.now(), title, completed: false }),
    updateTodo: async (id, updates) => ({ id, ...updates }),
    deleteTodo: async (id) => ({ success: true })
  }), []);

  const loadTodos = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      setError('');
      const todo = await api.createTodo(newTodo);
      setTodos([...todos, todo]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      setError('');
      const todo = todos.find(t => t.id === id);
      const updated = await api.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: updated.completed } : t));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setError('');
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  // Button hover states
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [deleteBtnHoverId, setDeleteBtnHoverId] = useState(null);

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={styles.card}>
          <h1 style={styles.headerTitle}>Todo Application</h1>
          <p style={styles.headerDesc}>Full-Stack Demo: React + Python Flask API</p>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox("#eff6ff", "#2563eb")}>
              <div style={styles.statNumber("#2563eb")}>{stats.total}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div style={styles.statBox("#dcfce7", "#22c55e")}>
              <div style={styles.statNumber("#22c55e")}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
            <div style={styles.statBox("#fef9c3", "#eab308")}>
              <div style={styles.statNumber("#eab308")}>{stats.pending}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div style={styles.card}>
          <form onSubmit={handleAddTodo} style={styles.form}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              style={{
                ...styles.input,
                ...(inputFocus ? styles.inputFocus : {})
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
            <button
              type="submit"
              style={{
                ...styles.addBtn,
                ...(addBtnHover ? styles.addBtnHover : {})
              }}
              onMouseEnter={() => setAddBtnHover(true)}
              onMouseLeave={() => setAddBtnHover(false)}
            >
              <Plus size={20} />
              Add
            </button>
          </form>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
        </div>

        {/* Todo List */}
        <div style={styles.card}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem" }}>Your Todos</h2>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : todos.length === 0 ? (
            <div style={styles.empty}>
              No todos yet. Add one above to get started!
            </div>
          ) : (
            <div style={styles.todoList}>
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  style={styles.todoItem(todo.completed)}
                >
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    style={styles.checkBtn(todo.completed)}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>
                  <span style={styles.todoTitle(todo.completed)}>
                    {todo.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    style={{
                      ...styles.deleteBtn,
                      ...(deleteBtnHoverId === todo.id ? styles.deleteBtnHover : {})
                    }}
                    onMouseEnter={() => setDeleteBtnHoverId(todo.id)}
                    onMouseLeave={() => setDeleteBtnHoverId(null)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Info */}
        <div style={styles.apiInfo}>
          <p>This demo uses simulated API calls</p>
          <p>Check the README for backend setup instructions</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;