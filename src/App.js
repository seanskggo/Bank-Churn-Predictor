/////////////////////////////////////////////////////////////////////////////////
// App.js
// Main app
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////////

import './App.css';
import React, { useState } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

/////////////////////////////////////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////////////////////////////////////

// Check for complete input
const check = (values, set_response) => {
  for (let i of Object.values(values)) {
    if (i === null) {
      set_response("Please fill in all inputs");
      return
    }
  }
}

// Create text input fields for form
const create_input_field = (values, set_values, string) => {
  return (
    <div className="Centre">
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>{string}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl aria-label="Amount (to the nearest dollar)"
          onChange={(event) => change_value(event.target.value, values, set_values, string)}
        />
      </InputGroup>
    </div>
  )
}

// Change a value for given form
const change_value = (event, values, set_values, string) => {
  let temp = { ...values }
  temp[string] = event;
  set_values(temp)
}

// Set Gender 
const Set_gender = (values, set_values) => {
  const [gen, set_gen] = useState("Gender");
  return (
    <DropdownButton variant="secondary" id="dropdown1" title={gen}>
      <Dropdown.Item
        onClick={() => {
          change_value(0, values, set_values, "Gender");
          set_gen("Male")
        }}
      >Male</Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          change_value(0, values, set_values, "Gender");
          set_gen("Female")
        }}
      >Female</Dropdown.Item>
    </DropdownButton>
  )
}

// Set Marital Status
const Set_marriage_status = (values, set_values) => {
  const [gen, set_gen] = useState("Marriage Status");
  let array = [[0, "Unknown"], [1, "Divorced"], [2, "Single"], [3, "Married"]]
  return (
    <DropdownButton variant="secondary" id="dropdown1" title={gen}>
      {array.map((detail) => {
        return (
          <Dropdown.Item
            onClick={() => {
              change_value(detail[0], values, set_values, "Marital_Status");
              set_gen(detail[1])
            }}
          >{detail[1]}</Dropdown.Item>
        )
      })}
    </DropdownButton>
  )
}

// Set Marital Status
const Set_income_category = (values, set_values) => {
  const [gen, set_gen] = useState("Income Category");
  let array = [
    [0, "Unknown"], [1, "Less than $40K"], [2, "$40K - $60K"], 
    [3, "$60K - $80K"], [4, "$80K - $120K"], [5, "$120K +"]
  ]
  return (
    <DropdownButton variant="secondary" id="dropdown1" title={gen}>
      {array.map((detail) => {
        return (
          <Dropdown.Item
            onClick={() => {
              change_value(detail[0], values, set_values, "Income_Category");
              set_gen(detail[1])
            }}
          >{detail[1]}</Dropdown.Item>
        )
      })}
    </DropdownButton>
  )
}


const App = () => {
  const [response, set_response] = useState("");
  const [values, set_values] = useState({
    'Gender': null,
    'Dependent_count': null,
    'Marital_Status': null,
    'Income_Category': null,
    'Total_Relationship_Count': null,
    'Months_Inactive_12_mon': null,
    'Contacts_Count_12_mon': null,
    'Total_Revolving_Bal': null,
    'Total_Amt_Chng_Q4_Q1': null,
    'Total_Trans_Amt': null,
    'Total_Trans_Ct': null,
    'Total_Ct_Chng_Q4_Q1': null,
  });
  const click = () => {
    // check(values, set_response);
    // you have to post to /calulate 
    const getData = async () => {
      const rep = await axios.get("/calculate")
      set_response("The chance of attrition is: " + rep.data.value);
    };
    getData();
    console.log(values)
  }
  return (
    <div className="App">
      <text>{response}</text>
      {create_input_field(values, set_values, "Total_Revolving_Bal")}
      {Set_gender(values, set_values)}
      {Set_marriage_status(values, set_values)}
      {Set_income_category(values, set_values)}
      <Button variant="secondary" onClick={click}>Submit</Button>
    </div>
  );
}

export default App;
