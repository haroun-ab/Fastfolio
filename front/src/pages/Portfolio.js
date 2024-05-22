import React, {useEffect, useState} from "react";
import Title from "../components/Title";
import {useParams} from 'react-router-dom'
import {FaQuoteLeft, FaThumbsUp, FaCheckDouble, FaEnvelope, FaPhoneAlt} from "react-icons/fa"
import '../styles/pages/portfolio.css'
import Header from "../components/Header";
import Card from "../components/Card";
import Skill from "../components/Skill";
import SocialMedia from "../components/SocialMedia";
import Error from "../components/Error";
import {setTheme, getBackground} from "../common";
import IpAuthorization from "../components/ipAuthorization";

if (!localStorage.getItem("fakeIp")) {
    const fakeIp = Date.now() * Math.random();
    localStorage.setItem("fakeIp", fakeIp)
}


function Portfolio () {
    const [profileData, setProfileData] = useState(null);
    const [skillsData, setSkillsData] = useState(null);
    const [socialMediaData, setSocialMediaData] = useState(null);
    const [projectsData, setProjectsData] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);
    const [isOnline, setIsOnline] = useState(null);
    const [isLikeSet, setIsLikeSet] = useState(null);
    const [likeCount, setLikeCount] = useState(null);

    const {id} = useParams();

  
    async function isHeLoggedIn() {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/is-logged-in`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
        });
        const contentResponse = await response.json();
        console.log(contentResponse);
        return [response.ok, contentResponse["userId"]];
    }
    
    async function getStatistics(id){
        let objData;
        if (id.length > 0 && Number.isInteger(Number(id))) {
            if(localStorage.getItem('ipAuthorization') == "true"){
                objData = {
                    userId : id,
                }
            } else {
                objData = {
                    userId : id,
                    fakeIp : localStorage.getItem("fakeIp")
                }
            }
        } else{
            if(localStorage.getItem('ipAuthorization') == "true"){
                objData = {
                    userId : null,
                }
            } else {
                
                objData = {
                    userId : null,
                    fakeIp : localStorage.getItem("fakeIp")
                }
            }
        }
        console.log(objData);

        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-statistics`, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(objData)
        });
        const contentResponse = await response.json();
        console.log(contentResponse);
        setLikeCount(contentResponse["likes"]);
        setIsLikeSet(contentResponse["isLikeSet"]);
    } 

     // Récupérer les données du portfolio en étant connecté
     async function getPortfolio (){
       
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-portfolio`, {
         method : 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
        },
        })
        const contentResponse = await response.json();
        // console.log(response);
        setSkillsData(contentResponse['skills']);
        setSocialMediaData(contentResponse['socialMedia']);
        setProfileData(contentResponse['profile']);
        setProjectsData(contentResponse['projects']);

    }
    
     // Récupérer les données du portfolio en étant connecté
    async function getPortfolioPublic (id){
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-public-portfolio`, {
         method : 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id)
        })
        const contentResponse =  await response.json();
        console.log(contentResponse);
        console.log(contentResponse);
        if (response.ok) {
            
            setSkillsData(contentResponse['portfolio']['skills']);
            setSocialMediaData(contentResponse['portfolio']['socialMedia']);
            setProfileData(contentResponse['portfolio']['profile']);
            setProjectsData(contentResponse['portfolio']['projects']);
            setIsOnline(contentResponse['settings']['isOnline']);

            localStorage.setItem("bgId", contentResponse['settings']['bgId']);
            localStorage.setItem("theme", contentResponse['settings']['theme']);
        }   else{
            setIsOnline(false);
        }
    }

    async function setView(){
        let objData;
        if(localStorage.getItem('ipAuthorization') == "true"){
            objData = {
                userId : id,
            }
        } else {
            objData = {
                userId : id,
                fakeIp : localStorage.getItem("fakeIp")
            }
        }
        
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/set-view`, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objData)
        })
    };

    async function setLike(event){
        const isLiked = event.target.checked;

        let objData;
        if(localStorage.getItem('ipAuthorization') == "true"){
            objData = {
                isLiked : isLiked,
                userId : id,
            }
        } else {
            
            objData = {
                isLiked : isLiked,
                userId : id,
                fakeIp : localStorage.getItem("fakeIp")
            }
        }

        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/set-like`, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objData)
        });
        getStatistics(id);
    } 

    function openAuthorization(){
        document.querySelector('.ip-modal').style.display = "block"     
    }

    useEffect(() => {
        async function checkLoginStatus() {
            const isLoggedIn = await isHeLoggedIn();
            setLoggedIn(isLoggedIn[0])
            console.log(loggedIn);
        }

        if(id && !localStorage.getItem('ipAuthorization')){
            document.querySelector('.ip-modal').style.display = "block";
        }

        getBackground();
        setTheme();
        checkLoginStatus();


        if(loggedIn == false){
            console.log("not logged in");
            if (isOnline == true) {
                getStatistics(id);
                setView();
            }
            getPortfolioPublic(id);
           
        } else if(loggedIn == true){
            getPortfolio();
            console.log("logged in");
        } else {
            console.log("don't know");
        }
   // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loggedIn, localStorage.getItem('bgId'), isOnline])
    
    useEffect(() => {
        const inputLike = document.querySelector('input#item')
        const thumbsIcon = document.querySelector('label svg')
        if(inputLike){
            if (isLikeSet == true) {
                inputLike.checked = true;
                thumbsIcon.style.fontSize ='25px' ;
            } else{
                inputLike.checked = false;
            }                
        } console.log('test');
    },[isLikeSet])

    return(
        <React.Fragment>
            <IpAuthorization/>
            <Header/>
            <main className="user-bg">
            <div id="portfolio" className="main-content"> 

            {{
                true : 
                <React.Fragment>

                <section id="presentation">
                {profileData != null ?
                <React.Fragment>
                    <img className="profile-picture" src={process.env.REACT_APP_DOMAIN_API + '/uploads/' + profileData["img"]  }/>
                    <div className="portfolio-title">
                        <p className="name-age">{profileData["firstName"]},&nbsp;{profileData["age"]}yo,&nbsp;{profileData["speciality"]}</p>
                    </div>
                </React.Fragment>
                :
                ""
                }
                <div className="social-media">
                    {socialMediaData != null ? 
                        socialMediaData.map((socialMedia) => (
                            <SocialMedia href={socialMedia["url"]} title={socialMedia["title"]} key={socialMedia["id"]}/>
                         ))
                        : 
                        ""
                    }
                </div>
                <div className="biography">
                    <FaQuoteLeft/>{profileData != null ? profileData["bio"] : ""}
                </div>
                </section>
                <div id="projects-skills">
                    <section id="projects">
                        <Title value="Projects"/>
                        <div className="projects-list">
                            {projectsData != null && projectsData.length > 0 ?  
                                projectsData.map((project) => (
                                    <Card title={project['title']} imgPath={process.env.REACT_APP_DOMAIN_API + '/uploads/' + project['img']} id={project['id']} className="project-card" projectData={projectsData} key={project['id']} />
                                ))
                                :
                                ""
                            }
                        </div>
                    </section>
                    <div className="skills-contact">
                        <section id="contact">
                            <Title value="Contact"/>
                            {skillsData != null ? 
                                <div className="contact-container">
                                    <div><FaEnvelope/><span>{profileData['email']}</span></div>
                                    <div><FaPhoneAlt/><span>{profileData['phone'].match(/.{1,2}/g).join(" ")}</span></div>
                                </div>
                            : 
                            ""
                            }
                        </section>
                        <section id="skills">
                            <Title value="Skills"/>
                            {skillsData != null ? 
                                <div className="skills-list">
                                {skillsData.map((skill) => (
                                    <Skill name={skill["title"]} rate={skill["rate"]} key={skill["id"]} />
                                ))}
                            </div>
                            : 
                            ""
                            }
                        </section>
                    </div>
                </div>
                </React.Fragment>,
                false : 
                <React.Fragment>
                    {{
                        true:
                        <React.Fragment>
                        <section id="presentation">
                        {profileData != null ?
                        <React.Fragment>
                            <div className="img-thumbs">
                            <img className="profile-picture" src={process.env.REACT_APP_DOMAIN_API + '/uploads/' + profileData["img"]}/>
                                <div className="like">
                                    <input id="item" type="checkbox" onChange={setLike} /><label htmlFor="item"><FaThumbsUp/><span className="like-number">{likeCount}</span></label>
                                </div>
                            </div>
                            <div className="portfolio-title">
                                <p className="name-age">{profileData["firstName"]},&nbsp;{"22 ans"},&nbsp;{profileData["speciality"]}</p>
                            </div>
                        </React.Fragment>
                        :
                        ""
                        }
                        <div className="social-media">
                            {socialMediaData != null ? 
                                socialMediaData.map((socialMedia) => (
                                    <SocialMedia href={socialMedia["url"]} title={socialMedia["title"]} key={socialMedia["id"]}/>
                                 ))
                                : 
                                ""
                            }
                        </div>
                        <div className="biography">
                            <FaQuoteLeft/>{profileData != null ? profileData["bio"] : ""}
                        </div>
                        </section>
                        <div id="projects-skills">
                            <section id="projects">
                                <Title value="Projects"/>
                                <div className="projects-list">
                                    {projectsData != null && projectsData.length > 0 ?  
                                        projectsData.map((project) => (
                                            <Card title={project['title']} imgPath={process.env.REACT_APP_DOMAIN_API + '/uploads/' + project['img']} id={project['id']} className="project-card" projectData={projectsData} key={project['id']}/>
                                        ))
                                        :
                                        ""
                                    }
                                </div>
                            </section>
                            <div className="skills-contact">
                                <section id="contact">
                                    <Title value="Contact"/>
                                    {skillsData != null ? 
                                        <div className="contact-container">
                                            <div><FaEnvelope/><span>{profileData['email']}</span></div>
                                            <div><FaPhoneAlt/><span>{profileData['phone'].match(/.{1,2}/g).join(" ")}</span></div>
                                        </div>
                                    : 
                                    ""
                                    }
                                </section>
                                <section id="skills">
                                    <Title value="Skills"/>
                                    {skillsData != null ? 
                                        <div className="skills-list">
                                        {skillsData.map((skill) => (
                                            <Skill name={skill["title"]} rate={skill["rate"]} key={skill["id"]} />
                                        ))}
                                    </div>
                                    : 
                                    ""
                                    }
                                </section>
                            </div>
                            <div className="open-authorization" onClick={openAuthorization}><FaCheckDouble/></div>
                            
                        </div>
                        </React.Fragment>,
                        false: <Error/>,
                        null:""
                    }[isOnline]}
                </React.Fragment>,
                null : ""
            }[loggedIn]}
             </div>
        </main>

           
        </React.Fragment>
    )
}

export default Portfolio;