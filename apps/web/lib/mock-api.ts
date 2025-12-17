
const MOCK_DELAY = 800; // ms to simulate network latency

export async function mockFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = input.toString();
    const method = init?.method || 'GET';

    console.log(`[MOCK API] ${method} ${url}`);

    await new Promise(r => setTimeout(r, MOCK_DELAY));

    // Helper to return JSON
    const json = (data: any, status = 200) => {
        return new Response(JSON.stringify(data), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    };

    // --- AUTH ---
    if (url.includes('/auth/login')) {
        return json({ accessToken: 'mock-jwt-token-123', user: { email: 'demo@speccraft.com', role: 'ADMIN' } });
    }
    if (url.includes('/auth/register')) {
        return json({ accessToken: 'mock-jwt-token-123', user: { email: 'new@speccraft.com', role: 'USER' } });
    }
    if (url.includes('/auth/profile')) {
        return json({ id: 'user-1', email: 'demo@speccraft.com', name: 'Demo User', role: 'ADMIN', plan: 'PRO' });
    }

    // --- DASHBOARD DOCUMENTS ---
    if (url.includes('/documents') && method === 'GET') {
        if (url.includes('/documents/')) {
            // Single doc
            return json({ id: 'doc-1', title: 'Uber for Cats', type: 'PRD', createdAt: new Date().toISOString(), content: {} });
        }
        return json([
            { id: 'doc-1', title: 'Uber for Cats', type: 'PRD', createdAt: new Date().toISOString() },
            { id: 'doc-2', title: 'E-commerce Redesign', type: 'BRD', createdAt: new Date().toISOString() },
        ]);
    }

    if (url.includes('/documents') && method === 'POST') {
        return json({ id: 'doc-new', title: 'New Project', type: 'PRD' });
    }

    // --- ADMIN ---
    if (url.includes('/admin/users')) {
        return json([
            { id: 'u1', name: 'Alice Admin', email: 'alice@test.com', role: 'ADMIN', plan: 'PRO', createdAt: new Date().toISOString() },
            { id: 'u2', name: 'Bob User', email: 'bob@test.com', role: 'USER', plan: 'FREE', createdAt: new Date().toISOString() },
        ]);
    }
    if (url.includes('/admin/plans')) {
        return json([
            { id: 'p1', name: 'Starter', price: 10, interval: 'month', isActive: true },
            { id: 'p2', name: 'Pro', price: 29, interval: 'month', isActive: true },
        ]);
    }

    console.warn(`[MOCK API] No mock found for ${url}, returning 404`);
    return json({ message: 'Not Found in Mock Mode' }, 404);
}

// Wrapper that decides whether to use Mock or Real fetch
export function appFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
    if (useMock) {
        return mockFetch(input, init);
    }
    return fetch(input, init);
}
