import axios from "axios";
import { baseURL } from "./config";

export class HttpClient {

    private apiPaths = {
        item:       "/item",
        login:      "/login",
        register:   "/register",
        order:      "/order",
        items:      "/items",
        orders:     "/orders",
        images:     "/images"
    }

    private headers = {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: ''
    }

    public baseURL: string = "";
    constructor(url?: string) {
        this.baseURL = baseURL;
        if(url) {
            this.baseURL = url as string;
        }

        let auth = sessionStorage.getItem('Authorization');
        if(auth !== null) {
            this.headers['Authorization'] = `Bearer ${auth}`;
        }
    }

    async login(data: any): Promise<any> { 
        console.log(data); 
        return axios.post(`${this.baseURL}${this.apiPaths.login}`,data, {headers:this.headers})
    }

    async register(data: any): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.register}`, data, {headers:this.headers})
    }

    async postItem(data: any): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }

    async patchItem(data: any): Promise<any> { 
        return axios.patch(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }
    async getItem(id: any): Promise<any> { 
        return axios.get(`${this.baseURL}${this.apiPaths.item}/${id}`, {headers:this.headers})
    }
    async getItems(): Promise<any> {
        return axios.get(`${this.baseURL}${this.apiPaths.items}`,{headers:this.headers})
    }
    async postOrder(data: any): Promise<any> { 
        return axios.post(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async patchOrder(data: any): Promise<any> { 
        return axios.patch(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async getOrder(data: any): Promise<any> { 
        return axios.get(`${this.baseURL}${this.apiPaths.order}`, {headers:this.headers})
    }
    async getOrders(): Promise<any> {
        return axios.get(`${this.baseURL}${this.apiPaths.orders}`,{headers:this.headers})
    }
    async postImage(formData: FormData): Promise<any> {
        return axios.post(`${this.baseURL}${this.apiPaths.images}`,formData,{headers:{
            ContentType: 'multipart/formdata',
            Accept: 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('Authorization')}`
        }})
    }

}