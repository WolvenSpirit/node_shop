import { Button, CardActionArea, Container, IconButton, Typography } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { HttpClient } from '../api.service';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { baseURL } from '../config';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Modal, { ModalProps } from '@material-ui/core/Modal';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import {addToCart,close,loadCart,checkout} from '../views/cart.service';
import { ButtonGroup, CardContent, Paper } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

class Item extends React.Component<RouteComponentProps, any> {

    public id;
    public item: any;
    public images: Array<any> = [];
    constructor(props: any) {
        super(props);
        this.state = {
            item: null,
            loaded: false,
            open: false.valueOf(),
            modalOpen: false,
            count: 1
        }
        this.id = props.match.params.id;
    }

    componentDidMount() {
       let client = new HttpClient();
       client.getItem(this.id).then((result)=>{
        console.log(result);
        this.setState({item:result.data[0],loaded:true});
        if(this.state.item?.images !== undefined && this.state.item?.images !== undefined) {
            this.images = JSON.parse(this.state.item?.images).map((img:any,i:any)=>{
                return (
                   
                        <ImageListItem key={i} cols={1}>
                <img key={i} src={`${baseURL}${img}`} />
                        </ImageListItem>
 
                )
            });
            this.setState({loaded:true});
            }
       },(err)=>{
        console.log(err);
       });
    }

    render() {
            return <div>
            <Container maxWidth="sm">
            <Card> 
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <br />
                <Grid item xs={12}>
                    <h3>&nbsp;{this.state.item?.name}&nbsp;</h3>
                </Grid>
                <br />
                <Grid item xs={6} sm={11}>
                    <ImageList rowHeight={70} cols={5}>
                    {this.images}
                    </ImageList>
                </Grid>
                <hr />
                <Grid item xs={6} sm={11}>
                    &nbsp;{this.state.item?.description}&nbsp;
                </Grid>
                <Grid item xs={4} sm={3}>
                &nbsp;<h1>$ {this.state.item?.price}</h1>&nbsp;
                </Grid>
                <br />
            </Grid>
            
            <Dialog open={this.state.modalOpen} onClose={()=>close(this)}>   
                        <Card>
                        <CardContent>
                            <Typography>Shopping cart</Typography>
                            <hr />
                            <ul>
                                {loadCart()}
                            </ul>
                            <Button onClick={()=>{sessionStorage.removeItem('cart');close(this);}} color='primary' variant="outlined" size="small"><DeleteIcon></DeleteIcon> Remove all items</Button>
                        </CardContent>
                        <CardActionArea>
                        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                            <Button onClick={()=>close(this)} color='primary' variant="outlined"><CloseIcon></CloseIcon> Close</Button>
                            <Button onClick={()=>checkout(this)} color='primary' variant="outlined"><ShoppingCartIcon></ShoppingCartIcon> Checkout</Button>
                        </ButtonGroup>
                        </CardActionArea>
                        </Card>
                    </Dialog>

            <CardActionArea>           
                <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        <Button onClick={()=>this.setState({count: this.state.count+1})} >+</Button> 
                        <Button disabled variant='contained'>{this.state.count}</Button>
                        <Button onClick={()=>this.setState({count: this.state.count-1})} >-</Button>
                    </ButtonGroup>
                    <ButtonGroup variant="contained" color="secondary" aria-label="contained secondary  button group">
                <Button  onClick={()=>{
                    let item = {name:this.state.item.name,description:this.state.item.description,price: this.state.item.price,count:1};
                    addToCart(item,this.state.count,this)
                    }} variant="outlined">Add To Cart</Button>
                </ButtonGroup>
                </Grid>
            </CardActionArea>
            </Card>
            </Container>
        </div>
    }
}

export default withRouter(Item);