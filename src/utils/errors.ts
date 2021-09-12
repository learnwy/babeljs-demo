enum ErrorType {
	Internal,
	Runtime,
	IllegalArg,
}

class CommonError extends Error {
	constructor(message: string, public readonly errorType = ErrorType.Internal) {
		super(message);
	}
}

class InternalError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.Internal);
	}
}

class IllegalArgsError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.IllegalArg);
	}
}

exports.IllegalArgsError = IllegalArgsError;

class RunTimeError extends CommonError {
	constructor(message: string) {
		super(message, ErrorType.Runtime);
	}
}

export {
	ErrorType,
	CommonError,
	InternalError,
	IllegalArgsError,
	RunTimeError,
};
