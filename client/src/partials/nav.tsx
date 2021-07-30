import * as React from 'react';
import { AppBar } from '../../node_modules/@material-ui/core/index';
import { Toolbar } from '../../node_modules/@material-ui/core/index';
import { Typography } from '../../node_modules/@material-ui/core/index';
import { List } from '../../node_modules/@material-ui/core/index';
import { ListItem } from '../../node_modules/@material-ui/core/index';
import { ListItemText } from '../../node_modules/@material-ui/core/index';
import { Button } from '../../node_modules/@material-ui/core/index';
import { Link } from 'react-router-dom';
import { Home, AccountCircle, HowToReg } from '../../node_modules/@material-ui/icons/index';
import "../css/nav.css";


class Nav extends React.Component {

    render() {
        return <div>
            <AppBar color="primary" position="sticky">
            <Toolbar>
                <Typography style={{color: "white"}}>React-Shop</Typography>&nbsp;&nbsp;&nbsp;
                <Button  variant="outlined">
                <Home style={{fill: "white"}} />
                    <Link to="/">
                    <Typography style={{color: "white"}}>Home</Typography>
                    </Link>
                </Button>&nbsp;
                <Button variant="outlined">
                <AccountCircle style={{fill: "white"}} color="secondary" />
                    <Link to="/login">
                    <Typography style={{color: "white"}}>Login</Typography>
                    </Link>
                </Button>&nbsp;
                <Button  variant="outlined">
                <HowToReg style={{fill: "white"}} color="secondary" />
                    <Link to="/register">
                    <Typography style={{color: "white"}}>Register</Typography>
                    </Link>
                </Button>
            </Toolbar>
            </AppBar>
            </div>

    }
}

export default Nav;