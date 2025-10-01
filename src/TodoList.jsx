import styles from "./todoList.module.css";
import { searchTodo } from "./utils";
import { useTodos } from "./hooks/useTodos";
import { useState } from "react";

export const TodoList = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isSorted, setIsSorted] = useState(false);


	const {todos,
		inputValue,
		isCreating,
		isLoader,

		setInputValue,

		requestAddTodo,
		requestUpdateTodo,
		requestDeleteTodo,}
	= useTodos();

    const sortTodos = (todosArray) => {
        return [...todosArray].sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    };

    const filteredTodos = searchTodo(todos, searchQuery);
    const sortedTodos = isSorted ? sortTodos(filteredTodos) : filteredTodos;

	const handleAddTodo = () => {
        requestAddTodo(true);
    };

	const handleToggleSort = () => {
        setIsSorted(!isSorted);
    };

	const handleToggleTodo = (id, completed) => {
        requestUpdateTodo(id, { completed: !completed });
    };

	const handleDeleteTodo = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
            requestDeleteTodo(id);
        }
    };

	const handleAddTodoKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddTodo();
        }
    };

	const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

	return (
	<div className={styles.todoContainer}>
		<div className={styles.todoApp}>
			<header className={styles.todoHeader}>
				<h1 className={styles.todoTitle}>Список задач</h1>
			</header>

			<div className={styles.todoForm}>
				<div className={styles.searchGroup}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Поиск задач..."
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>

            	<div className={styles.inputGroup}>
                	<input type="text"
					className={styles.todoInput}
					placeholder="Добавить новую задачу..."
					value={inputValue}
					onKeyDown={handleAddTodoKeyPress}
					disabled={isCreating}
					onChange={({ target }) => (setInputValue(target.value))}
					/>
                	<button disabled={isCreating || !inputValue.trim()}
					className={styles.addBtn}
					onClick={handleAddTodo}
					>
						Добавить задачу
					</button>

					<button
                        className={`${styles.sortBtn} ${isSorted ? styles.sortBtnActive : ''}`}
                        onClick={handleToggleSort}
                        title={isSorted ? "Отключить сортировку" : "Сортировать по алфавиту"}
                    >
                        {isSorted ? 'A-Z ✓' : 'A-Z'}
                    </button>
            	</div>

				{isLoader ? (
					<div className={styles.loaderGradient}></div>
				) : ( <ul className={styles.todoList}>
						{sortedTodos.map(( todo ) => (
							<li key={todo.id} className={styles.todoItem}>
								<input id={todo.id}
								type="checkbox"
								checked={todo.completed || false}
								className={styles.todoCheckbox}
								onChange={() => handleToggleTodo(todo.id, todo.completed)}
								/>
								<div className={styles.todoText}>
									{todo.title}
								</div>
								<button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className={styles.deleteBtn}
                                    title="Удалить задачу"
                                >
                                    x
                                </button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	</div>
	)
};
