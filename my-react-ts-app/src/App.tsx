import { useEffect, useState } from "react";
import {getTodos, type Todo} from "./test"

type ToggleTodo = Omit<Todo, "title">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);
/////
const [title, setTitle] = useState("");
/////
const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTitle(e.target.value);
}
/////
const handleAddTodo = async () => {
  if(title === "") {
    return;
  }

/////
const newTodo:Todo = {
  id: crypto.randomUUID(),
  title ,
  completed: false,
}

await fetch ("http://localhost:4000/todos", {
  method: "POST",
  body: JSON.stringify(newTodo)
});

setTodoList(prev=> [...prev, newTodo]);
setTitle("");
};
   
/////
const handleDeleteTodo = async (id:Todo["id"]) => {
 await fetch (`http://localhost:4000/todos/${id}`, {
    method: "DELETE",
  });

  setTodoList((prev)=> prev.filter((todo) => todo.id!== id))
};
/////
const handleToggleTodo = async ({ id, completed }: 
  ToggleTodo) => {
    await fetch (`http://localhost:4000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: !completed,
      }),
    });
   setTodoList((prev)=> 
    prev.map(todo=>{
    if(todo.id === id) {
      return {
        ...todo,
        completed: !completed,
      }
    }
    return todo;
   }))
}

return (
  <>
  <TodoList 
  todoList = {todoList} 
  onDeleteClick={handleDeleteTodo}
  onToggleClick={handleToggleTodo}
  />
  <div className="flex items-center justify-center mt-[35px] space-x-4 ml-[25px]">
  <input className="bg-slate-300 w-[250px]"
  type="text"
   value={title} 
   onChange={handleTitleChange} 
   />
  <button className="p-[4px] w-[50px]  border-2 border-indigo-300 border-solid rounded-lg hover:border-indigo-600" 
  onClick={handleAddTodo}
  >등록
  </button>
  </div>
  </>
)
}
/////
type TodoListProps = {
  todoList: Todo[];
  onDeleteClick:(id: Todo["id"]) => void 
  onToggleClick:(toggleTodo: ToggleTodo) => void;
};

function TodoList ({ 
  todoList, 
  onDeleteClick,
  onToggleClick,
}: TodoListProps) {
  return (
   <>
  {todoList.map((todo)=> (
    <TodoItem key={todo.id} {...todo} 
    onDeleteClick={onDeleteClick}
    onToggleClick={onToggleClick}
    />
  ))}
  </>
  );
}

type TodoItemProps = Todo & {
  onDeleteClick:(id: Todo["id"]) => void 
  onToggleClick:(toggleTodo: ToggleTodo) => void;
}; 


function TodoItem({ 
  id, 
  title, 
  completed,
  onDeleteClick,
  onToggleClick,
}:TodoItemProps) {
  return ( 
    <>
   <div className="flex items-center justify-center ">
     {/* <div>id: {id}.</div> */}
     <div className="text-[20px]">📌{title}</div>
     <div className="flex space-x-4 ml-[25px]">
     <button className="p-[4px] w-[50px]  rounded-lg  border-solid border-2 border-indigo-300 hover:border-indigo-600" 
     onClick={()=>
     onToggleClick({
      id,
      completed,
     })
     }
    >{`${completed}`}</button>
     <button className="p-[4px] w-[50px] border-2 border-indigo-300 border-solid rounded-lg hover:border-indigo-600 "
      onClick={()=>onDeleteClick(id)}>✖</button>
      </div>
  </div>
  </>
  )
}

export default App
