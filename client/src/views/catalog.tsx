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

class Cart extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

    }
    render() {
        return (<Card>
                <CardContent>
                    <Typography>Shopping cart</Typography>
                </CardContent>
                <CardActionArea>
                    <Button variant="outlined">Close</Button><Button variant="outlined">Checkout</Button>
                </CardActionArea>
                </Card>)
    }
}

class Catalog extends React.Component<any, any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            list: [],
            loaded: false,
            modalOpen: false,
            open: false
        }
        this.addToCart = this.addToCart.bind(this);
    }

    componentDidMount() {
        let client = new HttpClient();
        client.getItems().then((result:any)=>{
                let data = result.data;
                data.map((item:any)=>{
                    if(item.images == "[null]") /* "[null]" is garbage returned by no images in Join query */ {
                        console.log("null image found");
                        return item.images=JSON.stringify(["https://via.placeholder.com/150"]);
                    } else {
                        let img = JSON.parse(item.images);
                        img.map((v:string)=>{return v=`${baseURL}${v}`});
                        return item.images = JSON.stringify(img);
                    }
                });
                console.log('loaded',data);
                this.setState({list:data,loaded:true});
        });
    }

    addToCart(item: any) {
        // ...
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
                    <Dialog open={this.state.modalOpen} onClose={this.addToCart}><Cart></Cart></Dialog>
                    {this.state.list.map((item:any,k:number)=>{
                        return  <Grid item xs={4} sm={4}>
                        <Paper id="paper">
                            <div id="paper__custom">
                            {JSON.parse(item.images).map((im:string,i:any)=>{
                                if(i===0){
                                    return <img height="100" width="150" src={`${im}`} id={i}></img>
                                }
                            })}
                            <Typography id="name">{item.name}</Typography>
                            </div>
                            <Grid container
                            direction="row"
                            justifyContent="center"
                            spacing={4}>
                            <Typography component="h3" id="price"><small id="dollar">$</small> {item.price}</Typography>
                            &nbsp;&nbsp;&nbsp;<Button onClick={this.addToCart} variant="outlined">Add to cart</Button>
                            </Grid>
                        </Paper>
                      </Grid>
                    })}
                </Grid>
            )
        }
    }

}

export default Catalog;