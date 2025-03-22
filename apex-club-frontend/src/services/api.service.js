import axios from 'axios';
import API_CONFIG, { getEndpointUrl, handleApiError } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await apiClient.post(
                    getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH),
                    { refreshToken }
                );
                const { token } = response.data;
                localStorage.setItem('token', token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API Service class
class ApiService {
    // Auth endpoints
    static async login(credentials) {
        try {
            const response = await apiClient.post(
                getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
                credentials
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async signup(userData) {
        try {
            const response = await apiClient.post(
                getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP),
                userData
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Content endpoints
    static async uploadContent(contentData) {
        try {
            const formData = new FormData();
            Object.keys(contentData).forEach(key => {
                if (key === 'files') {
                    contentData[key].forEach(file => {
                        formData.append('files', file);
                    });
                } else {
                    formData.append(key, contentData[key]);
                }
            });

            const response = await apiClient.post(
                getEndpointUrl(API_CONFIG.ENDPOINTS.CONTENT.UPLOAD),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        // You can emit this progress to a state management system
                        console.log('Upload Progress:', percentCompleted);
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async getContentList(filters = {}) {
        try {
            const response = await apiClient.get(
                getEndpointUrl(API_CONFIG.ENDPOINTS.CONTENT.LIST),
                { params: filters }
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Dashboard endpoints
    static async getDashboardStats(period = 'week') {
        try {
            const response = await apiClient.get(
                getEndpointUrl(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD),
                { params: { period } }
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Community endpoints
    static async getMessages() {
        try {
            const response = await apiClient.get(
                getEndpointUrl(API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES)
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async sendMessage(messageData) {
        try {
            const response = await apiClient.post(
                getEndpointUrl(API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES),
                messageData
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Transaction endpoints
    static async getTransactions(filters = {}) {
        try {
            const response = await apiClient.get(
                getEndpointUrl(API_CONFIG.ENDPOINTS.TRANSACTIONS.LIST),
                { params: filters }
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // WebSocket connection
    static initializeWebSocket() {
        let ws = null;
        let reconnectAttempts = 0;

        const connect = () => {
            ws = new WebSocket(API_CONFIG.WEBSOCKET.URL);

            ws.onopen = () => {
                console.log('WebSocket Connected');
                reconnectAttempts = 0;
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Handle different types of real-time updates
                switch (data.type) {
                    case 'message':
                        // Handle new message
                        break;
                    case 'notification':
                        // Handle notification
                        break;
                    case 'status':
                        // Handle status update
                        break;
                    default:
                        console.log('Unknown message type:', data.type);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                if (reconnectAttempts < API_CONFIG.WEBSOCKET.MAX_RETRIES) {
                    setTimeout(() => {
                        reconnectAttempts++;
                        connect();
                    }, API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
        };

        connect();
        return ws;
    }
}

export default ApiService;