from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import enum

class Status(enum.Enum):
    PENDING = "pending"
    DONE = "done"

app = Flask(__name__)
CORS(app)

connect = sqlite3.connect("tasks.db", check_same_thread=False)
cursor = connect.cursor()
cursor.execute(f"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT, status TEXT DEFAULT '{Status.PENDING.value}')")
connect.commit()


@app.route("/get_tasks", methods=["GET"])
def get_data():
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return jsonify({"tasks": tasks})

@app.route("/add_task", methods=["POST"])
def add_data():
    data = request.json
    task = data.get("task")
    cursor.execute(f"INSERT INTO tasks (task) VALUES ('{task}')")
    connect.commit()
    return jsonify({"message": "task added successfully"})

@app.route("/update_task", methods=["PUT"])
def update_data():
    data = request.json
    task_id = data.get("task_id")
    status = Status.DONE.value
    cursor.execute(f"UPDATE tasks SET status = '{status}' WHERE id = {task_id}")
    connect.commit()
    return jsonify({"message": "task updated successfully"})


@app.route("/delete_task", methods=["DELETE"])
def delete_data():
    data = request.json
    task_id = data.get("task_id")
    cursor.execute(f"DELETE FROM tasks WHERE id = {task_id}")
    connect.commit()
    return jsonify({"message": "task deleted successfully"})

@app.route("/delete_finished_task", methods=["DELETE"])
def delete_finished_data():

    cursor.execute(f"DELETE FROM tasks WHERE status = '{Status.DONE.value}'")
    connect.commit()
    return jsonify({"message": "Completed tasks deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)