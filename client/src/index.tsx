import React from "react";
import { render } from "react-dom";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import List from "./views/list";
import Login from "./views/login";
import Register from "./views/register";
import Item from "./views/item";
import Nav from "./partials/nav";
import Catalog from "./views/catalog";
import Additem from "./views/additem";
import Checkout from './views/checkout';
import Paidorder from './views/paidorder';

class App extends React.Component {

    render(): React.ReactNode {
        return <h1>React Shop</h1>
    }

}

let routing = (
    <Router>
        <div>
            <Nav />
            <Route exact path="/" component={Catalog} />
            <Route path="/list" component={List} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/item/:id" component={Item} />
            <Route exact path='/add/item' component={Additem} />
            <Route path='/add/item/:id' component={Additem} />
            <Route path='/checkout' component={Checkout} />
            <Route path='/paid/:cb' component={Paidorder} />
        </div>
    </Router>
)

export default App;
render(routing, document.getElementById("root"));