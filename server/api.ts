import express, {NextFunction, Request, Response, Router} from "express";
import {config} from "./config";
import {db,s3Client} from "./main";
import {route, log} from "./decorators";
import { QueryError } from "mysql2";
import PoolConnection from "mysql2/typings/mysql/lib/PoolConnection";
import { compare, hash } from "./auth";
import * as jwt from "jsonwebtoken";
import SMTPConnection from "nodemailer/lib/smtp-connection";

const cfg = new config();

let connection: SMTPConnection = new SMTPConnection({
    port:parseInt(process.env.SMTP_PORT as string,10),
    host:process.env.SMTP_HOST as string,
    secure: true
});

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
            conn.release();
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

function verify(r: Request, wr: Response): boolean {
    try{
        if (jwt.verify(r.headers?.authorization?.split(' ')[1] as string,cfg.secret) === undefined) {
            wr.writeHead(403,"Forbidden");
            console.log('jwt invalid token')
            wr.end();
            return false;
        }
        return true;
    }catch(e:any){
        console.log(e);
        wr.writeHead(403,"Forbidden");
        console.log('jwt invalid token')
        wr.end();
        return false;
    }
}

function insertImage(r: Request, wr: Response, url: string) {
    let values = {
        item_id: r.body.item_id,
        url: url
    }
    db.getConnection((err,conn)=>{
        if(err){
            handleError(err,conn,wr);
            return;
        }
        conn.query(cfg.schema.queries?.insert?.image,values,(err,result,fields)=>{
            if(err){
                handleError(err,conn,wr);
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type","application/json");
            wr.write(JSON.stringify({result,values}));
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
        if(!verify(r,wr)) {
            return;
        }
        handleSelectAll(r,wr,'all_orders');
    }

    @log()
    async index(r: Request, wr: Response) {
        console.log(cfg.template);
        wr.write(`${cfg.template}`);
        wr.end();
    }

    /*
    @log()
    serveBundleJS(r: Request, wr: Response) {
        wr.setHeader("Content-Type","application/javascript");
        wr.write(cfg.appjs);
        wr.end();
    }
    */

    @log()
    async getItem(r: Request, wr: Response) {
        handleUrlParamReq(r,wr,'select','item');
    }

    @log()
    async getUser(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        handleUrlParamReq(r,wr,'select','user');
    }

    @log()
    async getUsers(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        handleSelectAll(r,wr,'all_users');
    }

    @log()
    async deleteItem(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        handleUrlParamReq(r,wr,'delete','item');
    }

    @log()
    async getOrder(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        handleUrlParamReq(r,wr,'select','order');
    }

    @log()
    async deleteOrder(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        handleUrlParamReq(r,wr,'delete','order');
    }

    @log()
    async postItem(r: Request, wr: Response) {
        let q: string = cfg.schema.queries.insert.item
        if(!verify(r,wr)) {
            return;
        }
        db.getConnection((err,conn)=>{
            conn.query(q ,r.body ,(err,result,fields)=>{
                if(err){
                    handleError(err,conn,wr)
                    return;
                }
                wr.write(JSON.stringify(result));
                conn.release();
                wr.end();
            });
        });
    }

    @log()
    async patchItem(r: Request, wr: Response) {
        console.log(r.body);
        if(!verify(r,wr)) {
            return;
        }
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
                conn.release();
                wr.end();
            });
        });
    }

    @log()
    async postOrder(r: Request, wr: Response) {
        db.getConnection((err: Error, conn: PoolConnection)=>{
            handleError(err,conn,wr);
            conn.query(cfg.schema.queries.insert.order,r.body,(err,result,fields)=>{
                if(err) {
                    handleError(err,conn,wr);
                    return;
                }
                try{
                connection.connect((err)=>{
                    if(err) {
                        console.log("Connection error:",err);
                        return;
                    }
                    if(connection.alreadySecured) {
                        console.log('Secure connection to SMTP server established');
                    }
                    connection.login({credentials:{user:process.env.SMTP_USER as string,pass:process.env.SMTP_PASS as string}},(err)=>{
                        if(err) {
                            console.log("Login error:",err);
                            return;
                        }
                        console.log(r.body);
                        let details = JSON.parse(r.body.details);
                        let units = "";
                        for(let i=0;i<details.items.length;i++) {
                            units += `\n
                            Name: ${details?.items[i]?.name} Price/unit: ${details?.items[i]?.price} Amount: ${details?.items[i]?.count} \n`
                        } 
                        connection.send({
                            from:process.env.SMTP_USER as string,
                            to:details.email,
                        },`Subject: Order ${r.body.name} 
                        \n\n\n
                        Transaction status: ${details.transaction.details.status} \n
                        Transaction ID: ${details.transaction.details.id} \n
                        Details:
                        ${units} \n
                        Total: ${details?.total} ${details?.transaction?.details?.purchase_units[0]?.amount?.currency_code} \n
                        `
                        ,(err,info)=>{
                            if(err) {
                                console.log("Send error:",err);
                            }
                            console.log(info);
                            connection.quit();
                        });
                    });
                });
                } catch(e:any) {console.log(e.message)}
                console.log(result);
                wr.setHeader("Content-Type","application/json");
                wr.write(JSON.stringify(result));
                conn.release();
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
                conn.release();
                wr.end();
            });
        });
    }

    @log()
    async login(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err,conn)=>{
            if(err || !r.body.username || !r.body.password) {
                console.log(err);
                err ? wr.writeHead(500,'Internal server error') : wr.writeHead(403,'Invalid credentials');
                wr.end();
                return;
            }
            conn.query(cfg.schema.queries.select.login,r.body.email,(err,result: any,fields)=>{
                if (err) {
                    console.log(err);
                    wr.writeHead(403,'Forbidden');
                    wr.end();
                    return;
                }
                if (result[0].password !== undefined && compare(r.body?.password,result[0].password)) {
                    let token = jwt.sign({id:result.id,email:result.email},cfg.secret);
                    wr.setHeader("Content-Type","application/json");
                    wr.write(JSON.stringify({Authorization: token}));
                    wr.end();
                } else {
                    wr.writeHead(403,"Forbidden")
                    wr.end()
                }
                conn.release();
            });
        });
    }

    @log()
    async register(r: Request, wr: Response) {
        console.log(r.body);
        db.getConnection((err: Error, conn: PoolConnection)=>{
            if(err || !r.body.password) {
                console.log(err);
                err ? wr.writeHead(500,'Internal server error') : wr.writeHead(403,'No password provided');
                wr.end();
                return;
            };
            r.body.password = hash(r.body.password.trimLeft().trimRight());
            conn.query(cfg.schema.queries.insert.user,{email:r.body.email,password:r.body.password,role:0},(err,result,fields)=>{
                if(err) {
                    console.log(err);
                    wr.writeHead(403,'Forbidden');
                    wr.end();
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

    @log() // local server filesystem
    async uploadImages(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        console.log(r);
        insertImage(r,wr,`/images/${r.file?.filename}`);
    }

    @log() // S3 compatible storage
    async uploadImagesS3(r: Request, wr: Response) {
        if(r.file && verify(r,wr)) {
            console.log(r.file);
            try {
                await s3Client.putObject(process.env.S3_BUCKET as string,r.file?.originalname,r.file?.buffer);
                const url = await s3Client.presignedGetObject(process.env.S3_BUCKET as string,r.file?.originalname);
                insertImage(r,wr,url);
            } catch(e:any) {
                console.log('uploadImagesS3 failed:',e);
            }
        }
    }

    @log()
    async verify(r: Request, wr: Response) {
        if(!verify(r,wr)) {
            return;
        }
        wr.write(JSON.stringify({status:'valid'}));
        wr.end();
    }
}
