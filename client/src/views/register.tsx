import * as React from 'react';
import { TextField, Grid, Card, CardHeader, CardContent, CardActionArea, CardActions, Typography, IconButton, Button } from '../../node_modules/@material-ui/core/index';
import { HttpClient } from '../api.service';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

class Register extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password1: "",
            password2: "",
            error: false,
            passwordMissmatch: false,
            invalidEmail: false
        }
        this.register = this.register.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e:any){
        this.setState({[e?.target?.name]:e.target.value});
    }

    private emailMatch: RegExp = /(.*)\@(.*)\./g;
    register() {
        console.log(this.state);
        if(this.state.password1 !== this.state.password2){
            this.setState({passwordMissmatch:true});
            return;
        }
        if(this.state.email === "" || !this.state.email.match(this.emailMatch)) {
            this.setState({invalidEmail:true});
            return;
        }
        if(this.state.password1 === this.state.password2 && this.state.email !== "" && this.state.password1 !== "") {
        let client = new HttpClient('http://localhost:9003');
        client.register({email:this.state.email,password:this.state.password1}).then((result:any)=>{
            console.log(result);
            sessionStorage.setItem('Authorization',result.data.Authorization);
        },
        (err)=>{
            this.setState({error:true});
        });
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
                        <Typography component="h1" color="primary">Register</Typography>
                    </Grid>
                    <hr />
                    <br />
                    <form>
                    <Grid item xs={12}>
                        <TextField fullWidth={true} type="email" name="email" label="Email" value={this.state.email} onChange={this.handleChange} />
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <TextField fullWidth={true} type="password" name="password1" label="Password" value={this.state.password1} onChange={this.handleChange} />
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <TextField fullWidth={true} type="password" name="password2" label="Re-type Password" value={this.state.password2} onChange={this.handleChange} />
                    </Grid>
                    </form>
                </CardContent>
                <Collapse in={this.state.error}>
                        <Alert severity="error" action={
                                        <IconButton aria-label="close" color="inherit" size="small"
                                        onClick={() => {this.setState({error: false});}}>
                                        <CloseIcon fontSize="inherit" /></IconButton>
                        }>Account registration failed.</Alert>
                </Collapse>
                <Collapse in={this.state.passwordMissmatch}>
                        <Alert severity="error" action={
                                        <IconButton aria-label="close" color="inherit" size="small"
                                        onClick={() => {this.setState({passwordMissmatch: false});}}>
                                        <CloseIcon fontSize="inherit" /></IconButton>
                        }>Please type again the matching passwords.</Alert>
                </Collapse>
                <Collapse in={this.state.invalidEmail}>
                        <Alert severity="error" action={
                                        <IconButton aria-label="close" color="inherit" size="small"
                                        onClick={() => {this.setState({invalidEmail: false});}}>
                                        <CloseIcon fontSize="inherit" /></IconButton>
                        }>Please type in a valid email address.</Alert>
                </Collapse>
                <Grid item xs={12}
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center">
                    <Button variant="outlined" onClick={this.register} color="primary">Submit</Button>
                    <br />
                </Grid>
            </Card>
            </div>
            </Grid>
       
    }
}

export default Register;