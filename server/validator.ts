import { validate } from "./decorators";

export class validateData {

@validate() public data: any;

    constructor(data: any) {
        this.data = data;
        // TODO
    }
    
}