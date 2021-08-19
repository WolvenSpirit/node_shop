import {expect} from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'request';
import * as dotenv from "dotenv";
import {app, db, server, shutdown} from '../main';

dotenv.config();

chai.use(chaiHttp);
chai.should();

    describe("React-Shop", () => {
        describe("GET /", () => {
            it("Serve the front-end app", (done) => {
                 let agent = chai.request(app);

                      agent.get('/').end((err, res) => {
                          res.should.have.status(200);
                          done();
                       });

             });
        });

        describe("GET /login", () => {
            it("Serve the login view", (done) => {
                 let agent = chai.request(app);

                      agent.get('/').end((err, res) => {
                          res.should.have.status(200);
                          done();
                       });

             });
        });

        describe("GET /register", () => {
            it("Serve the register view", (done) => {
                 let agent = chai.request(app);

                      agent.get('/').end((err, res) => {
                          res.should.have.status(200);
                          done();
                       });

             });
        });
    });


after(async ()=>{
    server.close();
    shutdown();
});
