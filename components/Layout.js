import Modal from './Modal'
import Nav from './Nav'
import Notify from './Notify'
import Script from 'next/script'
import Head from 'next/head'

const Layout = ({ children }) => {
    return (
        <div className="container">
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous" />
            <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`} />

            <Nav />
            <Notify />
            <Modal />
            {children}
        </div>
    )
}

export default Layout
