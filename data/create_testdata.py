import pandas
from pandas import *
import numpy as np

#only read in those columns
cols = ["Genre","Name","ESRB_Rating","Platform","Publisher","Developer",
        "Critic_Score","User_Score","Total_Shipped",
        "Global_Sales","Year","img_url","NA_Sales","PAL_Sales","JP_Sales","Other_Sales"]
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
trippledTmp = pandas.concat([tmp,tmp,tmp])
trippledTmp.to_json("trippled_SalesPerYearGenre.json", orient='records')

#read in dataset with ratings
#only read in those columns
cols = ["Name","Platform","Critic_Score","User_Score","NA_Sales","EU_Sales","JP_Sales","Other_Sales"]
print("reading in rating dataset csv ")
ratingsDf = pandas.read_csv('Video_Games_Sales_with_ratings.csv', usecols=cols)
merged = pandas.merge(df,ratingsDf,on=['Name','Platform'], how='left')
merged['User_Score'] = merged.apply(lambda row: row.User_Score_x if row.User_Score_x != "" else row.User_Score_y , axis=1)
merged['Critic_Score'] = merged.apply(lambda row: row.Critic_Score_x if row.Critic_Score_x != "" else row.Critic_Score_y , axis=1)
merged['NA_Sales'] = merged.apply(lambda row: row.NA_Sales_x if row.NA_Sales_x != "" else row.NA_Sales_y, axis=1)
merged['EU_Sales'] = merged.apply(lambda row: row.EU_Sales if row.EU_Sales != "" else row.PAL_Sales, axis=1)
merged['JP_Sales'] = merged.apply(lambda row: row.JP_Sales_x if row.JP_Sales_x != "" else row.JP_Sales_y, axis=1)
merged['Other_Sales']= merged.apply(lambda row: row.Other_Sales_x if row.Other_Sales_x != "" else row.Other_Sales_y, axis=1)

#drop merge columns
merged = merged.drop('User_Score_x', 1)
merged = merged.drop('User_Score_y', 1)
merged = merged.drop('Critic_Score_x', 1)
merged = merged.drop('Critic_Score_y', 1)
merged = merged.drop('NA_Sales_x', 1)
merged = merged.drop('NA_Sales_y', 1)
merged = merged.drop('JP_Sales_x', 1)
merged = merged.drop('JP_Sales_y', 1)
merged = merged.drop('Other_Sales_x', 1)
merged = merged.drop('Other_Sales_y', 1)
merged = merged.drop('PAL_Sales', 1)
print("merged both datasets")

# convert tbd string to np.nan
merged["User_Score"] = merged["User_Score"].replace('tbd', np.nan)
merged["Critic_Score"]= merged["Critic_Score"].replace('tbd', np.nan)

# convert scores to float
merged["User_Score"] = merged["User_Score"].astype(float)
merged["Critic_Score"] = merged["Critic_Score"].astype(float) 

# if score > 10 divide by 10 
merged["User_Score"] = merged.apply(lambda row: row.User_Score if row.User_Score <= 10.0 else (row.User_Score/10.0), axis=1)
merged["Critic_Score"]= merged.apply(lambda row: row.Critic_Score if row.Critic_Score <= 10.0 else (row.Critic_Score/10.0), axis=1)

concated = pandas.concat([merged, merged, merged])

#insert index
concated["index"] = concated.index;

print("writing to json")
concated.to_json("trippled_dataset.json", orient="records")