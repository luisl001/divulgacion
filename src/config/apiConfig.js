const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    // La base que pediste
    API_BASE_URL: BASE_URL, 
    
    // Pro-tip: También puedes definir rutas específicas para no repetir "/api/posts"
    POSTS: `${BASE_URL}/api/posts`,
    SEARCH: `${BASE_URL}/api/posts/search`,
    USERS: `${BASE_URL}/api/users`,
    UPLOADS: `${BASE_URL}/uploads`
};

export default BASE_URL;