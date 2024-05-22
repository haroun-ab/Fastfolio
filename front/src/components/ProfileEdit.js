import React, {useEffect, useState} from "react";
import '../styles/components/Modal.css'
import FormField from "./FormField";
import { FaCamera } from "react-icons/fa";
import Button from "./Button";

function ProfileEdit (props) {
    const [selectedImage, setSelectedImage] = useState(null);
    console.log(props.data);
    const nameRegexp = new RegExp('^[A-Za-zéÉèÈêÊëËûÛüÜîÎïÏôÔöÖâÂäÄàÀçÇ-]{1,}$');

    ///// VALIDATION CHAMPS /////
    function isFirstNameValid() {
        const input = document.querySelector('#firstname');
        onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the first name");
        return onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the first name");
    }

    function isLastNameValid() {
        const input = document.querySelector('#lastname');
        onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the last name")
        return onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the last name")    
    }

    function isBirthDateValid() {
        const input = document.querySelector('#birthdate');
        const errorContainer = input.parentNode.querySelector('.error');
        if (Number.isNaN(Date.parse(input.value))) {
            errorContainer.innerHTML = 'This field is required';
            return false;
        }else{
            let date = new Date(input.value)
            let now = new Date(Date.now());
            if (now.getFullYear() - date.getFullYear() < 3) {
                errorContainer.innerHTML = 'You must be over 3 years old';
                return false;
            } else {
                errorContainer.innerHTML = '';
                return [true, input.value];
            }
        }
    }

    function isPhoneValid() {
        const input = document.querySelector('#phone');
        const errorContainer = input.parentNode.querySelector('.error');
        
        if (input.value.length != 10) {
            errorContainer.innerHTML = 'Phone number must contain 10 numbers';
            return false;
        } else{

            if (Number.isNaN(Number(input.value))) {
                errorContainer.innerHTML = 'Only numbers are allowed';
                return false;
            } else {
                errorContainer.innerHTML = '';
                return [true, input.value];
            }
        }
    }

    function isSpecialityValid() {
        const input = document.querySelector('#speciality');
        onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the speciality");
        return onlyLetterOrNot(input, "This field is required", "Only letters are allowed in the speciality");
    }

    function onlyLetterOrNot(input, emptyMsg, notValidMsg) {
        const errorContainer = input.parentNode.querySelector('.error');
        if (input.value < 1) {
            errorContainer.innerHTML =  emptyMsg;
            return false;
        }else{
            if (!nameRegexp.test(input.value)) {
                errorContainer.innerHTML = notValidMsg;
                return false;
            } else {
                errorContainer.innerHTML = '';
                return [true, input.value];
            }
        }
    }
    
    async function submitForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target)

        const firstName = isFirstNameValid();
        const lastName = isLastNameValid();
        const birthDate = isBirthDateValid();
        const speciality = isSpecialityValid();
        const phone = isPhoneValid();

        const bio = document.querySelector('#biography').value;

        if (firstName[0] && lastName[0] && birthDate[0] && speciality[0] && phone[0]) {
            const dataObj = {
                firstName : firstName[1],
                lastName : lastName[1],
                birthDate : birthDate[1],
                speciality : speciality[1],
                phone : phone[1],
                bio : bio, 
            }

            formData.append('data', JSON.stringify(dataObj));
            // // requete fetch 
            console.log(dataObj);
            console.log(formData);

            const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/update-profile`, {
                method : 'POST',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : formData
            });
            const contentResponse = await response.json();
            
            console.log(contentResponse);
            
            //mettre à jour les states

        } 
    }

    function selectProfilePic(e) {
        console.log(e.target.files[0]);
        console.log(e.target.files);
        document.querySelector('.select-picture img').src = e.target.value;
        
        setSelectedImage(URL.createObjectURL(e.target.files[0]));

        // mettre à jour le states
    }

    console.log(props.data.birthDate);
    return(
        <form onSubmit={submitForm} encType="multipart/form-data">
        <h3>Profile</h3>
        <div className="form-control">
            <div className="select-picture">
                {/* <form onSubmit={submitProfilePic}> */}
                <FormField fieldTagName="input" type="file" placeholder="picture" id="picture" name="fileInput" onChange={selectProfilePic}/>
                <p className='error error-picture'></p>
                <img src={ selectedImage != null ? selectedImage : process.env.REACT_APP_DOMAIN_API + "/uploads/" + props.data['img']}/>
                <FaCamera/>
                {/* </form> */}
            </div>
        </div>
         <div className="form-control">
            <FormField fieldTagName="input" type="text" placeholder="First name" id="firstname" defaultValue={props.data['firstName']} onChange={isFirstNameValid}/>
            <p className='error error-firstname'></p>
        </div>
        <div className="form-control">
            <FormField fieldTagName="input" type="text" placeholder="Last name" id="lastname" defaultValue={props.data['lastName']} onChange={isLastNameValid}/>
            <p className='error error-lastname'></p>
        </div>
        <div className="form-control">
            <FormField fieldTagName="input" type="date" placeholder="Birth date" id="birthdate" defaultValue={props.data['birthDate']} onChange={isBirthDateValid} />
            <p className='error error-birthdate'></p>
        </div> 
        <div className="form-control">
            <FormField fieldTagName="input" type="text" placeholder="Speciality" id="speciality" defaultValue={props.data['speciality']} onChange={isSpecialityValid}/>
            <p className='error error-speciality'></p>
        </div>
        <div className="form-control">
            <FormField fieldTagName="input" type="tel" placeholder="phone" id="phone" defaultValue={props.data['phone']} onChange={isPhoneValid}/>
            <p className='error error-biography'></p>
        </div>  
        <div className="form-control">
            <FormField fieldTagName="textarea" type="text" placeholder="Bio" id="biography" defaultValue={props.data['bio']} onChange={isSpecialityValid}/>
            <p className='error error-biography'></p>
        </div>  
        <div className="form-control">
            <Button tagName="input" type="submit" btnValue="Save"/>       
        </div> 
    </form>
    );
}

export default ProfileEdit;