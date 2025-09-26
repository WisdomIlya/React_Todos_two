import { useEffect, useState } from "react";
import styles from './todoList.module.css';

export const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [isLoader, setIsLoader] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
    // const [isUpdating, setIsUpdating] = useState(false);
    // const [isDeleting, setIsDeleting] = useState(false);
	const [inputValue, setInputValue] = useState('');

	useEffect (() => {
		setIsLoader(true);

		fetch('http://localhost:3000/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodo) => (
				console.log(loadedTodo),
				setTodos(loadedTodo)))
			.finally(() => setIsLoader(false));
	}, [])

	const generateId = () => {
    	return Date.now().toString(36) + Math.random().toString(36);
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
            requestAddTodo();
        }
	}

	let isValueValid = inputValue ? true : false;

	const requestAddTodo = () => {
 		if (!inputValue.trim()) return;

		setIsCreating(true);

		if (isValueValid) {
			fetch('http://localhost:3000/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					id: generateId(),
					title: inputValue.trim(),
					completed: false,
			}),
			})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
			console.log('Задача добавлена, ответ сервера:', response);
			setTodos(prevTodos => [...prevTodos, response]);
			})
			.finally(() => setIsCreating(false));
			setInputValue('');
		}
	};

	return (
	<div className={styles.todoContainer}>
		<div className={styles.todoApp}>
			<header className={styles.todoHeader}>
				<h1 className={styles.todoTitle}>Список задач</h1>
			</header>

			<div className={styles.todoForm}>
            	<div className={styles.inputGroup}>
                	<input type="text"
					className="todoInput"
					placeholder="Добавить новую задачу..."
					value={inputValue}
					onKeyDown={handleKeyPress}
					onChange={({ target }) => (setInputValue(target.value))}
					/>
                	<button disabled={isCreating || !inputValue.trim()}
					className={styles.addBtn}
					onClick={requestAddTodo}
					>
						Добавить задачу
					</button>
            	</div>

				{isLoader ? (
					<div className={styles.loaderGradient}></div>
				) : ( <ul className={styles.todoList}>
						{todos.map(({ id, title, completed }) => (
							<li key={id} className={styles.todoItem}>
								<input id={id}
								type="checkbox"
								checked={completed || false}
								className={styles.todoCheckbox}
								/>
								<div className={styles.todoText}>{title}</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	</div>
	)
};
