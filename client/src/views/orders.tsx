import { Grid } from '@material-ui/core';
import { Card } from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { HttpClient } from '../api.service';
import { baseURL } from '../config';
import Authguard from '../guard';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

class Orders extends React.Component<any, any> {
    client: HttpClient;
    constructor(props: any) {
        super(props);
        this.state = {
            orders: [],
            loaded: false,
            details: []
        };
        this.client = new HttpClient(baseURL);
    }

    componentDidMount() {
        this.client.getOrders().then((response:any)=>{
            let details:any = [];
            for(let i=0;i<response.data.length;i++){
                console.log(JSON.parse(response.data[i].order_details));
                let o = JSON.parse(response.data[i].order_details)
                details.push(o);
            }
            this.setState({orders:response.data,loaded:true,details:details});
        },
        (err:any)=>{
            console.log(err);
        }).finally(()=>{
            console.log(this.state.details);
        });
    }

    render(): React.ReactNode {
        if(this.state.loaded) {
        return (
            <Authguard>
                <Grid container 
                    alignContent="center" 
                    alignItems="center"
                    direction="row">
                    {this.state.orders.map((o:any,k:number)=>{
                    return <Grid item xs={12} sm={6}>
                        <Card elevation={9} style={{padding: ".3em",borderSpacing: ".3em"}}>
                           ID: {o.order_id} <br /> Order name: {o.name} <br />  <small>{o.order_created_at}</small>
                           <br />
                           Total: {this.state.details[k].total} <br />
                           Transaction <br />
                           Payer name: {this.state.details[k].transaction.details.payer.name.given_name} {this.state.details[k].transaction.details.payer.name.surname} <br />
                           Payer ID: {this.state.details[k].transaction.details.payer.payer_id} <br />
                           Email: {this.state.details[k].transaction.details.payer.email_address} <br />
                        </Card><br></br>
                    </Grid>})}
                </Grid>
            </Authguard>
        )
        } else {
            return (
            <Grid container alignContent="center" alignItems="center">
            <CircularProgress size='9em'></CircularProgress>
            </Grid>)
        }
    }

}

export default withRouter(Orders);