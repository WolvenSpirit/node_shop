import express, {Request, Response, Router} from "express";

export const router = express.Router();

/**
 * @route(path: string, method: string)
 *
 * @returns {MethodDecorator}
 */
export function route(path: string, method: string): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        switch(method) {
            case "get":
                router.get(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
            case "post":
                router.post(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
            case "put":
                router.put(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
            case "patch":
                router.patch(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
            case "delete":
                router.delete(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
            default:
                router.get(path,function(req: Request, resp: Response) {
                    descriptor.value(req,resp);
                });
        }
    }
}

export function log(): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let original = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const r = args[0] as Request;
            const wr = args[1] as Response;
            let t = new Date().toDateString();
            console.log(`${t} - Method:[${r.method}] Path:[${r.path}]`);
        }
    }   
}

export function authenticate(): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let original = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const r = args[0];
            const wr = args[1];
            console.table(args);
            // TODO ...
        }
    }   
}

export function validate() {
    return function(target: any, propertyKey: string) {
        console.log(target, propertyKey);
    }
}