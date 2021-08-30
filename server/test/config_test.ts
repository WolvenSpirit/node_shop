import {expect, should} from 'chai';
import chai from 'chai';
import assert from "assert";
import { config } from '../config';
import { db, setDbMock } from '../main';
import { mysqlMock } from './mysqlMock';

let cfg:any;

before(()=>{
    cfg = new config();
    setDbMock(new mysqlMock(undefined,{},[]));
});

describe('Config tests',()=>{
    it('migrate', () => {
        assert.ifError(cfg.migrate(cfg.schema.migrate_up));
    });
})
