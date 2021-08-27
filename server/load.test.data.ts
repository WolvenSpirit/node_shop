import {db} from './main';
import * as fs from "fs";
import { RowDataPacket } from 'mysql2';
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection';

export function migrate() {
    let q = JSON.parse(fs.readFileSync('./test/test_seed.sql').toString());
    db.getConnection((err:any,conn:PoolConnection)=>{
        if(err) {
            console.log(err.message);
            return;
        }
        conn.beginTransaction((err:any)=>{
            if(err) {
                console.log(err.message);
                conn.release();
                return;
            }
            q.forEach((insert:string)=>{
                conn.query(insert,(err,result:RowDataPacket)=>{
                    if(err) {
                        console.warn(err.message);
                        conn.rollback(()=>{
                            conn.release();
                        });
                        return;
                    }
                    // console.log(result);
                });
            });
        });
        conn.commit((err:any)=>err ? console.log(err.message) : console.log("test migrate success"));
    });

}