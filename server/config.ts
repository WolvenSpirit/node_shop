import * as fs from 'fs';

export class config {
    public schema: string = "";
    public template: string = "";
    public appjs: string = "";

    constructor() {
        fs.readFile("./schema.json",'utf8',(err,data)=>{
            if(err) throw err;
            if(data === undefined) {
                console.log("schema json read fail");
                return
            }
            this.schema = data;
        });
        fs.readFile("./bin/client_build/index.html",'utf8',(err,data)=> {
            if(data === undefined) {
                console.log("index.html read fail");
                return
            }
            this.template = data;
        });
        fs.readFile("./bin/client_build/js/app.js",'utf8',(err,data)=> {
            if(data === undefined) {
                console.log("app.js read fail");
                return
            }
            this.appjs = data;
        })
    }
}