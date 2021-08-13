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
  
  const paypalScriptOptions: PayPalScriptOptions = {
    "client-id":
      "AaUpVv8WDVM5uezwsQo79K6YBKmqm3EeLSOx5TFTX4RM2_ephwW68aJ4_ASXYPjbI8OyuXchwgkQ7bRl",
    currency: "USD"
  };
  function Button() {
    /**
     * usePayPalScriptReducer use within PayPalScriptProvider
     * isPending: not finished loading(default state)
     * isResolved: successfully loaded
     * isRejected: failed to load
     */
    const [{ isPending }] = usePayPalScriptReducer();
    const paypalbuttonTransactionProps: PayPalButtonsComponentOptions = {
      style: { layout: "vertical" },
      createOrder(data:any, actions:any) {
        return actions.order.create({
          payer:{
            name:{
              given_name:data.given_name,
              surname:data.surname
            },
            email_address:data.email_address,
            payer_id:data.payer_id,
            phone:{
              phone_number:data.phone_number
            },
            address:{
              address_line_1:data.address_line_1, 
              address_line_2:data.address_line_2, 
              admin_area_2:data.admin_area_2, 
              admin_area_1:data.admin_area_1,
              postal_code:data.postal_code,
              country_code:data.country_code
            },
            tax_info:{
              tax_id:data.tax_id,
              tax_id_type:data.tax_id_type
            },
            birth_date:data.birth_date
          },
          purchase_units: [
            {
              amount: {
                value: data.total
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
        return actions.order.capture().then((details) => {
          alert(
            "Transaction completed by" +
              (details?.payer.name.given_name ?? "No details")
          );
  
          alert("Data details: " + JSON.stringify(data, null, 2));
        });
      }
    };
    return (
      <>
        {isPending ? <h2>Load Smart Payment Button...</h2> : null}
        <PayPalButtons {...paypalbuttonTransactionProps} />
      </>
    );
  }
 
class Checkout extends React.Component<any, any> {

    constructor(props: any) {
      super(props);
        let items = JSON.parse(sessionStorage.getItem('cart') as string | "") 
        let t = this.total(items);
        this.state = {
            total: t,
            orderName: "",
            loaded: false,
            items: items,
            given_name:"",
            surname:"",
            email_address:"",
            payer_id:"",
            phone_number:"",
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
    }

    total(items: Array<any>): number {
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
                        <TextField  fullWidth={true} type="text" name="given_name" label="Given name" value={this.state.given_name} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="text" name="surname" label="Surname" value={this.state.surname} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="email" name="email_address" label="Email address" value={this.state.email_address} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="text" name="phone" label="Phone number" value={this.state.phone_number} onChange={this.handleChange} />
                    </Grid>
                    <Grid id="checkout_column" item xs={12} md={6}>
                    <TextField  fullWidth={true} type="text" name="address1" label="Address1" value={this.state.address_line_1} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="text" name="address2" label="Address2" value={this.state.address_line_2} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="text" name="postalCode" label="Postal code" value={this.state.postal_code} onChange={this.handleChange} />
                        <TextField  fullWidth={true} type="text" name="countryCode" label="Country code" value={this.state.country_code} onChange={this.handleChange} />
                    </Grid>
                    </Grid>
                    <PayPalScriptProvider options={paypalScriptOptions}>
                        <Button />
                    </PayPalScriptProvider>
                </Card>
            </Grid>

        )

    }

}

export default Checkout;