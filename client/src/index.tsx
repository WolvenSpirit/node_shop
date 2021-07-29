import React from "react";
import { render } from "react-dom";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import List from "./views/list";
import Login from "./views/login";
import Register from "./views/register";
import Item from "./views/item";
import Nav from "./partials/nav";
import Catalog from "./views/catalog";

class App extends React.Component {

    render(): React.ReactNode {
        return <h1>Hello React App</h1>
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
        </div>
    </Router>
)


render(routing, document.getElementById("root"));