import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import { loadCart } from './cart.service';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
  } from "@paypal/react-paypal-js";
  import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
  import { PayPalButtonsComponentOptions } from "@paypal/paypal-js/types/components/buttons";
import { ButtonGroup, IconButton, TextField } from '@material-ui/core';
import { isTemplateSpan } from 'typescript';
import "../css/checkout.css";
import { HttpClient } from '../api.service';
import { baseURL } from '../config';
import CircularProgress from '@material-ui/core/CircularProgress';

var total:any;
var payer:any;
var redirectHook = (data:any) => {};
 
class Checkout extends React.Component<any, any> {
  private client: HttpClient = new HttpClient(baseURL);
  private paypalbuttonTransactionProps: PayPalButtonsComponentOptions = {
    style: { layout: "vertical" },
    createOrder(data:any, actions:any) {
      return actions.order.create({
        payer:{
          name:{
            given_name:payer.given_name,
            surname:payer.surname
          },
          email_address:payer.email_address,
          payer_id:payer.payer_id,
          phone:{
            phone_number:payer.phone
          },
          address:{
            address_line_1:payer.address_line_1, 
            address_line_2:payer.address_line_2, 
            admin_area_2:payer.admin_area_2, 
            admin_area_1:payer.admin_area_1,
            postal_code:payer.postal_code,
            country_code:payer.country_code
          },
          tax_info:{
            tax_id:payer.tax_id,
            tax_id_type:payer.tax_id_type
          },
          birth_date:payer.birth_date
        },
        purchase_units: [
          {
            amount: {
              value: total
            }
          }
        ]
      });
    },

  };

  private paypalScriptOptions: PayPalScriptOptions = {
    "client-id":
      "AaUpVv8WDVM5uezwsQo79K6YBKmqm3EeLSOx5TFTX4RM2_ephwW68aJ4_ASXYPjbI8OyuXchwgkQ7bRl",
    currency: "USD"
  };

    constructor(props: any) {
      super(props);
        let items = JSON.parse(sessionStorage.getItem('cart') as string | "");
        if(items === null) {
          items = [];
        }
        let t = this.total(items);
        total = t;
        this.state = {
            total: t,
            orderName: "",
            loaded: false,
            items: items,
            given_name:"",
            surname:"",
            email_address:"",
            payer_id:"",
            phone:"",
            address_line_1:"", 
            address_line_2:"", 
            admin_area_2:"", 
            admin_area_1:"",
            postal_code:"",
            country_code:"",
            tax_id:"",
            tax_id_type:"",
            birth_date:""
        }
        this.handleChange = this.handleChange.bind(this);
        redirectHook = (data:any) => {
          this.client.postOrder(data).then((response:any)=>{
            this.props.history.push("/paid");  
          });
        }
    }

