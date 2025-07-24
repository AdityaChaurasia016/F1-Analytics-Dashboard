from flask import Flask
import pandas as pd
from routes.drivers import drivers_bp
from routes.driverstats import driverstats_bp
from routes.drivergraphs import driver_graphs_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


app.register_blueprint(drivers_bp, url_prefix='/api')
app.register_blueprint(driverstats_bp, url_prefix='/api')
app.register_blueprint(driver_graphs_bp, url_prefix='/api')

@app.route('/')
def home():
    return "F1 Analytics Backend is Running!"

@app.route('/data', methods=['GET'])
def get_data():
    data = df.to_dict(orient='records')
    return {'data': data}

df = pd.read_csv('f1_data.csv')
#print(df.head()) 

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
