import React, {useEffect} from "react";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import Title from "../components/Title";
import Button from "../components/Button";
// import Cookies from "js-cookie";
import '../styles/dashboard.css'



function Dashboard () {
    async function myfunction (e){
    const bonjour = "bonjour"
       const response = await fetch('https://127.0.0.1:8000/api/testdashboard', {
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('jwt')}`,
        },
        body : JSON.stringify("Bonjour")
       })
       const contentResponse = await response.json();
       
       e.target.textContent += ` ${contentResponse}`
    }
    return(
        <React.Fragment>
                    <h2 onClick={myfunction}>Dashboard</h2>

            <Title value="Dashboard"/>
        </React.Fragment>
    );
}

export default Dashboard;