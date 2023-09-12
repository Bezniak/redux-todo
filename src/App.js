import React, {useEffect, useState} from 'react';
import './App.css'
import TodoList from "./components/TodoList";
import InputField from "./components/InputField";
import {useDispatch, useSelector} from "react-redux";
import {addNewTodo, fetchTodos} from "./store/todoSlice";

const App = () => {

    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const {status, error} = useSelector(state => state.todos);

    const addTask = () => {
        dispatch(addNewTodo(text));
        setText('');
    }

    useEffect(() => {
        dispatch(fetchTodos())
    }, [dispatch])

    return (
        <div className='App'>
            <InputField text={text} handleInput={setText} handleSubmit={addTask}/>

            {status === 'loading' && <h2>Loading...</h2>}
            {error && <h2>An error occurred: {error} </h2>}

            <TodoList/>
        </div>
    );
};

export default App;