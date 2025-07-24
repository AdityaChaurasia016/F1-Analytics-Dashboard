from flask import Blueprint, jsonify
import pandas as pd
import numpy as np

# Create a Blueprint for driver stats
driverstats_bp = Blueprint('driverstats', __name__)

# Load the data (you can also pass the DataFrame from app.py if needed)
df = pd.read_csv('f1_data.csv')

@driverstats_bp.route('/driverstats/<driver_name>', methods=['GET'])
def get_driver_stats(driver_name):
    try:
        # Filter the DataFrame for the specific driver
        driver_data = df[df['driver'] == driver_name]
        
        # Compute total laps
        total_laps = driver_data['laps'].sum()
        
        # Compute total races (using unique race IDs)
        total_races = driver_data['raceId'].nunique()
        
        # Compute total wins (where positionOrder == 1)
        total_wins = driver_data[driver_data['positionOrder'] == 1].shape[0]
        
        # Compute total podiums (where positionOrder <= 3)
        total_podiums = driver_data[driver_data['positionOrder'] <= 3].shape[0]
        
        # Compute total fastest laps (where fastest_lap_rank == 1)
        total_fastest_laps = driver_data[driver_data['fastest_lap_rank'] == 1].shape[0]
        
        # Compute total pole positions (where grid == 1)
        total_pole_positions = driver_data[driver_data['grid'] == 1].shape[0]
        
        # Compute average qualifying position (mean of 'grid' column, floored to nearest integer)
        avg_qualifying_pos = int(np.floor(driver_data['grid'].mean()))
        
        # Compute best finishing position in races (minimum value in positionOrder)
        best_position = driver_data['positionOrder'].min()
        
        # Compute most successful track (most frequent track where driver achieved best_position)
        best_tracks = driver_data[driver_data['positionOrder'] == best_position]
        most_successful_track = best_tracks['gp_name'].mode().values[0] if not best_tracks.empty else "N/A"
        
        # Compute best and worst finishes per track
        best_finishes = driver_data.groupby('gp_name')['positionOrder'].min()
        worst_finishes = driver_data.groupby('gp_name')['positionOrder'].max()
        
        # Combine best and worst finishes into a DataFrame
        best_worst_finishes = pd.DataFrame({
            'Best Finish': best_finishes,
            'Worst Finish': worst_finishes
        }).reset_index()  # Convert gp_name from index to a column
        
        # Compute total points scored by the driver in their career
        total_points = driver_data['points'].sum()
        
        # Convert the DataFrame to a dictionary for JSON serialization
        best_worst_finishes_dict = best_worst_finishes.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'total_laps': int(total_laps),  # Convert to int for JSON serialization
            'total_races': int(total_races),  # Convert to int for JSON serialization
            'total_wins': int(total_wins),  # Convert to int for JSON serialization
            'total_podiums': int(total_podiums),  # Convert to int for JSON serialization
            'total_fastest_laps': int(total_fastest_laps),  # Convert to int for JSON serialization
            'total_pole_positions': int(total_pole_positions),  # Convert to int for JSON serialization
            'avg_qualifying_pos': avg_qualifying_pos,  # Average starting position
            'best_position': int(best_position),  # Best finishing position achieved
            'most_successful_track': most_successful_track,  # Most successful track
            'best_worst_finishes': best_worst_finishes_dict,  # Best and worst finishes per track
            'total_points': float(total_points)  # Total points scored in career
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500