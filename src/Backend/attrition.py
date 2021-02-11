################################################################################
# attrition.js
# Predict customer loyalty (bank) using multiple regression.
# Dataset from: https://www.kaggle.com/sakshigoyal7/credit-card-customers
################################################################################

################################################################################
# Imports
################################################################################

import pandas as pd
import statsmodels.api as sm 
from sklearn.preprocessing import StandardScaler
from flask import Flask
import json

################################################################################
# Flask
################################################################################

app = Flask(__name__)

################################################################################
# Regression Logic
################################################################################

# Modify data with numerical values for training
df = pd.read_excel('./customer.xlsx').replace(
    {
        'Attrition_Flag': {
            'Existing Customer' : 0, 
            'Attrited Customer' : 1
        },
        'Gender': {
            'M' : 0, 
            'F' : 1
        }, 
        'Education_Level': {
            'Unknown': 0,
            'Uneducated': 1,
            'High School': 2,
            'Graduate': 3,
            'College': 4,
            'Post-Graduate': 5, 
            'Doctorate': 6
        }, 
        'Marital_Status': {
            'Unknown': 0,
            'Divorced': 1,
            'Single': 2,
            'Married': 3
        },
        'Income_Category': {
            'Unknown': 0,
            'Less than $40K': 1,
            '$40K - $60K': 2,
            '$60K - $80K': 3,
            '$80K - $120K': 4, 
            '$120K +': 5
        }
    }
)

# POST after prediction made
@app.route('/calculate', methods=['GET', 'POST'])
def regression():
    scale = StandardScaler()
    X = df[[
            'Gender', 'Dependent_count', 
            'Marital_Status', 'Income_Category', 'Total_Relationship_Count',
            'Months_Inactive_12_mon', 'Contacts_Count_12_mon', 'Total_Revolving_Bal',
            'Total_Amt_Chng_Q4_Q1', 'Total_Trans_Amt', 'Total_Trans_Ct', 'Total_Ct_Chng_Q4_Q1',
        ]]
    y = df['Attrition_Flag']
    X = scale.fit_transform(X.to_numpy())
    est = sm.OLS(y, X).fit()
    scaled = scale.transform([[1, 0, 3, 1, 2, 3, 3, 0, 1.047, 692, 16, 0.6]])
    predicted = est.predict(scaled[0])
    result = {
        "value": predicted[0]
    }
    return(json.dumps(result))

if __name__ == '__main__':
    app.run()

# Tests
# Attrited: [[1, 0, 3, 1, 2, 3, 3, 0, 1.047, 692, 16, 0.6]]
# Existing: [[0, 3, 3, 4, 4, 3, 3, 1435, 0.787, 1217, 27, 0.8]]
# Attrited: [[0, 4, 2, 5, 2, 4, 2, 2102, 0.997, 1276, 26, 0.733]]
# Existing: [[0, 4, 2, 4, 4, 1, 4, 1515, 0.592, 1293, 32, 0.6]]
# Attrited: [[0, 2, 3, 5, 3, 2, 0, 1536, 1.317, 1592, 34, 1.0]]

