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

class Item extends React.Component<RouteComponentProps, any> {

    public id;
    public item: any;
    public images: Array<any> = [];
    constructor(props: any) {
        super(props);
        this.state = {
            item: null,
            loaded: false
        }
        this.id = props.match.params.id;
    }

    componentDidMount() {
       let client = new HttpClient();
       client.getItem(this.id).then((result)=>{
        console.log(result);
        this.setState({item:result,loaded:true});
        if(this.state.item.data[0].images !== undefined && this.state.item.data[0]?.images !== undefined) {
            this.images = JSON.parse(this.state.item.data[0]?.images).map((img:any,i:any)=>{
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
                    <h3>&nbsp;{this.state.item?.data[0].name}&nbsp;</h3>
                </Grid>
                <br />
                <Grid item xs={6} sm={11}>
                    <ImageList rowHeight={70} cols={5}>
                    {this.images}
                    </ImageList>
                </Grid>
                <hr />
                <Grid item xs={6} sm={11}>
                    &nbsp;{this.state.item?.data[0].description}&nbsp;
                </Grid>
                <Grid item xs={4} sm={3}>
                &nbsp;<h1>$ {this.state.item?.data[0].price}</h1>&nbsp;
                </Grid>
                <br />
            </Grid>
            
            <CardActionArea>           
                <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Button variant="outlined">Add To Cart</Button>
                </Grid>
            </CardActionArea>
            </Card>
            </Container>
        </div>
    }
}

export default withRouter(Item);