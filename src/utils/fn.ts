export function once<T extends (...args: any) => any>(fn: T): T {
	let called = false;
	let result: any;
	const onceFn: any = (...args: any): any => {
		if (called) {
			return result;
		}
		called = true;
		result = fn(...args);
		return result;
	};
	return onceFn;
}
