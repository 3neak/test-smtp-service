import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

const MailingsTableRow = ({ mailing, changeMailing }) => {
    const {
        id,
        template,
        subject,
        totalEmails,
        sendedEmails,
        openedEmails,
        status,
    } = mailing

    const {
        removeMailing,
        editMailing,
        changeMailingStatus
    } = changeMailing

    const actions = (
        <ButtonGroup>
            <Button size="sm" variant="outline-warning" onClick={() => removeMailing(id)}>🗑️</Button>
            <Button size="sm" variant="outline-info" onClick={() => editMailing(id, template)}>✏️</Button>
            <Button size="sm" variant={status ? "outline-danger" : "outline-success"} onClick={() => changeMailingStatus(id)}>
                {status ? "❌" : "✔️"}
            </Button>
        </ButtonGroup>
    )

    return (
        <tr>
            <td>{id}</td>
            <td>{template}</td>
            <td>{subject}</td>
            <td>{totalEmails}</td>
            <td>{sendedEmails}</td>
            <td>{openedEmails}</td>
            <td style={{ color:status ? 'green' : 'red', fontSize: '13px' }}>
                {status ? "ON ✔️" : "OFF ❌"}
            </td>
            <td>
                {actions}
            </td>
        </tr >
    )
}

export default MailingsTableRow