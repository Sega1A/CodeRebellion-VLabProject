import * as React from "react";

export function withRole<T>(role: string, fn: () => T): T {
  // Spy on React.useState only during this callback to simulate role without changing page.tsx
  const realReact = jest.requireActual<typeof React>("react");
  const realUseState = realReact.useState;

  const spy = jest.spyOn(React, "useState").mockImplementation(((initial: unknown) => {
    if (initial === "estudiante") {
      const setter = jest.fn();
      return [role, setter];
    }
    return realUseState(initial);
  }) as typeof React.useState);

  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}
