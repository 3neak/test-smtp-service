import React, {useState, useEffect} from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import MailingsTable from './MailingsTable'
// import data from '../../data/mailings'
import {useHistory} from "react-router-dom"
import http from "../../utils/http";
import showAlert from "../../utils/showAlert";
import Swal from "sweetalert2";
import axios from "axios";

const Mailing = () => {
    const [mailings, setMailings] = useState([])
    let history = useHistory()

    const getMailings = async () => {
        try {
            const result = await http('/mailings')

            if (result.status === 200) {
                setMailings(result.data.data)
            }
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
            setMailings([])
        }
    }

    useEffect(() => {
        getMailings()
    }, [])

    const removeMailing = async (mailingId) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const result = await http.delete(`/mailing/remove/${mailingId}`)

                    if (result.status === 200) {
                        getMailings()
                        showAlert('success', `Mailing with id (${mailingId}) deleted successfully !`)
                    } else {
                        throw new Error()
                    }
                }
            })
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
        }
    }

    const editMailing = (mailingId, mailingTemplate) => {
        history.push({
            pathname: `/templates/edit/${mailingId}`,
            state: {
                id: mailingId,
                template: mailingTemplate
            }
        })
    }

    const createMailing = () => {
        history.push({
            pathname: '/templates/create/new',
            state: {
                id: 0,
                template: ''
            }
        })
    }

    const changeMailingStatus = async (mailingId) => {
        // (!! => convert to Boolean), (! => get opposite), (+ => convert to Number)
        const mailing = mailings.find((mailing) => mailingId === mailing.id)
        //     mailingId === mailing.id ?
        //         {...mailing, status: (+(!(!!mailing.status)))}
        //         : mailing
        // )

        try {
            const response = await http.put('/mailing/changeStatus', {
                id: mailingId,
                status: !mailing.status
            })
            showAlert('success', `Status of (${mailing.template}) changed successfully, ${mailing.status ? 'stopping' : 'starting'} mailing !`)
            getMailings()
        } catch (error) {
            showAlert('error', 'Something went wrong, try again later !')
        }

        // setMailings(newMailings)
    }

    return (
        <Container style={{marginTop: '40px'}}>
            <Row>
                <Col>
                    <h3>
                        Templates List
                    </h3>
                </Col>
                <Col>
                    <h3 style={{textAlign: 'right'}}>
                        <Button variant="outline-primary" onClick={createMailing}>Add Template</Button>
                    </h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MailingsTable
                        mailings={mailings}
                        changeMailing={{
                            removeMailing,
                            editMailing,
                            changeMailingStatus
                        }}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default Mailing