const host = 'http://localhost:5000';

export const ensureAccess = async () => {
    try {
        const res = await fetch(`${host}/api/auth/getuser`, {
            method: 'POST',
            credentials: 'include'
        });

        if (res.status === 401 || res.status === 403) {
            await fetch(`${host}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });
        }
    } catch (error) {
        console.error("Auto refresh failed:", error);
    }
};
