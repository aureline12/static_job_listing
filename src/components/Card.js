import React from "react";
import "../styles/card.css";

const Card = ({ img, content, languages, Style }) => {
  return (
    <div className={`card px-4 py-3 mb-3 cardBox ${Style}`}>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div>
            <img src={img} alt="img" />
          </div>
          <div className="card_content ms-4">{content}</div>
        </div>
        <div className="last_content">{languages}</div>
      </div>
    </div>
  );
};

export default Card;
