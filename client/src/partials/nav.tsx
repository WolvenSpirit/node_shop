import * as React from 'react';
import { AppBar } from '../../node_modules/@material-ui/core/index';
import { Toolbar } from '../../node_modules/@material-ui/core/index';
import { List } from '../../node_modules/@material-ui/core/index';
import { ListItem } from '../../node_modules/@material-ui/core/index';
import { ListItemText } from '../../node_modules/@material-ui/core/index';
import { Link, withRouter } from 'react-router-dom';
import { Home, AccountCircle, HowToReg, ExitToApp, ThumbUpTwoTone } from '../../node_modules/@material-ui/icons/index';
import "../css/nav.css";
import AuthGuard from '../guard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {addToCart,close,loadCart,checkout} from '../views/cart.service';
import { Button, ButtonGroup, Card, CardActionArea, CardContent, Paper, Typography } from '@material-ui/core';
import "../css/catalog.css";
import { baseURL } from '../config';
import Modal, { ModalProps } from '@material-ui/core/Modal';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

class Nav extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            open: false.valueOf(),
            modalOpen: false,
        }
    }

    componentDidMount() {
        document.addEventListener('loggedIn',(ev:Event)=>{
            this.setState(this.state);
        });
        document.addEventListener('loggedOut',(ev:Event)=>{
            this.setState(this.state);
        });
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
            <Button onClick={()=>{
                this.setState({modalOpen:true});
            }} variant="outlined">
            <ShoppingCartIcon style={{fill: "white"}} onClick={()=>{}} color="secondary" />
            <Typography style={{color: "white"}}>Cart</Typography>
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
        return <AuthGuard
        ><div>
            <AppBar color="primary" position="sticky">
            <Toolbar>
            </Toolbar>
            </AppBar>
            <AppBar color="primary" id='nav' position="sticky">
            <Toolbar>
                <Typography style={{color: "white"}}>React-Shop</Typography>&nbsp;&nbsp;&nbsp;
                
                {this.lr()}
                
            </Toolbar>
            </AppBar>

            <Dialog open={this.state.modalOpen} onClose={()=>close(this)}>   
                        <Card>
                        <CardContent>
                            <Typography>Shopping cart</Typography>
                            <hr />
                            <ul>
                                {loadCart()}
                            </ul>
                            <Button onClick={()=>{sessionStorage.removeItem('cart');close(this);}} color='primary' variant="outlined" size="small"><DeleteIcon></DeleteIcon> Remove all</Button>
                        </CardContent>
                        <CardActionArea>
                        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                            <Button onClick={()=>close(this)} color='primary' variant="outlined"><CloseIcon></CloseIcon> Close</Button>
                            <Button onClick={()=>checkout(this)} color='primary' variant="outlined"><ShoppingCartIcon></ShoppingCartIcon> Checkout</Button>
                        </ButtonGroup>
                        </CardActionArea>
                        </Card>
            </Dialog>

            </div>
            </AuthGuard>
    }
}

export default withRouter(Nav);