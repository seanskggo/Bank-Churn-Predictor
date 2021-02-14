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
from flask import Flask, request
import json

################################################################################
# Flask
################################################################################

app = Flask(__name__)

################################################################################
# Regression Logic
################################################################################

# Modify data with numerical values for training
df = pd.read_excel('./customer.xlsx', engine='openpyxl').replace(
    {
        'Attrition_Flag': {
            'Existing Customer' : 0, 
            'Attrited Customer' : 1
        },
        'Gender': {
            'M' : 0, 
            'F' : 1
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
@app.route('/calculate', methods=['POST'])
def regression():
    # Get JSON data from POST request
    rec = request.get_json()
    # Process/error check JSON data
    reg_values = list()
    for i, j in rec.items():
        try:
            reg_values.append(float(j))
        except:
            return("All values should be numerical")
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
    scaled = scale.transform([reg_values])
    predicted = round(est.predict(scaled[0])[0] * 100, 2)
    if predicted >= 99.99:
        predicted = 99.99
    elif predicted <= 0.01:
        predicted = 0.01
    return(f"This customer is {predicted}% likely to leave")

if __name__ == '__main__':
    app.run()
