import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { withRouter } from 'react-router-dom';

class Paidorder extends React.Component<any, any>  {

    constructor(props:any) {
        super(props);
    }

    render(): React.ReactNode {
        return (<Grid container>
            <Card>
                Order sucessfully paid.
            </Card>
        </Grid>)
    }

}

export default withRouter(Paidorder);