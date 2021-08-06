import * as React from 'react';
import { AppBar } from '../../node_modules/@material-ui/core/index';
import { Toolbar } from '../../node_modules/@material-ui/core/index';
import { Typography } from '../../node_modules/@material-ui/core/index';
import { List } from '../../node_modules/@material-ui/core/index';
import { ListItem } from '../../node_modules/@material-ui/core/index';
import { ListItemText } from '../../node_modules/@material-ui/core/index';
import { Button, ButtonGroup } from '../../node_modules/@material-ui/core/index';
import { Link, withRouter } from 'react-router-dom';
import { Home, AccountCircle, HowToReg, ExitToApp, ThumbUpTwoTone } from '../../node_modules/@material-ui/icons/index';
import "../css/nav.css";
import AuthGuard from '../guard';

class Nav extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {}
    }

    lr() {
       if(sessionStorage.getItem('verified') !== 'true') {
           return (
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Button  variant="outlined">
            <Home style={{fill: "white"}} />
                <Link to="/">
                <Typography style={{color: "white"}}>Home</Typography>
                </Link>
            </Button>&nbsp;
            <AuthGuard>
            <Button variant="outlined">
            <AccountCircle style={{fill: "white"}} color="secondary" />
                <Link to="/login">
                <Typography style={{color: "white"}}>Login</Typography>
                </Link>
            </Button></AuthGuard>&nbsp;
            <AuthGuard>
            <Button  variant="outlined">
            <HowToReg style={{fill: "white"}} color="secondary" />
                <Link to="/register">
                <Typography style={{color: "white"}}>Register</Typography>
                </Link>
            </Button>
            </AuthGuard>
            </ButtonGroup>
           )
       } 
       return (
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
        <Button  variant="outlined">
        <Home style={{fill: "white"}} />
            <Link to="/">
            <Typography style={{color: "white"}}>Home</Typography>
            </Link>
        </Button>
        <Button onClick={()=>{
            sessionStorage.setItem('verified','');
            sessionStorage.setItem('Authorization','');
            this.props.history.push('/');
            }} variant="outlined">
        <ExitToApp style={{fill: "white"}} />
            <Typography style={{color: "white"}}>Logout</Typography>
        </Button>
        </ButtonGroup>
       )
    }

    render() {
        return <div>
            <AppBar color="primary" position="sticky">
            <Toolbar>
            </Toolbar>
            </AppBar>
            <AppBar color="primary" id='nav' position="sticky">
            <Toolbar>
                <Typography style={{color: "white"}}>React-Shop</Typography>&nbsp;&nbsp;&nbsp;
                <AuthGuard>
                {this.lr()}
                </AuthGuard>
            </Toolbar>
            </AppBar>
            </div>

    }
}

export default withRouter(Nav);