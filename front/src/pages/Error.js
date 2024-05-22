
import Header from "../components/Header";
import Error from "../components/Error";
import React from "react";

function ErrorPage() {

    return(
        <React.Fragment>
                <Header/>
                <main className="user-bg error">
                    <Error/>

                </main>
           
        </React.Fragment>
    )
}

export default ErrorPage;