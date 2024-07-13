import { NextResponse } from 'next/server';

// Define a type for your response structure
export type ResponseType = {
    status: number;
    data: any; // Adjust 'any' as per your specific output type
    success: boolean;
    message: string;
};

// Function to create a standardized response and NextResponse object
export const response = (status: number, data: any, success: boolean, message: string) => {
    const responseObject: ResponseType = {
        status,
        data,
        success,
        message,
    };

    return {
        responseObject,
        nextResponse: NextResponse.json(responseObject, { status }),
    };
};

export default response; // Export the response function by default
