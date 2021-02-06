import pandas as pd
import statsmodels.api as sm 
from sklearn.preprocessing import StandardScaler
scale = StandardScaler()
df = pd.read_excel('car_data.xlsx').dropna()

print(len(df))

X = df[['Year', 'Engine HP', 'Engine Cylinders']]
y = df['MSRP']

X = scale.fit_transform(X.to_numpy())
est = sm.OLS(y, X).fit()
print(est.summary())