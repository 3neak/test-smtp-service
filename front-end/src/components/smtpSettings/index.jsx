import React, {useEffect, useState} from 'react'
import {Container, Form, Button, Alert} from 'react-bootstrap'
import http from "../../utils/http";
import showAlert from "../../utils/showAlert";

const Settings = () => {
    const [server, setServer] = useState('')
    const [port, setPort] = useState('')
    const [auth, setAuth] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showAuth, setShowAuth] = useState(false)
    const [id, setId] = useState(null)
    const [validated, setValidated] = useState(false)
    const [debug, setDebug] = useState(null)
    const [error, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const onAuthChange = (value) => {
        if (value === 'true') {
            setShowAuth(true)
        } else {
            setShowAuth(false)
            setUsername('')
            setPassword('')
        }

        setAuth(value)
    }

    const getData = async () => {
        try {
            const response = await http('/settings')
            const {server, port, auth, username, password, _id} = response.data.data[0]
            setServer(server)
            setPort(port)
            setAuth(auth)
            setUsername(username)
            setPassword(password)
            setId(_id)
            if (auth) {
                setShowAuth(true)
            }
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleTest = async () => {
        try {
            setLoading(true)
            const response = await http.post('/settings/check', {
                server,
                port,
                auth,
                username,
                password,
            })
            showAlert('success', 'OK')
            setDebug(response.data)
            setLoading(false)
        } catch (error) {
            showAlert('error', 'ERROR')
            setDebug(error)
            setError(true)
            setLoading(false)
        }
    }

    const handleSave = async (event) => {
        const form = event.currentTarget

        let isValid = form.checkValidity()

        if (!isValid) {
            event.preventDefault()
            event.stopPropagation()
        }

        setValidated(true)

        try {
            if (isValid) {
                event.preventDefault()
                const response = await http.post('/settings/change', {
                    id,
                    server,
                    port,
                    auth,
                    username,
                    password,
                })
                showAlert('success', `Setting saved successfully !`)
            }
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
        }
    }

    return (
        <Container style={{marginTop: '40px'}}>
            <Form noValidate validated={validated} onSubmit={handleSave}>
                <Form.Group className="mb-3">
                    <Form.Label>SMTP Server</Form.Label>
                    <Form.Control type="text" placeholder="Enter server" value={server}
                                  onChange={({target: {value}}) => setServer(value)} required/>
                    <Form.Control.Feedback type="invalid">
                        Please enter SMTP Server.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>SMTP Port</Form.Label>
                    <Form.Control type="text" placeholder="Enter port" value={port}
                                  onChange={({target: {value}}) => setPort(value)} required/>
                    <Form.Control.Feedback type="invalid">
                        Please enter SMTP Port.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>SMTP Auth</Form.Label>
                    <Form.Control as="select" value={auth} onChange={({target: {value}}) => onAuthChange(value)}>
                        <option value="false">NO</option>
                        <option value="true">YES</option>
                    </Form.Control>
                </Form.Group>

                {
                    showAuth && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>SMTP Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={username}
                                              onChange={({target: {value}}) => setUsername(value)} required/>
                                <Form.Control.Feedback type="invalid">
                                    Please enter SMTP Username.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>SMTP Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={password}
                                              onChange={({target: {value}}) => setPassword(value)} required/>
                                <Form.Control.Feedback type="invalid">
                                    Please enter SMTP Password.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )
                }

                <div>
                    <Button variant="warning" style={{float: 'left'}} onClick={!isLoading ? handleTest : null} disabled={isLoading}>
                        {isLoading ? 'Loading, please wait' : 'Check test email'}
                    </Button>
                    <Button variant="primary" style={{float: 'right'}} type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading, please wait' : 'Save'}
                    </Button>
                </div>
            </Form>

            {
                (debug !== null) && (
                    <Alert variant={error ? "danger" : "success"} style={{marginTop: '80px'}}>
                        <Alert.Heading>Debug info</Alert.Heading>
                        <pre>
                            {JSON.stringify(debug)}
                        </pre>
                    </Alert>
                )
            }
        </Container>
    )
}

export default Settings