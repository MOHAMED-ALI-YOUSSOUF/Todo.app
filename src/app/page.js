"use client";
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

// Function to add a todo to Firestore
const addTodoToFirebase = async (title, details, dueDate) => {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      details: details,
      dueDate: dueDate,
      createdAt: serverTimestamp(),
    });
    console.log("Todo added with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding todo", error);
    return false;
  }
};

// Function to fetch todos from Firestore
const fetchTodosFromFirebase = async () => {
  const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const todos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return todos;
};

// Function to update a todo in Firestore
const updateTodoInFirebase = async (id, title, details, dueDate) => {
  try {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      title: title,
      details: details,
      dueDate: dueDate,
      updatedAt: serverTimestamp(),
    });
    console.log("Todo updated with ID: ", id);
    return true;
  } catch (error) {
    console.error("Error updating todo", error);
    return false;
  }
};

// Main component
export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateTodoId, setUpdateTodoId] = useState(null);

  useEffect(() => {
    const getTodos = async () => {
      const fetchedTodos = await fetchTodosFromFirebase();
      setTodos(fetchedTodos);
    };
    getTodos();
  }, []);

  const handleAddOrUpdateTodo = async (e) => {
    e.preventDefault();
    if (title && details && dueDate) {
      let success;
      if (isUpdateMode) {
        success = await updateTodoInFirebase(
          updateTodoId,
          title,
          details,
          dueDate
        );
      } else {
        success = await addTodoToFirebase(title, details, dueDate);
      }

      if (success) {
        const fetchedTodos = await fetchTodosFromFirebase();
        setTodos(fetchedTodos);
        setTitle("");
        setDetails("");
        setDueDate("");
        setIsUpdateMode(false);
        setUpdateTodoId(null);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const handleEditTodo = (todo) => {
    setTitle(todo.title);
    setDetails(todo.details);
    setDueDate(todo.dueDate);
    setIsUpdateMode(true);
    setUpdateTodoId(todo.id);
  };

  return (
    <main className="container py-5">
      <h1 className="text-center mb-4">Todo List</h1>
      <section className="row">
        <div className="col-12 col-md-6 mb-4">
          <form onSubmit={handleAddOrUpdateTodo} className="mb-4 shadow">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="details" className="form-label">
                Details
              </label>
              <input
                type="text"
                className="form-control"
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                className="form-control"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isUpdateMode ? "Update Todo" : "Add Todo"}
            </button>
          </form>
        </div>
        <div className="col-12 col-md-6">
          <div style={{ maxHeight: "650px", overflowY: "auto" }}>
            <ul className="list-group p-1 m-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="list-group-item d-flex justify-content-between align-items-center mt-1"
                >
                  <div>
                    <h5>{todo.title}</h5>
                    <p>{todo.details}</p>
                    <small>Due: {todo.dueDate}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => handleEditTodo(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
