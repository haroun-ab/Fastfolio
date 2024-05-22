import React, {useEffect, useState} from "react";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import Title from "../components/Title";
import Button from "../components/Button";
import {useNavigate} from 'react-router-dom'
import '../styles/pages/statistics.css'
import Header from "../components/Header";
import Stat from "../components/Stat";
import {setTheme, getBackground} from "../common";


function Statistics () {
    const [stats, setStats] = useState(null);
  
    async function getStatistics(){
        const  objData = {
            userId :  null,
        }
        
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-statistics`, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
            },
            body : JSON.stringify(objData)
        });
        const contentResponse = await response.json();
        setStats(contentResponse)
        console.log(stats);

        return contentResponse;
    } 
    
    useEffect(() => {
        getBackground();
        setTheme();
        getStatistics();
           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return(
        
        <React.Fragment>
            {
            stats != null ?
            <React.Fragment>
            <Header/>
            <main className="user-bg">
                <div id="statistics" className="main-content"> 
                    <Title value="Statistics"/>
                    <section>
                        <h3>This month</h3>
                        <div className="stats-list">
                            <Stat type="Likes" count={stats['likesLastMonth']}/>
                            <Stat type="Views" count={stats['viewsLastMonth']}/>
                            <Stat type="Single views" count={stats['singleViewsLastMonth']}/>
                        </div>
                    </section>
                    <section>
                        <h3>Overall</h3>
                        <div className="stats-list"> 
                            <Stat type="Likes" count={stats['likes']}/>
                            <Stat type="Views" count={stats['views']}/>
                            <Stat type="Single views" count={stats['singleViews']}/>
                        </div>
                    </section>
                    
                </div>    
            </main>
            </React.Fragment>

            : 

            <React.Fragment>
            <Header/>
            <main className="user-bg">
                <div id="statistics" className="main-content"> 
                    <Title value="Statistics"/>
                    <section>
                        <h3>This month</h3>
                        <div className="stats-list">
                            <Stat type="Likes" count="&nbsp;"/>
                            <Stat type="Views" count="&nbsp;"/>
                            <Stat type="Single views" count="&nbsp;"/>
                        </div>
                    </section>
                    <section>
                        <h3>Overall</h3>
                        <div className="stats-list"> 
                            <Stat type="Likes" count="&nbsp;"/>
                            <Stat type="Views" count="&nbsp;"/>
                            <Stat type="Single views" count="&nbsp;"/>
                        </div>
                    </section>
                    
                </div>    
            </main>
            </React.Fragment>
        }
            
        </React.Fragment>

    )
}

export default Statistics;