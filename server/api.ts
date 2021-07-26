import express, {Request, Response, Router} from "express";
import {config} from "./config";
import {db} from "./main";
import {route, log} from "./decorators";

const cfg = new config();

export class api {
    constructor() {
            
    }

    @log()
    async getItems(r: Request, wr: Response) {
        db.getConnection((err,conn)=> {
            if(err) {
                console.log(err.message);
                conn.release();
                wr.end();
                return;
            }
            conn.query(cfg.schema?.queries?.select.all_items,(err,result,fields)=> {
                if (err) {
                    console.log(err.message);
                    conn.release();
                    wr.end();
                }
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
        wr.end();
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
    async postItem(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err,conn)=>{
            let b = new Buffer(r.body);
            conn.query(cfg.schema.queries.insert.item,b,(err,result,fields)=>{
                if(err){
                    console.log(err.message);
                    conn.release();
                    wr.end();
                    return;
                }
                wr.write(result);
                wr.end();
            });
        });
    }
    @log()
    async getItem(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err,conn)=>{
            if(err) {
                console.log(err.message);
                conn.release();
                wr.end();
                return;
            }
            conn.query(cfg.schema.queries.select.item,r.body.id,(err,result,fields)=>{
                if(err) {
                    console.log(err.message);
                        return err;
                    } 
                    else {
                    console.log(result)
                    wr.setHeader("Content-Type","application/json");
                    wr.write(JSON.stringify(result));
                    wr.end();
                }
            });
        });
        
    }
    @log()
    async patchItem(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
    @log()
    async deleteItem(r: Request, wr: Response) {
        // TODO
        wr.end();
    }

    @log()
    async postOrder(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
    @log()
    async getOrder(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
    @log()
    async patchOrder(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
    @log()
    async deleteOrder(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
    @log()
    async getOrders(r: Request, wr: Response) {
        // TODO
        wr.end();
    }
}