    total(items: Array<any>): number {
      if(!items || items.length === 0) {
        return 0;
      }
      let t = 0;
      items.forEach((item:any)=>{
        t += item?.price * item?.count;
      });
      return t
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    handleChange(e:any){
      this.setState({[e?.target?.name]:e.target.value});
      payer = this.state;
  }

    subItem(name:string) {
      for(let i=0;i<this.state.items.length;i++) {
        if(this.state.items[i].name === name) {
          if(this.state.items[i].count>0) {
            this.state.items[i].count -= 1;
          }
        }
      }
      let t = this.total(this.state.items);
      total = t;
      sessionStorage.setItem('cart',JSON.stringify(this.state.items));
      this.setState({items:this.state.items,total:t});
    }
    addItem(name:string) {
      for(let i=0;i<this.state.items.length;i++) {
        if(this.state.items[i].name === name) {
          this.state.items[i].count += 1;
        }
      }
      let t = this.total(this.state.items);
      total = t;
      sessionStorage.setItem('cart',JSON.stringify(this.state.items));
      this.setState({items:this.state.items,total:t});
    }
    removeItem(name:string) {
      let arr = [];
      for(let i=0;i<this.state.items.length;i++) {
        if(this.state.items[i].name !== name) {
          arr.push(this.state.items[i]);
        }
      }
      let t = this.total(arr);
      total = t;
      this.setState({items:arr,total:t});
      sessionStorage.setItem('cart',JSON.stringify(arr)); 
    }

    render() {

        return (

            <Grid container
                  direction="row"
                  justifyContent="center"
                  spacing={1}>
                    <br />
                <Card id="checkout">
                  <br />
                  <Typography>&nbsp;Checkout</Typography>
                  <Grid container>
                  <Grid id="checkout_item_name" item xs={12} md={6}>
                    { this.state.items.map((item:any)=>{
                    return ( <a> 
                    <ButtonGroup fullWidth={false} id="bgroup" variant="contained" color="primary" aria-label="contained primary button group">
                        <b id="checkout_item_name">&nbsp; <Link to={`/item/${item.id}`}> {item.name} </Link></b>&nbsp;
                        <IconButton size="small" onClick={()=>this.addItem(item.name)} >+</IconButton> 
                        <IconButton size="small" disabled>{item.count}</IconButton>
                        <IconButton size="small" onClick={()=>this.subItem(item.name)} >-</IconButton>
                        <IconButton size="small" onClick={()=>this.removeItem(item.name)} ><DeleteIcon /></IconButton>
                    </ButtonGroup><br />
                    </a>);
                    })}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>&nbsp;Total amount due:<b> $ {this.state.total}</b></Typography>
                    </Grid>
                    </Grid>
                    <Grid container alignContent="center">
                    <Grid id="checkout_column" item xs={12} md={6}>
                        <TextField id="i1" fullWidth={true} type="text" name="given_name" label="Given name" value={this.state.given_name} onChange={this.handleChange} />
                        <TextField id="i2" fullWidth={true} type="text" name="surname" label="Surname" value={this.state.surname} onChange={this.handleChange} />
                        <TextField id="i3" fullWidth={true} type="email" name="email_address" label="Email address" value={this.state.email_address} onChange={this.handleChange} />
                        <TextField id="i4" fullWidth={true} type="text" name="phone" label="Phone number" value={this.state.phone} onChange={this.handleChange} />
                    </Grid>
                    <Grid id="checkout_column" item xs={12} md={6}>
                        <TextField id="i5" fullWidth={true} type="text" name="address_line_1" label="Address1" value={this.state.address_line_1} onChange={this.handleChange} />
                        <TextField id="i6" fullWidth={true} type="text" name="address_line_2" label="Address2" value={this.state.address_line_2} onChange={this.handleChange} />
                        <TextField id="i7" fullWidth={true} type="text" name="postal_code" label="Postal code" value={this.state.postal_code} onChange={this.handleChange} />
                        <TextField id="i8" fullWidth={true} type="text" name="country_code" label="Country code" value={this.state.country_code} onChange={this.handleChange} />
                    </Grid>
                    </Grid>
                    <PayPalScriptProvider options={this.paypalScriptOptions}>
                        <PayPalButtons {...{
                          createOrder(data:any,actions:any) {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: total
                                  }
                                }
                              ]
                            });
                          },
                          onApprove(data, actions) {
                            /**
                             * data: {
                             *   orderID: string;
                             *   payerID: string;
                             *   paymentID: string | null;
                             *   billingToken: string | null;
                             *   facilitatorAccesstoken: string;
                             * }
                             */
                            sessionStorage.removeItem('cart');
                            return actions.order.capture().then((details) => {
                              let transaction =  {details,data};
                              payer.transaction = transaction;
                              redirectHook({name:data.orderID,details:JSON.stringify(payer),total_price:total,paid:1});
                            });
                          }
                        }} />
                    </PayPalScriptProvider>
                </Card>
            </Grid>

        )

    }
    
}

export default Checkout;