import * as fs from 'fs';
import * as dotenv from "dotenv";
import { db } from './main';

dotenv.config();

export class config {
    public schema: any = {};
    public template: string = "";
    public appjs: string = "";

    constructor() {
        fs.readFile(process.env.DB_Q as string,'utf8',(err,data)=>{
            if(data === undefined) {
                console.log(`schema read fail ${err?.message}`);
                return
            }
            this.schema = JSON.parse(data);
            try {
                this.migrate(this.schema.migrate_up);
            } catch(e) {
                console.log(`Migrate up failed ${err?.message}`);
            }
        });
        fs.readFile(process.env.ENTRYPOINT as string,'utf8',(err,data)=> {
            if(data === undefined) {
                console.log(`entrypoint read fail ${err?.message}`);
                return
            }
            this.template = data;
        });
        fs.readFile(process.env.JS_BUNDLE as string,'utf8',(err,data)=> {
            if(data === undefined) {
                console.log(`js bundle read fail ${err?.message}`);
                return
            }
            this.appjs = data;
        })

    }

    migrate(obj: any) {
        let keys = Object.keys(obj)
        keys.forEach((v,i)=>{
            console.log(`Creating table ${v}`);
            db.query(obj[v]);
        });
    }
}