################################################################################
# attrition.js
# Predict customer loyalty (bank) using multiple regression.
################################################################################

################################################################################
# Imports
################################################################################

import pandas as pd
import statsmodels.api as sm 
from sklearn.preprocessing import StandardScaler

################################################################################
# Regression Logic
################################################################################

scale = StandardScaler()
df = pd.read_excel('customer.xlsx').replace(
    {
        'Attrition_Flag': {
            'Existing Customer' : 0, 
            'Attrited Customer' : 1
        },
        'Gender': {
            'M' : 0, 
            'F' : 1
        }
    }
)
X = df[['Customer_Age', 'Gender']]
y = df['Attrition_Flag']

X = scale.fit_transform(X.to_numpy())
est = sm.OLS(y, X).fit()
print(est.summary())

scaled = scale.transform([[90, 1]])
print("\n--------- Result ---------\n")
predicted = est.predict(scaled[0])
print(str(predicted) + "\n")