import pandas
import numpy as np

#only read in those columns
cols = ["Genre","Name","ESRB_Rating","Platform","Publisher","Developer",
        "Critic_Score","User_Score","Total_Shipped",
        "Global_Sales","Year","img_url"]
print("reading in csv")
df = pandas.read_csv('orig_dataset.csv', usecols=cols)
print("before preprocessing: " + str(len(df.index)) + " rows")

#remove rows with empty fields
df = df.replace('', np.nan)
df.dropna(subset=['Year'], inplace=True)
df.dropna(subset=['Genre'], inplace=True)
df.dropna(subset=['Publisher'], inplace=True)
df.dropna(subset=['Platform'], inplace=True)
df.dropna(subset=['Name'], inplace=True)

#remove rows which dont have 'Total_Shipped' AND 'Global_Sales'
df.dropna(subset=['Total_Shipped','Global_Sales'], inplace=True, thresh=1)

#combine 'Total_Shipped' AND 'Global_Sales'
df = df.replace(np.nan, '')
df.Global_Sales = df.Global_Sales.map(str) + df.Total_Shipped.map(str)
df = df.drop('Total_Shipped', 1)

#removing rows with 0 sales
df = df[df.Global_Sales != "0.0"]

#convert year float to int
df.Year = df.Year.astype(int)

#calculating sales per year
df['Global_Sales'] = df['Global_Sales'].astype(float)
salesPerYear = df.groupby('Year')['Global_Sales'].sum()

#calculating Market_Share column
df['Market_Share'] = df.apply(lambda row: ((row.Global_Sales/float(salesPerYear[row.Year]))*100), axis=1)

#calculate Market_Share per Year for Genre
tmp = df.groupby(['Year', 'Genre']).agg({'Global_Sales':['sum']})
tmp.columns = ['Sales']
tmp = tmp.reset_index()
tmp['Percentage_per_year'] = tmp.apply(lambda row: '{:0.2f}'.format((row.Sales/float(salesPerYear[row.Year]))*100), axis=1)
tmp.to_json("SalesPerYearGenre.json", orient='records')

print("after preprocessing: " + str(len(df.index)) + " rows")
print("writing to csv")
df.to_json("preprocessed_dataset.json", orient='records')
