import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useRouter } from "next/router";
import { useAuth } from "../firebase/auth";
import Loader from "@/components/Loader";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Home() {
  const router = useRouter();
  const { authUser, isLoading, signOut } = useAuth();
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }
    if (!!authUser) {
      fetchTodos(authUser.uid);
    }
  }, [authUser, isLoading]);

  const addTodo = async () => {
    if (todoInput.length < 1) {
      setError("Can't save empty todo, Please add your todo's");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        owner: authUser.uid,
        content: todoInput,
        completed: false,
      });
      fetchTodos(authUser.uid);
      setTodoInput("");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.log(error);
    }
  };
  const makeAsCompleteHander = async (event, docId) => {
    try {
      const todoRef = doc(db, "todos", docId);
      await updateDoc(todoRef, {
        completed: event.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An error occured", error);
    }
  };
  const onKeyUp = (event) => {
    if (event?.key === "Enter" && todoInput?.length > 0) {
      addTodo();
    }
  };
  return !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">Your's To Dooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser.username}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={(e) => onKeyUp(e)}
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={addTodo}
              // disabled={todoInput.length > 1 ? false : true}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-center justify-between mt-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    id={`todo-${todo.id}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                    checked={todo.completed}
                    onChange={(e) => makeAsCompleteHander(e, todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`font-medium ${
                      todo.completed ? "line-through" : ""
                    }`}
                  >
                    {todo.content}
                  </label>
                </div>

                <div
                  className="flex items-center gap-3"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <MdDeleteForever
                    size={24}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center animate-pulse">
              <svg
                className="w-16 h-16 mb-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M15.54 8.46a3 3 0 0 1 0 4.24l-4.24 4.24a3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24l4.24-4.24a3 3 0 0 1 4.24 0z"></path>
              </svg>
              <div className="bg-gray-200 rounded-lg p-4">
                <p className="text-gray-600 mb-2 opacity-50">
                  You have no todos.
                </p>
                <ul className="list-disc list-inside opacity-50"></ul>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5"
            role="alert"
          >
            <strong class="font-bold">Hey, </strong>
            <span class="block sm:inline">{error}</span>
            <span
              class="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError("")}
            >
              <svg
                class="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
