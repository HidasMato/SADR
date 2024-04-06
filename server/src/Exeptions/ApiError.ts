class ApiError extends Error {
    status: any;
    errors: any[];
    constructor({ status, message, errors = [] }: { status: any, message: string, errors?: any[] }) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnavtorisationError() {
        return new ApiError({ status: 401, message: 'Пользователь не аторизован' })
    }
    static BadRequest({ message, errors = [] }: { message: string, errors?: any[] }) {
        return new ApiError({ status: 400, message, errors })
    }
}

export default ApiError;