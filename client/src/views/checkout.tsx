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
import { ButtonGroup, IconButton } from '@material-ui/core';
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
      createOrder(data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: "0.01"
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
            items: items
        }
    }

    total(items: Array<any>): number {
      let t = 0;
      items.forEach((item:any)=>{
        t += item?.amount * item?.count;
      });
      return t
    }

    componentDidMount() {
        this.setState({loaded:true});
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
      this.setState({items:this.state.items,total:t});
    }
    addItem(name:string) {
      for(let i=0;i<this.state.items.length;i++) {
        if(this.state.items[i].name === name) {
          this.state.items[i].count += 1;
        }
      }
      let t = this.total(this.state.items);
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
                <Card>
                  <br />
                  <Typography>&nbsp;Checkout</Typography>
                    { this.state.items.map((item:any)=>{
                    return ( <a> 
                    <ButtonGroup fullWidth={true} id="bgroup" variant="contained" color="primary" aria-label="contained primary button group">
                        <b id="checkout_item_name">&nbsp; <Link to={`/item/${item.id}`}> {item.name} </Link></b>&nbsp;
                        <IconButton size="small" onClick={()=>this.addItem(item.name)} >+</IconButton> 
                        <IconButton size="small" disabled>{item.count}</IconButton>
                        <IconButton size="small" onClick={()=>this.subItem(item.name)} >-</IconButton>
                        <IconButton size="small" onClick={()=>this.removeItem(item.name)} ><DeleteIcon /></IconButton>
                    </ButtonGroup><br /><hr />
                    </a>);
                    })}
                    <PayPalScriptProvider options={paypalScriptOptions}>
                        <Button />
                    </PayPalScriptProvider>
                </Card>
            </Grid>

        )

    }

}

export default Checkout;