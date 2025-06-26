export const ensureAccess = async () => {
    try {
        const res = await fetch('/api/auth/getuser', {
            credentials: 'include'
        });

        if (res.status === 401) {
            await fetch('/api/auth/refresh-token', {
                method: 'POST',
                credentials: 'include'
            });
        }
    } catch (error) {
        console.error("Auto refresh failed:", error);
    }
};
