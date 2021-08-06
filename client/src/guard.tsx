import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { HttpClient } from './api.service';
import { baseURL } from './config';
import Grid from '@material-ui/core/Grid';
import Catalog from './views/catalog';

class Authguard extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            allow: "false"
        }
    }

    componentDidMount() {
        let client = new HttpClient(baseURL);
        client.verifyToken().then((result:any)=>{
            console.log(result);
            this.setState({allow:'true'})
            sessionStorage.setItem('verified','true');
        },
        (err:any)=>{
            this.props.history.push('/');
        });
    }

    render(): React.ReactNode {
        if(this.props.path === "/") {
            return <Catalog allow={this.state.allow.toString()}></Catalog>
        }
        return React.cloneElement(this.props.children as any, { allow: this.state.allow })
    }
}

export default withRouter(Authguard);