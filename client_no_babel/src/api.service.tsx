import axios from "axios";

class HttpClient {

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

    public baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async login(data: string): Promise<any> { 
        await axios.post(`${this.baseURL}${this.apiPaths.login}`,data, {headers:this.headers})
    }

    async register(data: string): Promise<any> { 
        await axios.post(`${this.baseURL}${this.apiPaths.register}`, data, {headers:this.headers})
    }

    async postItem(data: string): Promise<any> { 
        await axios.post(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }

    async patchItem(data: string): Promise<any> { 
        await axios.patch(`${this.baseURL}${this.apiPaths.item}`, data, {headers:this.headers})
    }
    async getItem(data: string): Promise<any> { 
        await axios.get(`${this.baseURL}${this.apiPaths.item}`, {headers:this.headers})
    }
    async getItems(): Promise<any> {
        await axios.get(`${this.baseURL}${this.apiPaths.items}`,{headers:this.headers})
    }
    async postOrder(data: string): Promise<any> { 
        await axios.post(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async patchOrder(data: string): Promise<any> { 
        await axios.patch(`${this.baseURL}${this.apiPaths.order}`, data, {headers:this.headers})
    }
    async getOrder(data: string): Promise<any> { 
        await axios.get(`${this.baseURL}${this.apiPaths.order}`, {headers:this.headers})
    }
    async getOrders(): Promise<any> {
        await axios.get(`${this.baseURL}${this.apiPaths.orders}`,{headers:this.headers})
    }

}