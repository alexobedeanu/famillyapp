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
    query = "SELECT date, amount FROM expenses WHERE family_id = %s ORDER BY date ASC"
    df = pd.read_sql_query(query, conn, params=[family_id])

    # Process and forecast
    forecasted_expense = process_and_forecast(df, target_date)

    # Convert the forecasted values to JSON and decode it into a dictionary
    forecasted_expense_json = json.loads(forecasted_expense.to_json(orient='records', date_format='iso'))

    return jsonify(forecasted_expense_json)

def process_and_forecast(df, target_date):
    # Convert the dates to pandas datetime format and set as the index
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)

    # Compute the number of periods between the last date in history and the target date
    num_periods = (target_date - df.index[-1]).days

    # Specify the frequency of the data (e.g., 'D' for daily, 'M' for monthly)
    freq = 'D'

    # Resample the data to the specified frequency
    resampled_df = df.resample(freq).mean()

    # Fill any missing values in the resampled data
    resampled_df = resampled_df.fillna(method='ffill')

    # Fit the ARIMA model
    model = ARIMA(resampled_df['amount'], order=(5, 1, 0))
    model_fit = model.fit()
    print(model_fit.summary())
    # Make the forecast
    forecast = model_fit.get_forecast(steps=num_periods)

    # Extract the forecasted values and confidence intervals
    forecast_values = forecast.predicted_mean
    forecast_ci = forecast.conf_int()

    # Create a date range for the forecasted values
    forecast_dates = pd.date_range(start=resampled_df.index[-1] + pd.DateOffset(days=1), periods=num_periods, freq=freq)

    # Create a DataFrame for the forecasted values and confidence intervals
    forecast_df = pd.DataFrame({'date': forecast_dates, 'predicted_expense': forecast_values})
    forecast_df['lower_ci'] = forecast_ci.iloc[:, 0]
    forecast_df['upper_ci'] = forecast_ci.iloc[:, 1]
    # print (forecast_df)
    return forecast_df

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
