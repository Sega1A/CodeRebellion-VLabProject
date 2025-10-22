export function withRole<T>(role: string, fn: () => T): T {
  // Spy on React.useState only during this callback to simulate role without changing page.tsx
  const realReact = jest.requireActual("react");
  const realUseState = realReact.useState;

  // Use require to get the live React module for spying
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react");

  const spy = jest.spyOn(React, "useState").mockImplementation((initial: any) => {
    if (initial === "estudiante") {
      const setter = jest.fn();
      return [role, setter] as any;
    }
    return realUseState(initial as any);
  });

  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}
