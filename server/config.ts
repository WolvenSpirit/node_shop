import * as fs from 'fs';
import * as dotenv from "dotenv";
import { db } from './main';

dotenv.config();

export class config {
    public schema: any = {};
    public template: string = "";
    // public appjs: string = "";
    public secret: string = "";

    constructor() {
        let data = fs.readFileSync(process.env.DB_Q as string,'utf8',);
        this.schema = JSON.parse(data);
        this.template = fs.readFileSync(process.env.ENTRYPOINT as string,'utf8');
        // this.appjs = fs.readFileSync(process.env.JS_BUNDLE as string,'utf8');
        this.secret = process.env.SECRET as string;
        this.migrate(this.schema.migrate_up);
    }

    migrate(obj: any) {
        setTimeout(()=> {
            let keys = Object.keys(obj)
            keys.forEach((v,i)=>{
                console.log(`Creating table ${v}`);
                db.query(obj[v],(err,result,fields)=>{
                    if(err) {
                        console.log(err.message);
                    }
                });
            });
        },3000)

    }
}