export enum ErrorType {
	Internal,
	Runtime,
	IllegalArg,
}

export class CommonError extends Error {
	constructor(message: string, public readonly errorType = ErrorType.Internal) {
		super(message);
	}
}

export class InternalError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.Internal);
	}
}

export class IllegalArgsError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.IllegalArg);
	}
}

export class RunTimeError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.Runtime);
	}
}
