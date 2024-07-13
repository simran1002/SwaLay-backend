// Define a type for your response structure
export type ResponseType = {
    status: number;
    data: any; // Adjust 'any' as per your specific output type
    success: boolean;
    message: string;
};

// Function to create a standardized response
export const response = (status: number, data: any, success: boolean, message: string): ResponseType => {
    return {
        status,
        data,
        success,
        message,
    };
};

export default response; // Export the response function by default
