/////////////////////////////////////////////////////////////////////////////////
// App.js
// Main app
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////////

import 'intersection-observer';
import handleViewport from 'react-in-viewport';
import './App.css';
import React, { useState } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import stat2 from './assets/stat2.png'
import stat3 from './assets/stat3.png'

/////////////////////////////////////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////////////////////////////////////

// Check for complete input
const check = (values, set_response) => {
  for (let i of Object.values(values)) {
    if (i === null) {
      set_response("Please fill in all inputs");
      return true;
    }
  }
  return false;
}

// Create text input fields for form
const create_input_field = (values, set_values, string, key) => {
  return (
    <div className="Centre" key={key}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text className='Title Adjust Values_micro'>{string[1]}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl aria-label="Amount (to the nearest dollar)"
          onChange={(event) => change_value(event.target.value, values, set_values, string[0])}
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
const SetGender = ({ values, set_values }) => {
  const [gen, set_gen] = useState("Gender");
  return (
    <DropdownButton variant="secondary Box Values_micro" id="dropdown1" title={gen}>
      <Dropdown.Item className='Values_micro'
        onClick={() => {
          change_value(0, values, set_values, "Gender");
          set_gen("Male")
        }}
      >Male</Dropdown.Item>
      <Dropdown.Item className='Values_micro'
        onClick={() => {
          change_value(0, values, set_values, "Gender");
          set_gen("Female")
        }}
      >Female</Dropdown.Item>
    </DropdownButton>
  )
}

// Set Marital Status
const SetMarriageStatus = ({ values, set_values }) => {
  const [gen, set_gen] = useState("Marriage Status");
  let array = [[0, "Unknown"], [1, "Divorced"], [2, "Single"], [3, "Married"]]
  return (
    <DropdownButton variant="secondary Box Values_micro" id="dropdown1" title={gen}>
      {array.map((detail, index) => {
        return (
          <Dropdown.Item key={index} className='Values_micro'
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

// Set Income status
const SetIncomeCategory = ({ values, set_values }) => {
  const [gen, set_gen] = useState("Income Category");
  let array = [
    [0, "Unknown"], [1, "Less than $40K"], [2, "$40K - $60K"],
    [3, "$60K - $80K"], [4, "$80K - $120K"], [5, "$120K +"]
  ]
  return (
    <DropdownButton variant="secondary Box Values_micro" id="dropdown1" title={gen}>
      {array.map((detail, index) => {
        return (
          <Dropdown.Item key={index} className='Values_micro'
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

const Generate_fields = (values, set_values) => {
  let array_values = [
    ['Dependent_count', 'Dependent Count'],
    ['Total_Relationship_Count', 'Total Relationship Count'],
    ['Months_Inactive_12_mon', 'Months Inactive (12 Months)'],
    ['Contacts_Count_12_mon', 'Contact Count (12 Months)'],
    ['Total_Revolving_Bal', 'Total Revolving Balance'],
    ['Total_Amt_Chng_Q4_Q1', 'Total Amount Change'],
    ['Total_Trans_Amt', 'Total Transaction Amount'],
    ['Total_Trans_Ct', 'Total Transaction Count'],
    ['Total_Ct_Chng_Q4_Q1', 'Total Transaction Change']
  ]
  return (
    <div>
      {array_values.map((strings, index) => {
        return create_input_field(values, set_values, strings, index)
      })}
    </div>
  )
}

const Main = () => {
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
    if (check(values, set_response)) return;
    (() => {
      set_response("Calculating... First submit may take a while.")
      axios.post("https://bank-churn-api.herokuapp.com/calculate", values)
        .then(res => {
          console.log(res);
          set_response(res.data)
        }).catch(err => {
          console.log(err)
          set_response("There was an error")
        })
    })();
  }
  return (
    <div className='Margin3'>
      <text className='Desc_para'>Predictor</text>
      <div className='Margin4'>
        <text className='Desc_para Desc_micro'>
          Please refer to the <i>Key Terms</i> section below
        </text>
      </div>
      {Generate_fields(values, set_values)}
      <div className='Row Adjust Centre Hspace'>
        <SetGender values={values} set_values={set_values} />
        <SetMarriageStatus values={values} set_values={set_values} />
        <SetIncomeCategory values={values} set_values={set_values} />
      </div>
      <Button variant="secondary Margin Values_micro" onClick={click}>Submit</Button>
      <Card className="text-center Centre Values_micro">
        <Card.Header>Prediction</Card.Header>
        <Card.Body>
          <Card.Title>{response}</Card.Title>
        </Card.Body>
      </Card>
    </div>
  );
}

const Animation = (props, string) => {
  const { inViewport, enterCount } = props;
  if (inViewport && enterCount === 1) return string;
  else return string + '_without';
}

const Slot_1 = (props) => {
  const { forwardedRef } = props;
  return (
    <div ref={forwardedRef} className={Animation(props, 'Enter')}>
      <Main />
    </div>
  );
};

const Slot_2 = (props) => {
  const { forwardedRef } = props;
  return (
    <div ref={forwardedRef} className={Animation(props, 'Enter')}>
      <div className='Text_box Column Adjust Big'>
        <div className='Margin2'>
          <text className='Desc_para'>Key Terms</text>
        </div>
        <text className='Desc_para Desc_micro'>
          <strong>Dependent Count</strong> - number of dependent children of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Relationship Count</strong> - Total number of products held by the assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Months Inactive</strong> - Assessee's total inactive months in the past 12 months
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Contact Count</strong> - Assessee's total number of contacts with bank in the past 12 months
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Revolving Balance</strong> - Total revolving balance on credit card of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Amount Change</strong> - Change in transaction amount (Q4 over Q1) of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Transaction Amount</strong> - Assessee's total transaction amount in the past 12 months
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Transaction Count</strong> - Assessee's total number of transactions in the past 12 months
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Total Transaction Change</strong> - Change in number of transactions (Q4 over Q1) of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Gender</strong> - Gender of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Marriage Status</strong> - Marriage status of assessee
        </text>
        <text className='Desc_para Desc_micro'>
          <strong>Income Category</strong> - Income category of assessee
        </text>
      </div>
    </div>
  );
};

const Slot_3 = (props) => {
  const { forwardedRef } = props;
  return (
    <div ref={forwardedRef} className={Animation(props, 'Enter')}>
      <div className='Stat_box Column Adjust'>
        <text className='Desc_para Adjust'>Current Statistics</text>
        <div className="Adjust Stat_box Row2">
          <img alt="statistic 2" className="Stat1" src={stat2} />
          <img alt="statistic 3" className="Stat1" src={stat3} />
        </div>
      </div>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////////////////

// Slots
const Slot1 = handleViewport(Slot_1);
const Slot2 = handleViewport(Slot_2);
const Slot3 = handleViewport(Slot_3);

/////////////////////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////////////////////

// Main app for export
const App = () => {
  return (
    <div className="App Adjust">
      <div className="Background Adjust Column Enter">
        <text className='Header_title'>FutureSpace</text>
        <text className='Header_title Desc_title'>Free Customer-Churning
        Prediction Tool</text>
      </div>
      <div className='Text_box Column Adjust Enter'>
        <div className='Margin2'>
          <text className='Desc_para'>About</text>
        </div>
        <text className='Desc_para Desc_micro'>
          FutureSpace is a machine-learned predictor that estimates the likelihood
          of a current bank customer leaving to another competitor (attrition).
        </text>
      </div>
      <Slot3 />
      <Slot1 />
      <Slot2 />
    </div>
  );
}

export default App;
