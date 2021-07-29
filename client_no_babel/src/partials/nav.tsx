import * as React from 'react';
import { AppBar } from '../../node_modules/@material-ui/core/index';
import { Toolbar } from '../../node_modules/@material-ui/core/index';
import { Typography } from '../../node_modules/@material-ui/core/index';
import { List } from '../../node_modules/@material-ui/core/index';
import { ListItem } from '../../node_modules/@material-ui/core/index';
import { ListItemText } from '../../node_modules/@material-ui/core/index';
import { IconButton } from '../../node_modules/@material-ui/core/index';
import { Link } from 'react-router-dom';
import { Home, AccountCircle, HowToReg } from '../../node_modules/@material-ui/icons/index';
import "../css/nav.css";

class Nav extends React.Component {

    render() {
        return <div>
            <AppBar color="primary" position="static">
            <Toolbar>
                <Typography style={{color: "white"}}>React-Shop</Typography>&nbsp;&nbsp;&nbsp;
                <IconButton>
                    <Link to="/">
                    <Typography style={{color: "white"}}><Home />Home</Typography>
                    </Link>
                </IconButton>
                <IconButton>
                    <Link to="/login">
                    <Typography style={{color: "white"}}><AccountCircle />Login</Typography>
                    </Link>
                </IconButton>
                <IconButton>
                    <Link to="/register">
                    <Typography style={{color: "white"}}><HowToReg />Register</Typography>
                    </Link>
                </IconButton>
            </Toolbar>
            </AppBar>
            </div>

    }
}

export default Nav;