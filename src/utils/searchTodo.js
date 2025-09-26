export const searchTodo = (todos, searchQuery) => {
	if (!searchQuery.trim()) {
		return todos;
	}

	const query = searchQuery.toLowerCase();
	return todos.filter((todo) => todo.title.toLowerCase().includes(query));
};
