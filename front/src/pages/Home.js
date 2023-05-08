import React  from "react";
import '../styles/home.css'
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
function App() {
    return (
    <React.Fragment>
        <Header/>
        <main>
                <section className="bg">
                    <div className="content">
                        <h2>Sign up and create your porfolio for free in less than 10 minutes&nbsp;!</h2>
                        <Button btnValue="Inscrivez-vous" href='/signup'/>
                    </div>
                    {/*sign up and create your porfolio for free in less than 10 minutes*/}
                </section>
                <section className="middle">
                <div className="content">
                        <img className="illustration" src="illustration.gif"/>
                        <div className="text">
                            <div className="catchphrase">
                                <span>Create your portfolio in two clicks</span> <br/>
                                <span>and all this </span>   
                                <span>FOR FREE !</span>
                            </div>
                            <div className="login-signup">
                                <div className="login">
                                    <span>If you have an account,</span>
                                    <Button btnValue="Log in" href="/login"></Button>
                                </div>
                                <div className="signup">
                                    <span>else,</span>
                                    <Button btnValue="Sing up" href="signup"></Button>
                                </div>
                            </div>
                        </div>
                </div>
                </section>
                <section className="bg">
                    <div className="content">
                        <h2>Do you have any suggestions for us to improve our services&nbsp;?</h2>
                        <Button btnValue="Connectez-vous"/>
                    </div>
                </section>
            {/* <Button/> */}
        </main>
        <Footer/>
        
    </React.Fragment>
    );
  }
  
  export default App;
  