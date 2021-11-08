type A = number;
const a = 1;
interface AA {
	a: A;
}
type CC = AA;
const aa: CC = {
	a: 1,
};
export { a, A, AA, CC, aa };
