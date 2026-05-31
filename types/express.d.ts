declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: number;
                email: string;
                role: string; // 🔹 NEW
            };
        }
    }
}

export { };