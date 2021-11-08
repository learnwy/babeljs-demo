class StringFactory {
	private base: string;

	constructor(base?: string) {
		this.base = base || "";
	}

	append(...appends: string[]) {
		this.base += appends.join("");
		return this;
	}

	appendNew(...appends: string[]) {
		return new StringFactory(this.base + appends.join(""));
	}

	clone() {
		return new StringFactory(this.base);
	}

	toString(...appends: string[]) {
		return appends.length === 0 ? this.base : this.base + appends.join("");
	}
}

const formatString = (format: string, ...args: string[]) => {
	let argIndex = 0;
	return format.replace(/%(\d*)s/g, (_, match) => {
		const padNum = +match;
		const ret = !padNum
			? args[argIndex] || ""
			: `${args[argIndex]}`.padEnd(padNum, " ");
		argIndex += 1;
		return ret;
	});
};

export { StringFactory, formatString };
