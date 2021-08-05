import * as React from 'react';
import { TextField, Grid, Card, CardHeader, CardContent, CardActionArea, CardActions, Typography, IconButton, Button } from '../../node_modules/@material-ui/core/index';
import { HttpClient } from '../api.service';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

class Login extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: false
        }
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e:any){
        this.setState({[e?.target?.name]:e.target.value});
    }

    private emailMatch: RegExp = /(.*)\@(.*)\./g;
    login() {
        let client = new HttpClient('http://localhost:9003');
        console.log(this.state);
        if(this.state.password !== "" && this.state.email.match(this.emailMatch)) {
            client.login({email:this.state.email,password:this.state.password}).then((result:any)=>{
                console.log(result);
                sessionStorage.setItem('Authorization',result.data.Authorization);
                this.props.history.push('/');
            },(err)=>{
                this.setState({error:true});
            });
        } else {
            this.setState({error:true});
        }
    }
    
    render() {
        return <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
            <div id="">
            <Card>
                <CardContent>
                    <Grid item xs={12}
                                    container
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center">
                        <Typography component="h1" color="primary">Login</Typography>
                    </Grid>
                    <hr />
                    <br />
                    <form>
                    <Grid item xs={12}>
                        <TextField  fullWidth={true} type="email" name="email" label="Email" value={this.state.email} onChange={this.handleChange} />
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <TextField  fullWidth={true} type="password" name="password" label="Password" value={this.state.password} onChange={this.handleChange} />
                    </Grid>
                    </form>
                </CardContent>
                <Collapse in={this.state.error}>
                        <Alert severity="error" action={
                                        <IconButton aria-label="close" color="inherit" size="small"
                                        onClick={() => {this.setState({error: false});}}>
                                        <CloseIcon fontSize="inherit" /></IconButton>
                        }>Invalid credentials provided.</Alert>
                </Collapse>
                <Grid item xs={12}
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center">
                    <Button variant="outlined" onClick={this.login} color="primary">Submit</Button>
                    <br />
                </Grid>
            </Card>
            </div>
            </Grid>
       
    }
}

export default Login;