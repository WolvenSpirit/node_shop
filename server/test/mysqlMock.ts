export class mysqlMock {
    err:any;
    result:any;
    fields:any;
    constructor(err:any,result:any,fields:any) {
        this.err = err;
        this.result = result;
        this.fields = fields;
    }

    getConnection(fn: any) {
        var err,conn:any = {};
        conn.query = (query:any,params:any,cb:any) => {
            cb(this.err,this.result,this.fields);
        }
        return fn(err,conn)
    }

}