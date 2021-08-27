import * as fs from 'fs';
import * as dotenv from "dotenv";
import { db, testRun } from './main';
import { migrate as seedTestData } from './load.test.data';
import Pool from 'mysql2/typings/mysql/lib/Pool';

dotenv.config();

// Wait until the object is populated, wait() will return the object when it is populated;
function wait(obj: any, fn: any, checkInterval?: number): void {
    checkInterval ? checkInterval : checkInterval = 300;
    let i = setInterval(()=>{
        obj !== undefined ? (()=>{clearInterval(i); fn(obj);}) : null;
    }, checkInterval);
}

export class config {
    public schema: any = {};
    public template: string = "";
    public secret: string = "";

    constructor() {
        let data = fs.readFileSync(process.env.DB_Q as string,'utf8',);
        this.schema = JSON.parse(data);
        this.template = fs.readFileSync(process.env.ENTRYPOINT as string,'utf8');
        this.secret = process.env.SECRET as string;
        wait(db,(pool:Pool)=>{
            this.migrate(this.schema.migrate_up);
            testRun ? seedTestData(): null;
        });
    }

    migrate(obj: any) {
            let keys = Object.keys(obj)
            keys.forEach((v,i)=>{
                // console.log(`Creating table ${v}`);
                db.query(obj[v],(err,result,fields)=>{
                    if(err) {
                        // console.log(err.message);
                    }
                });
            });
    }
}