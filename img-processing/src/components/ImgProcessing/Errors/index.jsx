import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
const ErrorsComponent = () => {

    const error = useRouteError()
    return (
        <div className='h-screen w-full flex justify-center items-center bg-cyan-50 flex-col' id="error-page" >
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Link className='bg-slate-200 px-3 py-2 border rounded-xl' to={'/'}> {'<=3'} Back</Link>

        </div>
    )
}

export default ErrorsComponent