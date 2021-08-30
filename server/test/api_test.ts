import {expect, should} from 'chai';
import chai from 'chai';
import * as dotenv from "dotenv";
import {_api,setDbMock} from '../main';
import * as mock from "node-mocks-http";
import assert from "assert";
import {mysqlMock} from './mysqlMock';

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