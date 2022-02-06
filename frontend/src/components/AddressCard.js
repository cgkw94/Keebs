import React from "react";

const AddressCard = (props) => {
  return (
    <div>
      <p>{props.address_line1}</p>
      <p>{props.address_line2}</p>
      <p>{props.postal_code}</p>
      <p>{props.country}</p>
      <p>{props.address_type}</p>
    </div>
  );
};

export default AddressCard;
