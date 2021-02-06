import pandas as pd
import statsmodels.api as sm 
from sklearn.preprocessing import StandardScaler
scale = StandardScaler()
df = pd.read_excel('car_data.xlsx').dropna()

X = df[['Year', 'Engine HP', 'Engine Cylinders']]
y = df['MSRP']

X = scale.fit_transform(X.to_numpy())
print(X)
est = sm.OLS(y, X).fit()
print(est.summary())

scaled = scale.transform([[2011, 300, 6]])
print(scaled)
predicted = est.predict(scaled[0])
print(predicted)