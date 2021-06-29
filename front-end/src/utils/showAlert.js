import Swal from 'sweetalert2'

const showAlert = (icon, title, position = 'top-end') => {
    Swal.fire({
        position,
        icon,
        title: title,
        showConfirmButton: false,
        timer: 1500
    })
}

export default showAlert