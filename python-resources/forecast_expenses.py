from flask import Flask, request, jsonify
from statsmodels.tsa.arima.model import ARIMA
import pandas as pd
import psycopg2
import json

app = Flask(__name__)

def connect_to_db():
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        dbname='familyapp',
        user='postgres',
        password='alex'
    )
    return conn

@app.route('/forecast', methods=['POST'])
def forecast_expenses():
    family_id = request.json['familyId']

    # Parse the target date as a JSON object
    target_date_json = json.loads(request.json['targetDate'])
    target_date_str = target_date_json['targetDate']

    target_date = pd.to_datetime(target_date_str)

    # Connect to the database
    conn = connect_to_db()

    # Load the historical data
    df = pd.read_sql_query("SELECT date, amount FROM expenses WHERE family_id = %s", conn, params=[family_id])

    # Process and forecast
    forecasted_expense = process_and_forecast(df, target_date)

    # Convert the forecasted values to JSON and decode it into a dictionary
    forecasted_expense_json = json.loads(forecasted_expense.to_json(orient='records', date_format='iso'))

    return jsonify(forecasted_expense_json)

def process_and_forecast(df, target_date):
    # Convert the dates to pandas datetime format
    df['date'] = pd.to_datetime(df['date'])

    # Set the date as the index
    df.set_index('date', inplace=True)

    # Resample the data to get daily totals
    daily_expenses = df.groupby(pd.Grouper(freq='D')).sum()
    daily_expenses = daily_expenses['amount'].fillna(0)

    # Fit the ARIMA model
    model = ARIMA(daily_expenses, order=(5, 1, 0))
    model_fit = model.fit()

    # Make the forecast
    forecast = model_fit.predict(start=daily_expenses.index[-1] + pd.Timedelta(days=1), end=target_date, typ='levels')

    # Convert the forecast Series to DataFrame and reset the index
    forecast_df = forecast.to_frame().reset_index()

    # Rename the columns
    forecast_df.columns = ['date', 'predicted_expense']

    # Return the entire forecast
    print(forecast_df)
    return forecast_df

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
