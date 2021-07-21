import express, {Request, Response, Router} from "express";
import {config} from "./config";
import {db} from "./main";
import {authenticate, route, log} from "./decorators";

const cfg = new config();

export class api {

    constructor() {}

    @log()
    @route("/items","get")
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
                    wr.end();
                }
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
    }

    @log()
    @route("/","get")
    async index(r: Request, wr: Response) {
        console.log(cfg.template);
        wr.write(`${cfg.template}`);
        wr.end();
    }

    @log()
    @route("/app.js","get")
    async serveBundleJS(r: Request, wr: Response) {
        wr.setHeader("Content-Type","application/javascript");
        wr.write(cfg.appjs);
        wr.end();
    }

    @log()
    @route("/item", "post")
    async insertItem(r: Request, wr: Response) {
        // TODO
    }

}
