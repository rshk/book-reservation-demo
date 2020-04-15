import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ApolloProvider from 'lib/apollo-provider';

import Layout from 'app/ui/layout';
import { ICON } from 'app/config';


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

        <Route exact path="/" component={IndexPage} />
        <Route path="/new" component={NewRequestPage} />
        <Route path="/request/:id"
               render={({match: {params: {id}}}) =>
                   <RequestPage requestId={id} />} />
        <Redirect to="/" />

    </Switch>;
}


function IndexPage() {
    return <Layout>
        Hello
    </Layout>;
}

function NewRequestPage() {
    return <Layout>
        Hello
    </Layout>;
}

function RequestPage({requestId}) {
    return <Layout>
        Hello
    </Layout>;
}
