import express, {Request, Response} from "express";
import {config} from "./config";
import {db} from "./main";

const cfg = new config();

export const router = express.Router();

router.get("/", async (r: Request, wr: Response)=> {
    console.log(cfg.template);
    wr.write(`${cfg.template}`);
    wr.end();
});

router.get("/items", async (r: Request, wr: Response)=> {
    db.getConnection((err,conn)=> {
        conn.query(JSON.parse(cfg.schema).queries?.select.all_items,(err,result,fields)=> {
            if (err) throw err;
            console.log(result);
        });
        conn.release();
    });
    wr.setHeader("Content-Type","application/json");
    wr.write(cfg.schema);
    wr.end();
});

router.get("/app.js", async (r: Request, wr: Response)=> {
    wr.setHeader("Content-Type","application/javascript");
    wr.write(cfg.appjs);
    wr.end();
});