const Toast = ({ bgColor, title, msg, closeHandler }) => {
    return (
        <div className={`toast show position-fixed ${bgColor}`} style={{ zIndex: 10, top: 5, right: 5, minWidth: "280px" }}
            role="alert" aria-live="assertive" aria-atomic="true">
            <div className={`toast-header ${bgColor} text-light`}>
                <strong className="me-auto">{title}</strong>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"
                    onClick={closeHandler}></button>
            </div>
            <div className="toast-body text-light">
                {msg}
            </div>
        </div>
    )
}

export default Toast
