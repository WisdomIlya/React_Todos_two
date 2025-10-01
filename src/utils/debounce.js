export const debounce = (fn, delay) => {
	let timerId;

	return (...args) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}
