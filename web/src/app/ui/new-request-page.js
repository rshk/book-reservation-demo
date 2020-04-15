import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';

import Layout from 'app/ui/layout';


export default function NewRequestPage({title}) {
    return <Layout>
        <h1>Request book</h1>
        <CreateRequestForm formData={{title}} />
    </Layout>;
}


function CreateRequestForm({formData}) {

    const [createRequest, mutationStatus] = useMutation(gql`
        mutation createRequest($data: CreateRequestInput!) {
            result: createRequest(data: $data) {
                ok
                requestId
                errorMessage
            }
        }
    `);

    const { loading, error, data, called } = mutationStatus;

    if (error) {
        return <Alert color="danger">{error.message}</Alert>;
    }

    let errorMessage = null;

    if (called && data && data.result) {
        if (data.result.ok) {
            // const { requestId } = data.result;
            // return <Redirect to={`/request/${requestId}`} />;
            return <Redirect to={`/`} />;
        }

        errorMessage = data.result.errorMessage || 'Book request failed';
    }

    return <RequestForm
               {...{formData, errorMessage, loading}}
               onSubmit={data=> createRequest({variables: {data}})} />;
}


function RequestForm(props) {

    const { formData, errorMessage, loading, onSubmit } = props;

    const [formState, setFormState] = useState({
        email: '',
        title: '',
        ...formData,
    });

    const _onSubmit = evt=> {
        evt.preventDefault();
        onSubmit(formState);
    };

    return <Form onSubmit={_onSubmit}>

        {loading && <div>Loading...</div>}

        {/* Error returned in the GraphQL response */}
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

        <FormGroup>
            <Label for="input-email">Email</Label>
            <Input type="email" name="email" id="input-email"
                   placeholder="example@gmail.com"
                   value={formState.email}
                   onChange={evt=> setFormState({...formState, email: evt.target.value})} />
        </FormGroup>

        <FormGroup>
            <Label for="input-title">Title</Label>
            <Input type="text" name="title" id="input-title"
                   placeholder="Book title"
                   value={formState.title}
                   onChange={evt=> setFormState({...formState, title: evt.target.value})} />
        </FormGroup>

        <div>
            <Button type="submit" color="primary">
                Request book
            </Button>{' '}
        </div>

    </Form>;
}


RequestForm.propTypes = {
    formData: PropTypes.object,
    errorMessage: PropTypes.string,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};
