export const generatedId = () => {
	return Date.now().toString(36) + Math.random().toString(36);
}
