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
df = pd.read_excel('customer.xlsx')

X = df[['Attrition_Flag', 'Customer_Age', 'Gender']]

print(X)


# y = df['MSRP']

# X = scale.fit_transform(X.to_numpy())
# print(X)
# est = sm.OLS(y, X).fit()
# print(est.summary())

# scaled = scale.transform([[2011, 300, 6]])
# print(scaled)
# predicted = est.predict(scaled[0])
# print(predicted)