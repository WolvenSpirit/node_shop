import * as React from 'react';
import { TextField, Grid, Card, CardHeader, CardContent, CardActionArea, CardActions, Typography, IconButton, Button } from '../../node_modules/@material-ui/core/index';

class Login extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
        this.login = this.login.bind(this);
    }

    login() {
        console.log(this.state);
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
                    <Grid item xs={12}>
                        <TextField label="Email" value={this.state.email} InputLabelProps={{shrink:true}} />
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <TextField label="Password" value={this.state.password} InputLabelProps={{shrink:true}}/>
                    </Grid>
                </CardContent>
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