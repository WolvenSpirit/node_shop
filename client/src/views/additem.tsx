import { Grid, Paper, Typography, TextField, Button, IconButton } from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import '../css/catalog.css';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import { HttpClient } from '../api.service';
import { baseURL } from '../config';

class Additem extends React.Component<any, any> {

    private client: HttpClient = new HttpClient(baseURL);
    private id = '';
    constructor(props: any) {
        super(props);
        this.state = {
            name: '',
            description: '',
            price: 0.00,
            images: [],
            error: false,
            errorMessage: 'Error',
            nameError: false,
            priceError: false,
            notify: false,
            modeUpdate: false,
            loaded: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            this.id = this.props.match.params.id;
            console.log('editing existing item with id ',this.id);
            this.client.getItem(this.id).then((result:any)=>{
                console.log(result);
                let d = result.data[0];
                this.setState({
                    modeUpdate: true,
                    name: d.name,
                    description: d.description,
                    price: d.price,
                    images: JSON.parse(d.images),
                    loaded: true
                })
            },(err:any)=>{
                console.log(err.message);
            });
        } else {
            this.setState({loaded:true})
        }
    }

    handleChange(e:any){
        this.setState({
            [e?.target?.name]: e.target.value,
        });
    }

    fileUpload(e: any) {
        let file = e?.target?.files[0];
        if(file !== undefined) {
            let fd = new FormData();
            fd.append('item_id',this.id);
            fd.append('image',file);
            this.client.postImage(fd).then((response: any)=>{
                this.setState({
                    images: this.state.images.concat([response.data.values.url])
                });
                /*let urls = [];
                if(urls.length !== 0) {
                    urls = JSON.parse(this.state.image);
                }
                urls.push(response.data.values.url);
                this.setState({images:urls});*/
            },(err: any)=>{
                console.log(err.message);
            });
        }
    }

    save() {
        if(this.state.name == '') {
            this.setState({
                error: true,
                errorMessage: 'Please type a product name',
                nameError: true
            });
            return;
        }
        if(this.state.price == 0) {
            this.setState({
                error: true,
                errorMessage: 'Price cannot be 0',
                priceError: true
            });
            return;
        }
        if(this.state.modeUpdate) {
            this.client.patchItem([{name:this.state.name,description:this.state.description,price: parseFloat(this.state.price)},{id:this.id}]).then((result:any)=>{
                console.log(result);
            },
            (err:any)=>{
                console.log(err);
            });
            return;
        }
        this.client.postItem({name:this.state.name,description:this.state.description,price: parseFloat(this.state.price)}).then((result:any)=>{
            this.setState({notify:true});
            this.props.history.push('/');
        },
        (err:any)=>{
            this.setState({
                error: true,
                errorMessage: err.message,
            })
        });
    }

render() {
    console.log('render')
    if(this.state.loaded === false) {
        return <Paper>Loading...</Paper>
    }
    return (
        <Grid container
            alignContent='center'
            alignItems='center'
            direction='column'>
                <br />
                <Typography color='primary'>Add product</Typography>
                <hr /><br />
                <TextField fullWidth={true} key='1' variant='outlined' error={this.state.nameError} type='text' name='name' label="Name" placeholder='Product name' value={this.state.name} onChange={this.handleChange}></TextField><br /><br />
                <TextField fullWidth={true} key='2' variant='outlined' multiline rows={2} rowsMax={9} type='textarea' name='description' label="Description" placeholder='Product description' value={this.state.description} onChange={this.handleChange}></TextField><br /><br />
                <TextField fullWidth={false} key='3' variant='outlined' error={this.state.priceError} type='number' name='price' label="Price" placeholder='Price' value={this.state.price} onChange={this.handleChange}></TextField><br /><br />
                <Collapse in={this.state.error}>
                        <Alert severity="error" action={
                                        <IconButton aria-label="close" color="inherit" size="small"
                                        onClick={() => {this.setState({error: false,nameError: false, priceError: false});}}>
                                        <CloseIcon fontSize="inherit" /></IconButton>
                        }>{this.state.errorMessage}</Alert>
                </Collapse>
                <Grid container 
                direction='row'
                alignContent='center'
                alignItems='center'>
                        {(this.state.images).map((url:string,k:any)=>{
                            return <Grid item><a target='__blank' href={baseURL+url}><img height='50' src={baseURL+url} /></a></Grid>
                        })} 
                </Grid>
                <Button><input type='file'onChange={this.fileUpload} /></Button>
                <Button onClick={this.save} color='secondary' variant='outlined'><SaveIcon></SaveIcon></Button>
        </Grid>
    ); 
}

}

export default withRouter(Additem);