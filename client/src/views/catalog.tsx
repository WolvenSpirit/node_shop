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

class Catalog extends React.Component<any, any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            list: [],
            loaded: false,
            modalOpen: false,
            open: false.valueOf,
            cartItems: []
        }
        this.addToCart = this.addToCart.bind(this);
        this.checkout = this.checkout.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
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

    addToCart(item: any) {
        this.setState({modalOpen:true});
    }

    checkout() {
        this.setState({modalOpen:false});
    }

    close() {
        this.setState({modalOpen:false})
    }

    render() {
        if(!this.state.loaded){
            return <Paper>Loading ...</Paper>
        } else {
            return (
                <Grid container
                    direction="row"
                    justifyContent="center"
                    spacing={4}>
                    <Dialog open={this.state.modalOpen} onClose={this.addToCart}>   
                        <Card>
                        <CardContent>
                            <Typography>Shopping cart</Typography>
                            <hr />
                            <ul>
                                {this.state.cartItems.map((item:any)=>{
                                    return <li>{item.name} x {item.quantity}</li>
                                })}
                            </ul>
                        </CardContent>
                        <CardActionArea>
                            <Button onClick={this.close} variant="outlined"><CloseIcon></CloseIcon> Close</Button><Button onClick={this.checkout} variant="outlined"><ShoppingCartIcon></ShoppingCartIcon> Checkout</Button>
                        </CardActionArea>
                        </Card>
                    </Dialog>
                    {this.state.list.map((item:any,k:number)=>{
                        return  <Grid item xs={8} sm={4}>
                        <Card id="paper">
                            <div id="paper__custom">
                            {JSON.parse(item.images).map((im:string,i:any)=>{
                                if(i===0){
                                    return <img height="100" width="150" src={im} id={i}></img>
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
                            <Button size='small' onClick={this.addToCart} id="button" variant="outlined"><AddShoppingCartIcon></AddShoppingCartIcon> Add to cart</Button>
                            <Button size='small' onClick={()=>{this.props.history.push(`/item/${item.id}`)}} id="button" variant="outlined"><DetailsIcon></DetailsIcon> Details</Button>
                            <Button size='small' onClick={()=>{this.props.history.push(`/add/item/${item.id}`)}} id="button" variant="outlined"><MoreVertIcon></MoreVertIcon></Button>
                            </ButtonGroup>
                        </Grid>
                        </CardActionArea>
                        </Card>
                      </Grid>
                    })}
                </Grid>
            )
        }
    }

}

export default Catalog;