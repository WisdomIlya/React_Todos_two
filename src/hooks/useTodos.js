import { generatedId } from "../utils";
import { API_BASE_URL } from "../constants";
import { useState, useEffect } from 'react';

export const useTodos = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [isLoader, setIsLoader] = useState(false);

	useEffect(() => {
		setIsLoader(true);

		fetch(`${API_BASE_URL}/todos`)
			.then((response) => response.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => {
				setIsLoader(false);
			});
	}, []);

	const requestAddTodo = (isValueValid = true) => {
		if (!inputValue.trim() || !isValueValid) return;

		setIsCreating(true);

		fetch(`${API_BASE_URL}/todos`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				id: generatedId(),
				title: inputValue.trim(),
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача добавлена, ответ сервера:', response);
				setTodos((prevTodos) => [...prevTodos, response]);
				setInputValue('');
			})
			.finally(() => {
				setIsCreating(false);
			});
	};

	const requestUpdateTodo = (id, updates) => {
		fetch(`${API_BASE_URL}/todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		})
			.then((response) => response.json())
			.then((updatedTodo) => {
				setTodos((prevTodos) =>
					prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
				);
			});
	};

	const requestDeleteTodo = (id) => {
		fetch(`${API_BASE_URL}/todos/${id}`, {
			method: 'DELETE',
		}).then(() => {
			setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
		});
	};

	return {
		// Состояния
		todos,
		inputValue,
		isCreating,
		isLoader,

		// Сеттеры состояний
		setInputValue,

		// Методы
		requestAddTodo,
		requestUpdateTodo,
		requestDeleteTodo,
	};
};
