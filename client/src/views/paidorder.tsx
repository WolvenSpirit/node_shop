import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

class Paidorder extends React.Component<any, any>  {
    loading = 10;
    constructor(props:any) {
        super(props);
        this.state = {
            counter: 9,
            loading: 10
        }
    }

    async countdown() {
        setTimeout(()=>{
            let t = Date.now()
            let c = setInterval(()=>{
                this.setState({counter:this.state.counter-1});
                console.log(this.state.counter);
                this.loading+=12;
                if(this.state.counter === 0) {
                    clearInterval(c);
                    this.props.history.push("/");
                }
            },1000);
        },1000);
    }

    componentDidMount() {
        this.countdown();
    }

    render(): React.ReactNode {
        return (<Grid container 
                      alignContent="center"
                      alignItems="center"
                      direction="column">
                <b>Order sucessfully paid.</b>
                <br />
                <CircularProgress value={this.loading} variant="determinate" size="9em" />
                Redirecting to homepage in <b>{this.state.counter}</b> seconds.

        </Grid>)
    }

}

export default withRouter(Paidorder);