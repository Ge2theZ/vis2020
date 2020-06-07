import pandas
import numpy as np

#only read in those columns
cols = ["Genre","Name","ESRB_Rating","Platform","Publisher","Developer",
        "VGChartz_Score","Critic_Score","User_Score","Total_Shipped",
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

print("after preprocessing: " + str(len(df.index)) + " rows")
print("writing to csv")
df.to_csv("out.csv", index=False)
