import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { DateTime } from 'luxon';
import qs from 'querystring';

import Layout from 'app/ui/layout';


export default function IndexPage() {
    return <Layout>
        <h1>Requests</h1>
        <RequestsList />

        <h2>Books</h2>
        <BooksList />
    </Layout>;
}


function RequestsList() {

    const query = gql`
        query requests {
            requests {
                id
                title
                email
                timestamp
            }
        }
    `;

    const { loading, error, data, refetch } =
        useQuery(query, {fetchPolicy: 'cache-and-network'});

    if (loading) {
        return <div>Loading requests...</div>;
    }

    if (error) {
        return <Alert color="danger">
            {error.message}
        </Alert>;
    }

    if (!data.requests.length) {
        return <div className="text-muted">
            There are no requests.
        </div>;
    }

    return <RequestsListUI requests={data.requests} refetch={refetch} />;
}


function RequestsListUI({requests, refetch}) {
    return <ListGroup>
        {requests.map(request =>
            <ListGroupItem key={request.id}>
                <div className="d-flex flex-row align-items-center">
                    <div style={{flex: '1'}}>
                        <strong>{request.title}</strong>,{' '}
            requested by {request.email}{' '}
            on {DateTime
                .fromISO(request.timestamp)
                .toLocaleString(DateTime.DATETIME_MED)}
                    </div>
                    <DeleteRequestButton request={request} refetch={refetch} />
                </div>
            </ListGroupItem>
        )}
    </ListGroup>;
}


function BooksList() {

    const query = gql`
        query books {
            books {
                id
                title
            }
        }
    `;

    const { loading, error, data } = useQuery(query);

    if (loading) {
        return <div>Loading books...</div>;
    }

    if (error) {
        return <Alert color="danger">
            {error.message}
        </Alert>;
    }

    if (!data.books.length) {
        return <div className="text-muted">
            There are no books.
        </div>;
    }

    return <BooksListUI books={data.books} />;
}


function BooksListUI({books}) {
    return <ListGroup>
        {books.map(book =>
            <ListGroupItem key={book.id}>
                <div className="d-flex flex-row align-items-center">
                    <div style={{flex: '1'}}>{book.title}</div>
                    <Button color="success" tag={Link}
                            to={`/new?${qs.stringify({title: book.title})}`}>
                        Request
                    </Button>
                </div>
            </ListGroupItem>
        )}
    </ListGroup>;
}


function DeleteRequestButton({request, refetch}) {

    const [deleteRequest, mutationStatus] = useMutation(gql`
        mutation deleteRequest($id: Int!) {
            result: deleteRequest(id: $id) {
                ok
                errorMessage
            }
        }
    `);

    const { loading } = mutationStatus;

    const onClick = data=>
        deleteRequest({variables: {id: request.id}})
            .then(()=> {
                if (refetch) {
                    refetch();
                }
            });

    return <Button color="danger" disabled={loading} onClick={onClick}>
        Cancel
    </Button>;
}
