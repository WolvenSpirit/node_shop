import axios from "axios";
import { baseURL } from "./config";

export class HttpClient {

    private apiPaths = {
        item:       "/item",
        login:      "/login",
        register:   "/register",
        order:      "/order",
        items:      "/items",
        orders:     "/orders"
    }

    private headers = {
        Accept: 'application/json',
        ContentType: 'application/json'
    }

    public baseURL: string = "";
    constructor(url?: string) {
        this.baseURL = baseURL;
        if(url) {
            this.baseURL = url as string;
        }
    }

    async login(data: any): Promise<any> { 
        console.log(data); 
        return axios.post(`${this.baseURL}${this.apiPaths.login}`,data, {headers:this.headers})
    }

    async register(data: any): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.register}`, data, {headers:this.headers})
    }

    async postItem(data: string): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }

    async patchItem(data: string): Promise<any> { 
        return axios.patch(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }
    async getItem(id: string): Promise<any> { 
        return axios.get(`${this.baseURL}${this.apiPaths.item}/${id}`, {headers:this.headers})
    }
    async getItems(): Promise<any> {
        return axios.get(`${this.baseURL}${this.apiPaths.items}`,{headers:this.headers})
    }
    async postOrder(data: string): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async patchOrder(data: string): Promise<any> { 
        return axios.patch(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async getOrder(data: string): Promise<any> { 
        return axios.get(`${this.baseURL}${this.apiPaths.order}`, {headers:this.headers})
    }
    async getOrders(): Promise<any> {
        return axios.get(`${this.baseURL}${this.apiPaths.orders}`,{headers:this.headers})
    }

}