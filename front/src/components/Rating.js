import React, { useEffect, useState } from "react";
import "../styles/components/Rating.css";

function Rating(props) {
    let ratingInput;

    function changeRate(){
        ratingInput = document.querySelector(`input[value="${props.value}"]`);
        console.log(ratingInput);
        console.log(props.value);
        ratingInput.checked = true;

        ratingInput = document.querySelectorAll("input[type='radio']");
        ratingInput.forEach(star => {
            star.onchange = () => {
                ratingInput.checked = true;

                console.log(star.value);
            } 
        });  
    }
    
    useEffect(() => {
        changeRate();
    },[])

    useEffect(() => {
        changeRate();
    }, ratingInput)
    
 
        return(
            <div className="rate">
                <input type="radio" id="star5" name="rate" value="5" />
                <label htmlFor="star5" title="text">5 stars</label>
                <input type="radio" id="star4" name="rate" value="4" />
                <label htmlFor="star4" title="text">4 stars</label>
                <input type="radio" id="star3" name="rate" value="3" />
                <label htmlFor="star3" title="text">3 stars</label>
                <input type="radio" id="star2" name="rate" value="2" />
                <label htmlFor="star2" title="text">2 stars</label>
                <input type="radio" id="star1" name="rate" value="1" />
                <label htmlFor="star1" title="text">1 star</label>
            </div>  
        )
  
}

export default Rating