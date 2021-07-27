import express, {Request, Response, Router} from "express";
import {config} from "./config";
import {db} from "./main";
import {route, log} from "./decorators";
import { QueryError } from "mysql2";
import PoolConnection from "mysql2/typings/mysql/lib/PoolConnection";

const cfg = new config();

type dbPayload = Buffer | string | Uint8Array

function handleError(err:Error, conn: PoolConnection, wr: Response) {
    if(err) {
        console.log(err.message);
        conn.release();
        wr.end();
    }
}

function handleUrlParamReq(r: Request, wr: Response, queryType: string, resource: string) {
    console.log(r.params);
    let n = parseInt(r.params.id,10);
    db.getConnection((err,conn)=>{
        if(err) {
            handleError(err,conn,wr)
            return;
        }
        conn.query(cfg.schema.queries[queryType][resource],n,(err,result,fields)=>{
            if (err) {
                handleError(err,conn,wr)
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type","application/json");
            wr.write(JSON.stringify(result));
            wr.end();
        });
    });
}

function handleSelectAll(r: Request, wr: Response, resource: string) {
    db.getConnection((err,conn)=> {
        if(err) {
            handleError(err,conn,wr)
            return;
        }
        conn.query(cfg.schema?.queries?.select[resource],(err,result,fields)=> {
            if (err) {
                handleError(err,conn,wr)
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type","application/json");
            wr.write(JSON.stringify(result));
            conn.release();
            wr.end();
        });
    });
}

export class api {
    constructor() {
            
    }

    @log()
    async getItems(r: Request, wr: Response) {
        handleSelectAll(r,wr,'all_items');
    }

    @log()
    async getOrders(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'select','all_orders');
    }

    @log()
    async index(r: Request, wr: Response) {
        console.log(cfg.template);
        wr.write(`${cfg.template}`);
        wr.end();
    }

    @log()
    serveBundleJS(r: Request, wr: Response) {
        wr.setHeader("Content-Type","application/javascript");
        wr.write(cfg.appjs);
        wr.end();
    }

    @log()
    async getItem(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'select','item');
    }

    @log()
    async deleteItem(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'delete','item');
    }

    @log()
    async getOrder(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'select','order');
    }

    @log()
    async deleteOrder(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'delete','order');
    }

    @log()
    async postItem(r: Request, wr: Response) {
        let q: string = cfg.schema.queries.insert.item
        db.getConnection((err,conn)=>{
            conn.query(q ,r.body ,(err,result,fields)=>{
                if(err){
                    handleError(err,conn,wr)
                    return;
                }
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }

    @log()
    async patchItem(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err,conn)=>{
            if(err) {
                handleError(err,conn,wr)
                return;
            }
            conn.query(cfg.schema.queries.update.item,r.body,(err,result,fields)=>{
                if (err) {
                    handleError(err,conn,wr)
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }

    @log()
    async postOrder(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err: Error, conn: PoolConnection)=>{
            handleError(err,conn,wr);
            conn.query(cfg.schema.queries.insert.order,r.body,(err,result,fields)=>{
                if(err) {
                    handleError(err,conn,wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        })
    }

    @log()
    async patchOrder(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err,conn)=>{
            if(err) {
                handleError(err,conn,wr)
                return;
            }
            conn.query(cfg.schema.queries.patch.order_paid,r.body,(err,result,fields)=>{
                if (err) {
                    handleError(err,conn,wr)
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }

    @log()
    async login(r: Request, wr: Response) {
        // TODO
    }

    @log()
    async register(r: Request, wr: Response) {
        // TODO
    }

}
