import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
  } from "@paypal/react-paypal-js";
  import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
  import { PayPalButtonsComponentOptions } from "@paypal/paypal-js/types/components/buttons";
  
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
        this.state = {
            total: 0,
            orderName: "",
            loaded: false
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    renderPayPalButton() {
        if(this.state.loaded === true) {
            return (
                <div></div>
            )
        }
        return <div>Loading checkout button</div>
    }

    render() {

        return (

            <Grid container>
                <Card>
                    <Typography>Checkout</Typography>
                    <hr />
                    <PayPalScriptProvider options={paypalScriptOptions}>
                        <Button />
                    </PayPalScriptProvider>
                </Card>
            </Grid>

        )

    }

}

export default Checkout;