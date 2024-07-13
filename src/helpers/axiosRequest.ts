import axios, { AxiosRequestHeaders, Method } from "axios";

interface ApiRequestParams {
    endpoint: string;
    data?: any;
    method: Method;
    headers?: Record<string, string>;
}

export const apiRequest = async ({ endpoint, data, method, headers }: ApiRequestParams): Promise<any> => {

    try {
        const response = await axios({ url: endpoint, method: method, data: data, headers: headers });
        return response.data;

    } catch (error) {
        return error
    }
}


export const apiPost = (endpoint: string, data: any): Promise<any> => {

    const apiHeaders = {
        'Content-Type': 'application/json'
    };

    return apiRequest({ endpoint, data, method: 'post', headers: apiHeaders });
}


export const apiPostWithFormData = (endpoint: string, data: any): Promise<any> => {
    const apiHeaders = {
        'Content-Type': 'application/form-data'
    };
    return apiRequest({ endpoint, data, method: 'post', headers: apiHeaders });
};



export const apiGet = (endpoint: string, data: any = null): Promise<any> => {
    const apiHeaders = {
        'Content-Type': 'application/json'
    };
    return apiRequest({ endpoint, data, method: 'get', headers: apiHeaders });
};




