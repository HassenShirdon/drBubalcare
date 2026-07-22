type Session = { user: { id: string; role: string; name: string; email: string } };

export function mockSession(role: string, id = 'user-1'): Session {
  return { user: { id, role, name: 'Test', email: 'test@test.com' } };
}

export function createRequest(body?: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

export function createRequestWithBody(body: unknown): Request {
  return {
    json: async () => body,
    headers: new Headers({ 'content-type': 'application/json' }),
  } as unknown as Request;
}

export function formDataRequest(files: { name: string; type: string; size: number }[]): Request {
  const formData = new FormData();
  for (const file of files) {
    const blob = new Blob([new ArrayBuffer(file.size)], { type: file.type });
    Object.defineProperty(blob, 'name', { value: file.name });
    formData.append('files', blob, file.name);
  }
  return { formData: async () => formData, json: async () => ({}) } as unknown as Request;
}

export function paramsRequest(caseId: string) {
  return { params: Promise.resolve({ caseId }) } as Request;
}

export function idParamsRequest(id: string) {
  return { params: Promise.resolve({ id }) } as Request;
}

export function slugParamsRequest(slug: string) {
  return { params: Promise.resolve({ slug }) } as Request;
}
