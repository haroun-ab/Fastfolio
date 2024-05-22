import React, {useEffect} from "react";
import Title from "../components/Title";
import Header from "../components/Header";
import "../styles/pages/dashboard.css";
import Section from "../components/Section";
import {setTheme, getBackground} from "../common";

async function isLoggedIn(){
    const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/is-logged-in`, {
     method : 'GET',
     headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
    },
    })
    const contentResponse = await response.json();
    console.log(contentResponse);
    document.querySelector(".title-user-firstname").textContent = `${contentResponse["firstName"]} !`;
}
function Dashboard () {
        

    useEffect(() => {
        getBackground();
        setTheme();
        isLoggedIn();
    })
    
    return(
        <React.Fragment>
            <Header/>
            <main className="user-bg">
                <div className="main-content"> 
                    <div className="welcome">
                        <Title value="Welcome back,"/><br/>
                        <span className="title-user-firstname"></span>
                    </div>
                    <div className="sections">
                        <Section href="/edit" sectionName="Edit my portfolio" props/>
                        <Section href={"/portfolio"} sectionName="Visualize my portfolio"/>
                        <Section href="/statistics" sectionName="Statistics"/>
                        <Section href="/settings" sectionName="Settings"/>
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
}

export default Dashboard;