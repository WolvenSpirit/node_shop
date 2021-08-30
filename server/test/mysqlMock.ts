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
            if(typeof cb === 'function') {
                cb(this.err,this.result,this.fields);
            }
        }
        conn.release = () => {};
        return fn(err,conn)
    }

    removeAllListeners() {
        return
    }

    end() {
        return
    }

}