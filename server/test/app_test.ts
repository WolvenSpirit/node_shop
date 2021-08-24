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

        describe("POST /login", () => {
            it("Serve the login view", (done) => {
                 let agent = chai.request(app);
                      agent.post('/login').end((err, res) => {
                        if(err) {
                            console.log(err.message);
                        }
                          res.should.have.status(403);
                          done();
                       });

             });
        });

        describe("POST /register", () => {
            it("Serve the register view", (done) => {
                 let agent = chai.request(app);

                      agent.post('/register').end((err, res) => {
                          if(err) {
                              console.log(err.message);
                          }
                          res.should.have.status(403);
                          done();
                       });

             });
        });
    
    });


after(async ()=>{
    server.close();
    shutdown();
});
