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

export function addToCart(item: any,count:number,instance: any) {
    let exists = (name:string, arr:Array<any>): false | number => {
        for(let i=0;i<arr.length;i++) {
            if(arr[i].name === name) {
                return i
            }
        }
        return false;
    }

    instance.setState({modalOpen:true});
    let cart = sessionStorage.getItem('cart');
    let c = [];
    if(cart !== null) {
        c = JSON.parse(cart);
    }
    item.count = count;
    let f = exists(item.name,c);
    console.log(f,'exists')
    if(f === false) {
        c.push(item);
    } else {
        c[f].count += 1;
    }
    sessionStorage.setItem('cart',JSON.stringify(c));
}

export function checkout(instance:any) {
    instance.setState({modalOpen:false});
}

export function close(instance:any) {
    instance.setState({modalOpen:false});
}

export function loadCart() {
    if(sessionStorage.getItem('cart') == null) {
        return <li>No items in the cart.</li>
    }
    let c = JSON.parse(sessionStorage.getItem('cart') as string);
    let total = 0;
    c.forEach((v:any)=>{
        total += v.price *v.count;
    });
    let liArr: Array<any> = [];
    c.map((item:any)=>{
        liArr.push( <li>{item.name} x {item.count} pcs.</li>);
    })
    return (
        <div>
        {liArr}
        <hr />
        Total: $ {total}
        </div>

    )
}

export function renderModal(instance:any) {
    return <Dialog open={instance.state.modalOpen} onClose={()=>close(instance)}>   
                        <Card>
                        <CardContent>
                            <Typography>Shopping cart</Typography>
                            <hr />
                            <ul>
                                {loadCart()}
                            </ul>
                        </CardContent>
                        <CardActionArea>
                        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                            <Button onClick={()=>close(instance)} color='primary' variant="outlined"><CloseIcon></CloseIcon> Close</Button>
                            <Button onClick={()=>checkout(instance)} color='primary' variant="outlined"><ShoppingCartIcon></ShoppingCartIcon> Checkout</Button>
                        </ButtonGroup>
                        </CardActionArea>
                        </Card>
                    </Dialog>
}