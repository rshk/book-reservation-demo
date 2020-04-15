import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import qs from 'querystring';

import ApolloProvider from 'lib/apollo-provider';

import Layout from 'app/ui/layout';
import { ICON } from 'app/config';

import RequestsListPage from 'app/ui/requests-list-page';
import NewRequestPage from 'app/ui/new-request-page';


export default function App() {
    return <React.Fragment>
        <Helmet>
            <title>Library service</title>
            <link rel="icon" href={ICON} />
        </Helmet>
        <ApolloProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ApolloProvider>
    </React.Fragment>;
}


function AppRoutes() {
    return <Switch>

        <Route exact path="/" component={RequestsListPage} />
        <Route path="/new" component={NewRequestPageWrapper} />
        <Route path="/request/:requestId"
               component={RequestPageWrapper} />
        <Redirect to="/" />

    </Switch>;
}


function NewRequestPageWrapper(props) {
    const {location} = props;
    const queryString = qs.decode(location.search.slice(1));
    const {title} = queryString;
    return <NewRequestPage title={title} />;
}


function RequestPageWrapper(props) {
    const {match: {params: {requestId}}} = props;
    return <Layout>
        Hello
    </Layout>;
}
