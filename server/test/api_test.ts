import {expect, should} from 'chai';
import chai from 'chai';
import * as dotenv from "dotenv";
import {_api,setDbMock, db} from '../main';
import * as mock from "node-mocks-http";
import assert from "assert";
import {mysqlMock} from './mysqlMock';
import { handleError, handleSelectAll, handleUrlParamReq, cfg } from "../api";

before(()=>{
    setDbMock(new mysqlMock(null,'{}',[]));
});

it('Login mocked pass through',()=>{
    const req = mock.createRequest({url:'/login'})
    const res = mock.createResponse();
    _api.login(req,res);
    assert(res.status.toString,'200');
});

it('Register mocked pass through',()=>{
    const req = mock.createRequest({url:'/register'})
    const res = mock.createResponse();
    _api.login(req,res);
    assert(res.status.toString,'200');
});

it('getItems mock',()=>{
    const req = mock.createRequest({url:'/items'})
    const res = mock.createResponse();
    _api.getItems(req,res);
    assert(res.status.toString,'200');
});

it('getOrders mock',()=>{
    const req = mock.createRequest({url:'/orders'})
    const res = mock.createResponse();
    _api.getOrders(req,res);
    assert(res.status.toString,'200');
});

it('getUsers mock',()=>{
    const req = mock.createRequest({url:'/orders'})
    const res = mock.createResponse();
    _api.getUsers(req,res);
    assert(res.status.toString,'200');
});

it('handleError mock - no err',()=>{
    const req = mock.createRequest({url:'/some-url'})
    const res = mock.createResponse();
    db.getConnection((err,conn)=>{
        handleError(undefined,conn,res);
    })
    assert(res.status.toString,'200');
});

it('handleError mock - err',()=>{
    const req = mock.createRequest({url:'/some-url'})
    const res = mock.createResponse();
    db.getConnection((err,conn)=>{
        handleError(new Error('some error'),conn,res);
    })
    assert(res.status.toString,'403');
});

it('handleSelectAll mock - err',()=>{
    const req = mock.createRequest({url:'/some-url'})
    const res = mock.createResponse();
    handleSelectAll(req,res,"items");
    assert(res.status.toString,'200');
});

it('handleUrlParamReq mock - err',()=>{
    setDbMock(new mysqlMock(null,'{}',[]));
    const req = mock.createRequest({url:'/some-url'});
    req.params = {id:"3"};
    const res = mock.createResponse();
    handleUrlParamReq(req,res,"select","orders");
    assert(res.status.toString,'200');
});