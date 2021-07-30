import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

class Checkout extends React.Component<any, any> {

    constructor(props: any) {

        super(props);
        this.state = {
            // something
        }

    }

    render() {

        return (

            <Grid container>
                <Card>
                    <Typography>Checkout</Typography>
                </Card>
            </Grid>

        )

    }

}