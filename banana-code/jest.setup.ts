// Minimal Request polyfill for next/server which expects Request in test env
interface GlobalThisWithPolyfills {
	Request?: unknown;
	Response?: unknown;
}

type PolyfillRequestInput = string | URL;
type PolyfillRequestInit = {
	method?: string;
	headers?: Record<string, string>;
	body?: unknown;
	[key: string]: unknown;
};

type PolyfillResponseInit = {
	status?: number;
	statusText?: string;
	headers?: Record<string, string>;
	[key: string]: unknown;
};

if (typeof (globalThis as GlobalThisWithPolyfills).Request === "undefined") {
	(globalThis as GlobalThisWithPolyfills).Request = class PolyfillRequest {
		input: PolyfillRequestInput;
		init?: PolyfillRequestInit;
		
		constructor(input: PolyfillRequestInput, init?: PolyfillRequestInit) {
			this.input = input;
			this.init = init;
		}
	};
}

// Minimal Response polyfill (used by next/server internals in tests)
if (typeof (globalThis as GlobalThisWithPolyfills).Response === "undefined") {
	(globalThis as GlobalThisWithPolyfills).Response = class PolyfillResponse {
		body?: unknown;
		init?: PolyfillResponseInit;
		
		constructor(body?: unknown, init?: PolyfillResponseInit) {
			this.body = body;
			this.init = init;
		}
	};
}

// Polyfill fetch for next-auth and other libraries that need it
if (typeof global.fetch === "undefined") {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			status: 200,
			json: async () => ({}),
			text: async () => "",
			headers: new Map(),
		})
	) as unknown as typeof fetch;
}


