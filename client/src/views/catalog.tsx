import { any } from 'prop-types';
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { HttpClient } from '../api.service';
import { Button, ButtonGroup, Card, CardActionArea, CardContent, Paper, Typography } from '@material-ui/core';
import "../css/catalog.css";
import { baseURL } from '../config';
import Modal, { ModalProps } from '@material-ui/core/Modal';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CloseIcon from '@material-ui/icons/Close';
import DetailsIcon from '@material-ui/icons/Details';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AuthGuard from '../guard';
import {addToCart,close,loadCart,checkout} from './cart.service';
import DeleteIcon from '@material-ui/icons/Delete';

class Catalog extends React.Component<any, any, any> {

    constructor(props:any) {
        super(props);
            this.state = {
            list: [],
            loaded: false,
            modalOpen: false,
            open: false.valueOf(),
            cartItems: [],
            loggedIn: props.allow
        }
        //this.addToCart = this.addToCart.bind(this);
        //this.checkout = this.checkout.bind(this);
        //this.close = this.close.bind(this);
    }

    componentDidMount() {
        
        console.log(this.props);

        let client = new HttpClient();
        client.getItems().then((result:any)=>{
                let data = result.data;
                data.map((item:any)=>{
                    if(item.images == "[null]") /* "[null]" is garbage returned by no images in Join query */ {
                        console.log("null image found");
                        return item.images=JSON.stringify(["https://www.nicomatic.com/themes/custom/jango_sub/img/no-image.png"]);
                    } else {
                        let img = JSON.parse(item.images);
                        let m = img.map((v:string)=>{
                            return v=`${baseURL}${v}`});
                        return item.images = JSON.stringify(m);
                    }
                });
                console.log('loaded',data);
                this.setState({list:data,loaded:true});
        });
    }


    renderEditButton(item:any,f:boolean) {
        if(sessionStorage.getItem('verified') === 'true'){
            return <Button size='small' onClick={()=>{this.props.history.push(`/add/item/${item.id}`)}} id="button" variant="outlined"><MoreVertIcon></MoreVertIcon></Button>
        }
    }

    render() {
        if(!this.state.loaded){
            return <Paper>Loading ...</Paper>
        } else {
            return (
                <AuthGuard>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    spacing={4}>
                    <Dialog open={this.state.modalOpen} onClose={()=>close(this)}>   
                        <Card>
                        <CardContent>
                            <Typography>Shopping cart</Typography>
                            <hr />
                            <ul>
                                {loadCart()}
                            </ul>
                            <Button onClick={()=>{sessionStorage.removeItem('cart');close(this);}} color='primary' variant="text" size="small"><DeleteIcon></DeleteIcon> Remove all</Button>
                        </CardContent>
                        <CardActionArea>
                        <ButtonGroup fullWidth={true} variant="text" color="primary" aria-label="text primary button group">
                            <Button onClick={()=>close(this)} color='primary' variant="outlined"><CloseIcon></CloseIcon> Close</Button>
                            <Button onClick={()=>{checkout(this);this.props.history.push('/checkout');}} color='primary' variant="contained"><ShoppingCartIcon></ShoppingCartIcon> Checkout</Button>
                        </ButtonGroup>
                        </CardActionArea>
                        </Card>
                    </Dialog>
                    {this.state.list.map((item:any,k:number)=>{
                        return  <Grid item xs={8} sm={4}>
                        <Card id="paper">
                            <div id="paper__custom">
                            {JSON.parse(item.images).map((im:string,i:any)=>{
                                if(i===0){
                                    return <img height="100" width="150" key={`image_${k}_${i}`} src={im} id={i}></img>
                                }
                            })}
                            <h5 id="name">{item.name} <div id="price"><small id="dollar">$</small> {item.price}</div></h5>
                            </div><br />
                            <CardActionArea>
                            <Grid container
                            direction="row"
                            justifyContent="center"
                            spacing={1}>
                            
                            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button size='small' onClick={()=>{addToCart(item,1,this)}} id="button" variant="outlined"><AddShoppingCartIcon></AddShoppingCartIcon> Add to cart</Button>
                            <Button size='small' onClick={()=>{this.props.history.push(`/item/${item.id}`)}} id="button" variant="outlined"><DetailsIcon></DetailsIcon> Details</Button>
                            {this.renderEditButton(item,this.state.loggedIn)}
                            </ButtonGroup>
                        </Grid>
                        </CardActionArea>
                        </Card>
                      </Grid>
                    })}
                </Grid>
                </AuthGuard>
            )
        }
    }

}

export default Catalog;