import React from 'react'
import { Table } from 'react-bootstrap'
import MailingsTableRow from './MailingsTableRow'

const MailingsTable = ({ mailings, changeMailing }) => {
    const rows = mailings.length > 0 ?
        mailings.map((mailing, index) => (
            <MailingsTableRow
                key={index}
                mailing={mailing}
                changeMailing={changeMailing}
            />
        ))
        : (
            <tr>
                <td colSpan="8">
                    No mailings !
                </td>
            </tr>
        )

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Template</th>
                    <th>Subject</th>
                    <th>Total</th>
                    <th>Sended</th>
                    <th>Opened</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    )
}

export default MailingsTable