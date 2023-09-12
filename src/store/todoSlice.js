import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async function (arg, thunkAPI) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=15`);
            if (!response.ok) {
                throw new Error('Server Error!');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },
);

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async function (id, thunkAPI) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Can\'t delete task. Server error!');
            }

            thunkAPI.dispatch(removeTodo({id}));

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const toggleStatus = createAsyncThunk(
    'todos/toggleStatus',
    async function (id, thunkAPI) {

        const todo = thunkAPI.getState().todos.todos.find(todo => todo.id === id);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !todo.completed,
                })
            })
            if (!response.ok) {
                throw new Error('Can\'t toggle status. Server error!');
            }

            thunkAPI.dispatch(toggleTodoCompleted({id}))

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const addNewTodo = createAsyncThunk(
    'todos/addNewTodo',
    async function(text, thunkAPI) {
        try {
            const todo = {
                title: text,
                userId: 1,
                completed: false,
            };

            const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo),
            })

            if (!response.ok) {
                throw new Error('Can\'t add task. Server error!');
            }

            const data = await response.json();
            thunkAPI.dispatch(addTodo(data));

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


export const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null,
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push(action.payload)
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id)
        },
        toggleTodoCompleted(state, action) {
            const toggleTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggleTodo.completed = !toggleTodo.completed;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state, action) => {
            state.status = 'loading';
            state.error = null;
        })
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.todos = action.payload;
        })
        builder.addCase(fetchTodos.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
        builder.addCase(deleteTodo.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
        builder.addCase(toggleStatus.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
        builder.addCase(addNewTodo.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
    }
})

const {addTodo, removeTodo, toggleTodoCompleted} = todoSlice.actions;

export default todoSlice.reducer;