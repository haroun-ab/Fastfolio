import React, { useState, useEffect} from 'react';
import '../styles/components/SocialMedia.css'
import {FaTwitter, FaLinkedin, FaInstagram, FaFacebook, FaYoutube, FaTwitch, FaEnvelope, FaDribbble ,FaGithub ,FaTiktok ,FaGitlab ,FaSnapchatSquare ,FaReddit, FaBitbucket, FaPinterest, FaDiscord, FaDeviantart, FaTumblr, FaLink} from "react-icons/fa"

function SocialMedia(props) {
   const [smName, setSMName] = useState(null);
    let url =  new URL(props.href);
    const urlWithoutWWW = JSON.stringify(url.hostname).split('www.')[1];
    useEffect(() => {
      setSMName(urlWithoutWWW.split('.')[0]);
    }, [])
  return (
    <a href={props.href} title={props.title} target="_blank">
        {{
          "twitter" : <FaTwitter/>,
          "instagram" : <FaInstagram/>,
          "facebook" : <FaFacebook/>,
          "linkedin" : <FaLinkedin/>,
          "youtube" : <FaYoutube/>,
          "twitch" : <FaTwitch/>,
          "email" : <FaEnvelope/>,
          "dribbble" : <FaDribbble/>,
          "github" : <FaGithub/>,
          "tiktok" : <FaTiktok/>,
          "snapchat" : <FaSnapchatSquare/>,
          "reddit": <FaReddit/>, 
          "gitlab": <FaGitlab/>,
          "bitbucket":<FaBitbucket/>,
          "pinterest":<FaPinterest/>,
          "discord":<FaDiscord/>,
          "deviantart":<FaDeviantart/>,
          "tumblr":<FaTumblr/>,
        }[smName] || <FaLink/>}
    </a>
  );
}

export default SocialMedia;



  // "twitter" : "FaTwitter",
  // "instagram" : "FaInstagram",
  // "facebook" : "FaFacebook",
  // "linkedin" : "FaLinkedin",
  // "youtube" : "FaYoutube",
  // "twitch" : "FaTwitch",
  // "email" : "FaEnvelope",
  // "dribbble" : "FaDribbble",
  // "github" : "FaGithub",
  // "tiktok" : "FaTiktok",
  // "snapchat" : "FaSnapchatSquare",
  // "reddit": "FaSnapchatSquare", 
  // "gitlab": "FaGitlab",
  // "bitbucket":"FaBitbucket",
  // "pinterest":"FaPinterest",
  // "discord":"FaDiscord",
  // "deviantart":"FaDeviantart",
  // "tumblr":"FaTumblr",
  // "other" : "FaLink"
