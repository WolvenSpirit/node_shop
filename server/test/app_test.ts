import {expect} from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'request';
import * as dotenv from "dotenv";
import {app, db, server, shutdown, setDbMock} from '../main';
import mysql from "mysql2";

dotenv.config();

chai.use(chaiHttp);
chai.should();

    describe("React-Shop", () => {
        setDbMock(mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string,10),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }));
        describe("GET /", () => {
            it("Serve the front-end app", (done) => {
                 let agent = chai.request(app);

                      agent.get('/').end((err, res) => {
                          res.should.have.status(200);
                          done();
                       });

             });
        });

        describe("POST /login no credentials = 403", () => {
            it("Fail to login", (done) => {
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

        describe("POST /loginwith credentials = 200", () => {
            it("Authenticate successfully", (done) => {
                setDbMock(mysql.createPool({
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT as string,10),
                    database: process.env.DB_NAME,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD
                }));
                 let agent = chai.request(app);
                      agent.post('/login').set('Content-Type','application/json').send(JSON.stringify({email:"admin3@mail.com",password:"toor"})).end((err, res) => {
                        if(err) {
                            console.log(err.message);
                        }
                          res.should.have.status(200);
                          done();
                       });
             });
        });

        describe("POST /register no credentials = 403", () => {
            it("Fail to register", (done) => {
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

        describe("POST /register valid = 200", () => {
            it("Successfully register", (done) => {
                 let agent = chai.request(app);
                    let c = ['a','b','c','d','e','f','h','i','j'];
                    let randFakeEmail = () => {
                        let s = "";
                        for(let char of c){s += c[Math.round(Math.random()*c.length)]}
                        return [s+"@mail.com",s];
                    }
                    let creds = randFakeEmail();
                      agent.post('/register').set('Content-Type','application/json').send({email:creds[0],password:creds[1]}).end((err, res) => {
                          if(err) {
                              console.log(err.message);
                          }
                          console.log(res);
                          res.should.have.status(200);
                          done();
                       });

             });
        });
    
    });


after(async ()=>{
    server.close();
    shutdown();
    db.end();
});
