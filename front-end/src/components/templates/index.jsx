import React, {useState, useEffect, Fragment} from 'react'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import {useHistory, useLocation} from 'react-router-dom'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './styles.css'
import http from "../../utils/http";
import showAlert from "../../utils/showAlert";

const Template = () => {
    const location = useLocation()
    let history = useHistory()

    const [template, setTemplate] = useState('')
    const [subject, setSubject] = useState('')
    const [validated, setValidated] = useState(false)

    const action = (location.state.id === 0) ? 'create' : 'edit'
    const title = (action === 'create') ? 'Create new Template ' : `Edit template (${location.state.id})`
    const {id} = location.state

    const getMailingData = async () => {
        const response = await http(`/mailing/${id}`)

        return response
    }

    const createEditMailing = async (event) => {
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
                if (id !== 0) {
                    await http.put('/mailing/edit', {
                        id,
                        template,
                        subject
                    })
                    showAlert('success', `Mailing with id (${id}) updated successfully !`)
                } else {
                    await http.post('/mailing/add', {
                        template,
                        subject
                    })
                    showAlert('success', `Mailing created successfully !`)
                }

                history.push('/mailings')
            }
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
        }
    }

    useEffect(() => {
        let editor
        const initialize = async () => {
            const response = await getMailingData()

            const {data, placeholders} = response.data.data
            const placeholderStr = Object.keys(placeholders).map(key => `<option value="${placeholders[key]}">${key}</option>`).join('')
            setTemplate(data.template ?? '')
            await setSubject(data.subject ?? '')

            editor = grapesjs.init({
                container: '#gjs',
                fromElement: true,
                height: '300px',
                width: 'auto',
                panels: {defaults: []},
                clearOnRender: false,
                storageManager: {
                    autosave: true,
                    setStepsBeforeSave: 1,
                    type: 'remote',
                    contentTypeJson: true,
                },
                blockManager: {
                    appendTo: '#blocks',
                    blocks: [
                        {
                            id: 'section',
                            label: '<b>Paragraph</b>',
                            content: `<section>
                            <h1>Title of paragraph</h1>
                            <div>Paragraph</div>
                        </section>`,
                        },
                        {
                            id: 'text',
                            label: 'Text',
                            content: '<div data-gjs-type="text">Input your text here</div>',
                        }
                    ]
                },
            })

            editor.RichTextEditor.add('custom-vars', {
                icon: `<select class="gjs-field">
                  <option value="">- Select -</option>
                  ${placeholderStr}
                </select>`,
                // Bind the 'result' on 'change' listener
                event: 'change',
                result: (rte, action) => rte.insertHTML(action.btn.firstChild.value),
                // Reset the select on change
                update: (rte, action) => {
                    action.btn.firstChild.value = "";
                }
            })

            editor.Panels.addPanel({
                id: 'panel-top',
                el: '.panel__top',
            })

            editor.Panels.addPanel({
                id: 'basic-actions',
                el: '.panel__basic-actions',
                buttons: [
                    {
                        id: 'save-db',
                        className: 'fa fa-floppy-o btn-show-json',
                        command: 'save-db',
                        attributes: {title: 'Click to save template'}
                    }
                ]
            })

            editor.Commands.add
            ('save-db', {
                run: (editor, sender) => setSubject(editor.store().html)
            })

            editor.setComponents(data.subject);
        }

        initialize()

        return () => {
            editor = null
        }
    }, [])

    return (
        <Container style={{marginTop: '40px'}}>
            <Form noValidate validated={validated} onSubmit={createEditMailing}>
                <Row>
                    <Col>
                        {/*{*/}
                        {/*    (action === 'create') ? (*/}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="6">
                                <h4>
                                    {title}
                                </h4>
                            </Form.Label>
                            <Col sm="6" style={{marginTop: '10px'}}>
                                <Form.Control type="text" placeholder="Template name" value={template}
                                              onChange={({target: {value}}) => setTemplate(value)} required/>
                                <Form.Control.Feedback type="invalid">
                                    You forgot to enter Template name.
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        {/*    ) : (*/}
                        {/*        <h3>*/}
                        {/*            {title}*/}
                        {/*        </h3>*/}
                        {/*    )*/}
                        {/*}*/}
                    </Col>
                </Row>
                <Fragment>
                    <div className="panel__top" style={{marginTop: '10px'}}>
                        <div className="panel__basic-actions"/>
                    </div>
                    <div id="gjs" style={{marginTop: '20px'}}/>
                    <div id="blocks"/>
                </Fragment>
                <Button type="submit" style={{marginTop: '20px'}}>
                    Save
                </Button>
            </Form>
        </Container>
    )
}

export default Template