import React, {useEffect, useState} from "react";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import Title from "../components/Title";
import Button from "../components/Button";
import {json, useNavigate} from 'react-router-dom'
import '../styles/pages/settings.css'
import Header from "../components/Header";
import { FaMoon, FaSun } from "react-icons/fa";
import Card from "../components/Card";
import ChangePwd from "../components/ChangePwd";
import AccountDelete from "../components/AccountDelete";
import {setTheme, getBackground} from "../common";

function Settings () {
    const [settings, setSettings] = useState(null);
    let changePwdModal = 0;
    let accountDeleteModal = 0;
    useEffect(() => {
        changePwdModal = document.querySelector('.backdrop.change-pwd-modal')
        accountDeleteModal = document.querySelector('.backdrop.account-delete-modal')
    });

    async function openPwdModal (){
        console.log(changePwdModal);
        changePwdModal.style.display = "block"
    }
    async function openAccDeleteModal (){
        console.log(accountDeleteModal);
        accountDeleteModal.style.display = "block"
    }
    
    async function getSettings (){
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-settings`, {
         method : 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
        },
        })
        const contentResponse = await response.json();
        setSettings(contentResponse);
        const onlineInput = document.querySelector('.setting:first-child input');
        onlineInput.checked = contentResponse["isOnline"];

        const themeInput = document.querySelector('.setting:nth-child(2) input');
        themeInput.checked = contentResponse["theme"];

        const selectedBg = document.querySelector(`.bg-card:nth-child(${Number(contentResponse["bgId"]) + 1}) input`);
        selectedBg.checked = true;
    }


    async function updateSettings(e){
        console.log(document.querySelector('.bg-card input:checked').className.split("-")[1]);
        console.log(document.querySelector('input.online').checked);
        console.log(document.querySelector('input.theme').checked);
        const isOnline = document.querySelector('input.online').checked;
        const theme = document.querySelector('input.theme').checked
        const bgId = document.querySelector('.bg-card input:checked').className.split("-")[1];
   
        localStorage.setItem('bgId', bgId)
        localStorage.setItem('theme', theme)
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/set-settings`, {
            method : 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
           },
           body : JSON.stringify({
                bgId : bgId,
                isOnline : isOnline,
                theme : theme
           })
        })
        const contentResponse = await response.json();
        console.log(contentResponse);
        getBackground();
        setTheme();

        //    getSettings();
    }

    useEffect(() => {
        getBackground();
        setTheme();
        getSettings();
        // console.log(settings);
    }, [])


    return(
    
        <React.Fragment>
            <Header/>
            <main className="user-bg">
                <div id="settings" className="main-content">
                    <Title value="Settings"/>
                    <div className="settings-container top">
                       <div className="setting">
                            <label>Portfolio deployment</label>
                            <div className="parameter">
                                <label className="switch">
                                    <input className="online" type="checkbox" onChange={updateSettings}/>
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div> 
                        <div className="setting">
                            <label>Theme</label>
                            <div className="parameter">
                                <label className="switch">
                                    <FaMoon/>
                                    <input className="theme" type="checkbox" onChange={updateSettings}/>
                                    <span className="slider theme"></span>
                                    <FaSun/>
                                </label>
                            </div>
                        </div> 
                        <div className="setting bg-pattern">
                            <label>Background pattern</label>
                            <div className="parameter-list">
                                <label className="bg-card bg-0">
                                    <input type="radio" name="bg-selection" onChange={updateSettings} className="bg-0"/>
                                    <span className="bg-selection bg-0"></span>
                                </label>
                                <label className="bg-card bg-1">
                                    <input type="radio" name="bg-selection" onChange={updateSettings} className="bg-1"/>
                                    <span className="bg-selection bg-1" style={{background : "var(--bg-secondary) url('/backgrounds/topography.svg')", backgroundSize : 500}}></span>
                                </label> 
                                <label className="bg-card bg-2">
                                    <input type="radio" name="bg-selection" onChange={updateSettings} className="bg-2"/>
                                    <span className="bg-selection bg-2" style={{background : "var(--bg-secondary) url('/backgrounds/wave.svg')", backgroundSize : 200}}></span>
                                </label> 
                                <label className="bg-card bg-3">
                                    <input type="radio" name="bg-selection" onChange={updateSettings} className="bg-3"/>
                                    <span className="bg-selection bg-3" style={{background : "var(--bg-secondary) url('/backgrounds/floating-cogs.svg')", backgroundSize : 250}}></span>
                                </label> 
                                {/* <label className="bg-card bg-5">
                                    <input type="radio" name="bg-selection"/>
                                    <span className="bg-selection" style={{background : "var(--bg-secondary) url('/backgrounds/wiggle.svg')", backgroundSize : 100}}></span>
                                </label> 
                                <label className="bg-card bg-6">
                                    <input type="radio" name="bg-selection"/>
                                    <span className="bg-selection" style={{background : "var(--bg-secondary) url('/backgrounds/topography.svg')", backgroundSize : 500}}></span>
                                </label>
                                <label className="bg-card bg-7">
                                    <input type="radio" name="bg-selection"/>
                                    <span className="bg-selection" style={{background : "var(--bg-secondary) url('backgrounds/wave.svg')", backgroundSize : 200}}></span>
                                </label> 
                                <label className="bg-card bg-8">
                                    <input type="radio" name="bg-selection"/>
                                    <span className="bg-selection" style={{background : "var(--bg-secondary) url('/backgrounds/floating-cogs.svg')", backgroundSize : 250}}></span>
                                </label> */}
                            </div>
                        </div> 
                    </div>

                    <div className="settings-container">
                        <div className="setting password">
                            <label>Change the password</label>
                            <div className="parameter password">
                                <Button tagName="button" btnValue="New password" onClick={openPwdModal}/>
                            </div>
                        </div> 
                        <div className="setting delete">
                            <span onClick={openAccDeleteModal}>Delete my account</span>
                        </div> 
                    </div>
                </div>
                <ChangePwd />
                <AccountDelete />

            </main>
                
        </React.Fragment>
    )
}

export default Settings;