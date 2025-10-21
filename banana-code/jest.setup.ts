// Minimal Request polyfill for next/server which expects Request in test env
if (typeof (globalThis as any).Request === "undefined") {
	(globalThis as any).Request = class Request {
		constructor(input: any, init?: any) {
			(this as any).input = input;
			(this as any).init = init;
		}
	};
}

// Minimal Response polyfill (used by next/server internals in tests)
if (typeof (globalThis as any).Response === "undefined") {
	(globalThis as any).Response = class Response {
		constructor(body?: any, init?: any) {
			(this as any).body = body;
			(this as any).init = init;
		}
	};
}
