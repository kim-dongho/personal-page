import { useState, useEffect, useRef } from 'react'; // Added useRef
import styled from '@emotion/styled';
import { supabase } from '@/lib/supabaseClient';
import { BsCircle, BsCheckCircleFill } from 'react-icons/bs';
import { IoMdAdd, IoMdCloseCircleOutline } from 'react-icons/io'; // Added IoMdCloseCircleOutline
import { FiEdit } from 'react-icons/fi'; // Added FiEdit

// --- Component Styles ---
const TodoContainer = styled.div`
  padding: 20px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin: 0 0 20px;
  text-align: center;
  font-weight: 700;
  color: #e8eaed;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dadce0; // Lighter border for white background
  background-color: #ffffff; // White background
  color: #202124; // Dark text for readability
  font-size: 16px;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4285f4; // Google blue for focus
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background-color: #8ab4f8;
  color: #202124;
  cursor: pointer;
  font-size: 1.5em;
`;

const TodoListUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;

  /* Webkit Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const TodoItem = styled.li<{ isCompleted: boolean; isEditing: boolean }>`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: ${(props) =>
    props.isCompleted && !props.isEditing ? "line-through" : "none"};
  color: ${(props) =>
    props.isCompleted && !props.isEditing ? "#888" : "#e8eaed"};
  transition: background-color 0.2s ease;
  position: relative; // For action buttons
`;

const TodoText = styled.span`
  flex-grow: 1;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2; // Limit to 2 lines
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; // Allow text to wrap
`;

const IconWrapper = styled.div`
  font-size: 1.2em;
  color: #8ab4f8;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  opacity: 0;
  ${TodoItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
  line-height: 1;
  &:hover {
    color: #ff6b6b; // Red for delete
  }
  &.edit {
    &:hover {
      color: #8ab4f8; // Blue for edit
    }
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 10px;
  align-items: center;
`;

const EditInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dadce0;
  background-color: #ffffff;
  color: #202124;
  font-size: 1em;
`;

const SaveButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #8ab4f8;
  color: #202124;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #a1c5ff;
  }
`;

const TodoList = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [task, setTask] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("inserted_at", { ascending: true });
    if (error) console.error("Error fetching todos:", error);
    else setTodos(todos);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    const { data, error } = await supabase.from("todos").insert({ task }).select();

    if (error) {
      console.error("Error adding todo:", error);
    } else if (data) {
      setTodos([...todos, data[0]]);
      setTask("");
    }
  };

  const toggleTodo = async (id: number, is_completed: boolean) => {
    if (editingTodoId === id) return; // Do not toggle while editing

    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !is_completed })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !is_completed } : todo
        )
      );
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const handleEditClick = (todo: any) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.task);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (id: number) => {
    if (editingText.trim() === "") {
      handleDeleteTodo(id);
      return;
    }
    const { error } = await supabase
      .from("todos")
      .update({ task: editingText })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, task: editingText } : todo
        )
      );
    }
    setEditingTodoId(null);
    setEditingText("");
  };

  useEffect(() => {
    if (editingTodoId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTodoId]);

  return (
    <TodoContainer>
      <Title>Todo List</Title>
      <InputContainer onSubmit={addTodo}>
        <Input
          type="text"
          placeholder="새로운 할 일 추가..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <AddButton type="submit" aria-label="Add task">
          <IoMdAdd />
        </AddButton>
      </InputContainer>
      <TodoListUl>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            isCompleted={todo.is_completed}
            isEditing={editingTodoId === todo.id}
          >
            <IconWrapper
              onClick={() => toggleTodo(todo.id, todo.is_completed)}
            >
              {todo.is_completed ? <BsCheckCircleFill /> : <BsCircle />}
            </IconWrapper>
            {editingTodoId === todo.id ? (
              <EditContainer>
                <EditInput
                  ref={editInputRef}
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit(todo.id);
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                />
                <SaveButton onClick={() => handleSaveEdit(todo.id)}>
                  완료
                </SaveButton>
              </EditContainer>
            ) : (
              <TodoText
                onClick={() => toggleTodo(todo.id, todo.is_completed)}
                title={todo.task}
              >
                {todo.task}
              </TodoText>
            )}
            <ActionButtons>
              {editingTodoId !== todo.id && (
                <ActionButton
                  className="edit"
                  onClick={() => handleEditClick(todo)}
                  aria-label="Edit todo"
                >
                  <FiEdit />
                </ActionButton>
              )}
              {editingTodoId !== todo.id && (
                <ActionButton
                  onClick={() => handleDeleteTodo(todo.id)}
                  aria-label="Delete todo"
                >
                  <IoMdCloseCircleOutline />
                </ActionButton>
              )}
            </ActionButtons>
          </TodoItem>
        ))}
      </TodoListUl>
    </TodoContainer>
  );
};

export default TodoList;
