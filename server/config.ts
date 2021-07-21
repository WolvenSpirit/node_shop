import * as fs from 'fs';
import * as dotenv from "dotenv";

dotenv.config();

export class config {
    public schema: string = "";
    public template: string = "";
    public appjs: string = "";

    constructor() {
        fs.readFile(process.env.DB_Q as fs.PathLike,'utf8',(err,data)=>{
            if(err) throw err;
            if(data === undefined) {
                console.log("schema read fail");
                return
            }
            this.schema = data;
        });
        fs.readFile(process.env.ENTRYPOINT as fs.PathLike,'utf8',(err,data)=> {
            if(data === undefined) {
                console.log("entrypoint read fail");
                return
            }
            this.template = data;
        });
        fs.readFile(process.env.JS_BUNDLE as fs.PathLike,'utf8',(err,data)=> {
            if(data === undefined) {
                console.log("js bundle read fail");
                return
            }
            this.appjs = data;
        })
    }
}