import { any } from 'prop-types';
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { HttpClient } from '../api.service';
import { Card } from '@material-ui/core';

class Catalog extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        let client = new HttpClient();
        client.getItems().then((result:any)=>{
                this.setState({list:result.data});
        });
    }

    render() {
        return (
            <Grid container>
                {this.state.list.map((item:any,k:number)=>{
                    return  <div>{item.name}</div>
                })}
            </Grid>
        )
    }

}

export default Catalog;