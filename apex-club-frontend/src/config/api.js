// API Configuration
const API_CONFIG = {
    // Base URL for production
    PROD_API_URL: process.env.REACT_APP_API_URL || 'https://api.apexclub.com',
    
    // Base URL for development
    DEV_API_URL: 'http://localhost:5000',
    
    // API Endpoints
    ENDPOINTS: {
        // Auth endpoints
        AUTH: {
            LOGIN: '/auth/login',
            SIGNUP: '/auth/signup',
            VERIFY: '/auth/verify',
            REFRESH: '/auth/refresh',
        },
        
        // User endpoints
        USER: {
            PROFILE: '/user/profile',
            UPDATE: '/user/update',
            SETTINGS: '/user/settings',
        },
        
        // Content endpoints
        CONTENT: {
            UPLOAD: '/content/upload',
            LIST: '/content/list',
            SINGLE: '/content/:id',
            DELETE: '/content/:id/delete',
            UPDATE: '/content/:id/update',
        },
        
        // Community endpoints
        COMMUNITY: {
            MESSAGES: '/community/messages',
            EVENTS: '/community/events',
            CHALLENGES: '/community/challenges',
        },
        
        // Analytics endpoints
        ANALYTICS: {
            DASHBOARD: '/analytics/dashboard',
            EARNINGS: '/analytics/earnings',
            VIEWS: '/analytics/views',
            ENGAGEMENT: '/analytics/engagement',
        },
        
        // Transaction endpoints
        TRANSACTIONS: {
            LIST: '/transactions/list',
            CREATE: '/transactions/create',
            VERIFY: '/transactions/:id/verify',
        }
    },
    
    // API Version
    VERSION: 'v1',
    
    // Request timeout in milliseconds
    TIMEOUT: 30000,
    
    // WebSocket configuration
    WEBSOCKET: {
        URL: process.env.REACT_APP_WS_URL || 'wss://ws.apexclub.com',
        RECONNECT_INTERVAL: 5000,
        MAX_RETRIES: 5,
    }
};

// Helper function to get the appropriate API URL based on environment
export const getApiUrl = () => {
    return process.env.NODE_ENV === 'production' ? API_CONFIG.PROD_API_URL : API_CONFIG.DEV_API_URL;
};

// Helper function to construct full endpoint URL
export const getEndpointUrl = (endpoint) => {
    return `${getApiUrl()}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// Helper function to handle API errors
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        return {
            status: error.response.status,
            message: error.response.data.message || 'An error occurred',
            data: error.response.data
        };
    } else if (error.request) {
        // Request made but no response
        return {
            status: 503,
            message: 'Service unavailable',
            data: null
        };
    } else {
        // Error in request configuration
        return {
            status: 400,
            message: error.message,
            data: null
        };
    }
};

export default API_CONFIG;