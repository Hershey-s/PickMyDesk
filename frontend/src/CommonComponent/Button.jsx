import React from "react";
import { NavLink } from "react-router-dom";

export default function Button(props) {
  return (
    <>
      <button>
        <NavLink
          className={`text-black  px-3 py-3 hover:bg-gray-200/80  hover:text-purple-800 rounded-full font-bold   ${props.styles} `}
          to={props.link}
        >
          {props.name}
        </NavLink>
      </button>
    </>
  );
}
