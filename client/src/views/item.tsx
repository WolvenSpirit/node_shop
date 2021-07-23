import React from 'react';
import { useParams, withRouter } from 'react-router-dom';

class Item extends React.Component {

    public id;

    constructor(props: any) {
        super(props);
        this.id = props.match.params.id;
        console.debug(props);
    }

    render() {
        return <h1>Item {this.id}</h1>
    }
}

export default withRouter(Item);