import React from 'react'
import {Route, Switch} from 'react-router-dom';
import Mailings from './components/mailings/index'
import Settings from './components/smtpSettings/index'
import Templates from './components/templates/index'
import Header from './components/Header'
import {Container, Row, Col} from 'react-bootstrap'

const App = () => {
    return (
        <>
            <Header/>
            <Switch>
                <Route path="/" exact component={Mailings}/>
                <Route path="/mailings" exact component={Mailings}/>
                <Route path="/smtp-settings" exact component={Settings}/>
                <Route path="/templates/:action/:id" exact component={Templates}/>
                {/*<Route path="/404" component={Error404} />*/}
                {/* <Redirect to="/404" /> */}
            </Switch>
        </>
    )
}

export default App