import React,{  }  from "react";
import Title from "./Title";
import "../styles/components/Error.css";
function Error() {
    

    return(
        <div className="error-page">
            <Title value="404"/>
            <p className="error-msg">Error : page not found</p>

            <p>→<a href="/">Click here </a>to return to the home page </p>
        </div>

    )
}

export default Error;