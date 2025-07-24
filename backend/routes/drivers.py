from flask import Blueprint, jsonify
import pandas as pd

drivers_bp = Blueprint('drivers', __name__)

# Load data
df = pd.read_csv('f1_data.csv')

@drivers_bp.route('/drivers', methods=['GET'])
def get_drivers():
    drivers = df[['driver', 'forename', 'surname']].drop_duplicates()
    drivers_list = sorted(
        [
            {
                'driver': row['driver'],
                'full_name': f"{row['forename']} {row['surname']}"
            }
            for _, row in drivers.iterrows()
        ],
        key=lambda x: x['full_name']
    )
    return jsonify(drivers_list)