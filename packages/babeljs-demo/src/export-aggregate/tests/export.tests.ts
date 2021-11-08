type A = number;
const a = 1;

export interface AA {
	a: A;
}

export type CC = AA;

export const aa: CC = { a: 1 };

export { a };
export type { A };
