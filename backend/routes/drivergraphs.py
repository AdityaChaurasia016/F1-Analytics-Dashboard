from flask import Blueprint, jsonify
import pandas as pd
import numpy as np


driver_graphs_bp = Blueprint('driver_graphs', __name__)


df = pd.read_csv('f1_data.csv')

@driver_graphs_bp.route('/driveryears/<driver_name>', methods=['GET'])
def get_driver_years(driver_name):
    try:
        
        driver_data = df[df['driver'] == driver_name]
        
        
        available_years = driver_data['year'].unique().tolist()
        available_years.sort(reverse=True)  
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'available_years': available_years
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@driver_graphs_bp.route('/driverpoints/<driver_name>/<int:season_year>', methods=['GET'])
def get_driver_points(driver_name, season_year):
    try:
        # Filter data for the selected driver and year
        driver_data = df[(df['driver'] == driver_name) & (df['year'] == season_year)]
        
        # Group by Grand Prix name and sum points, then sort by round
        points_by_round = driver_data.groupby('gp_name').agg({
            'points': 'sum',
            'round': 'first'  # Use the first occurrence of 'round' for each GP
        }).reset_index().sort_values('round')
        
        # Convert the DataFrame to a dictionary for JSON serialization
        points_data = points_by_round.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'season_year': season_year,
            'points_by_round': points_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@driver_graphs_bp.route('/driverpodiums/<driver_name>/<int:season_year>', methods=['GET'])
def get_driver_podiums(driver_name, season_year):
    try:
        # Filter data for the selected driver and year
        driver_data = df[(df['driver'] == driver_name) & (df['year'] == season_year)]
        
        # Count podiums (positionOrder <= 3), group by GP, and sort by round
        podiums_by_round = driver_data[driver_data['positionOrder'] <= 3].groupby('gp_name').agg(
            podiums=('positionOrder', 'size'),  # Explicitly name the column
            round=('round', 'first')  # Use the first occurrence of 'round' for each GP
        ).reset_index().sort_values('round')
        
        # Convert the DataFrame to a dictionary for JSON serialization
        podiums_data = podiums_by_round.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'season_year': season_year,
            'podiums_by_round': podiums_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@driver_graphs_bp.route('/driverstandings/<driver_name>/<int:season_year>', methods=['GET'])
def get_driver_standings(driver_name, season_year):
    try:
        # Filter data for the selected season
        season_data = df[df['year'] == season_year]
        
        # Select relevant columns: driver, round, points_standings
        standings_data = season_data[['driver', 'round', 'points_standings']]
        
        # Convert the DataFrame to a dictionary for JSON serialization
        standings_data_dict = standings_data.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,  # The currently selected driver
            'season_year': season_year,
            'standings_data': standings_data_dict  # Data for all drivers
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@driver_graphs_bp.route('/driverstartingpositions/<driver_name>/<int:season_year>', methods=['GET'])
def get_driver_starting_positions(driver_name, season_year):
    try:
        # Filter data for the selected driver and year
        driver_data = df[(df['driver'] == driver_name) & (df['year'] == season_year)]
        
        # Group by Grand Prix and get starting position and round
        starting_positions = driver_data.groupby('gp_name').agg({
            'grid': 'first',  # Get the first starting position for each GP
            'round': 'first'  # Use the first occurrence of 'round' for each GP
        }).reset_index().sort_values('round')
        
        # Convert DataFrame to a dictionary for JSON serialization
        starting_positions_data = starting_positions.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'season_year': season_year,
            'starting_positions': starting_positions_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@driver_graphs_bp.route('/driverpodiumsbyseason/<driver_name>', methods=['GET'])
def get_driver_podiums_by_season(driver_name):
    try:
        # Filter data for the selected driver
        driver_data = df[df['driver'] == driver_name]
        
        # Group by year and count podiums (positionOrder <= 3)
        podiums_by_season = driver_data[driver_data['positionOrder'] <= 3].groupby('year').agg(
            podiums=('positionOrder', 'size')  # Count podiums per season
        ).reset_index()
        
        # Convert the DataFrame to a dictionary for JSON serialization
        podiums_data = podiums_by_season.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver': driver_name,
            'podiums_by_season': podiums_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@driver_graphs_bp.route('/compare_drivers/<driver1>/<driver2>/<int:season_year>', methods=['GET'])
def compare_drivers(driver1, driver2, season_year):
    try:
        # Filter data for the selected year
        season_data = df[df['year'] == season_year]
        
        # Filter data for the first driver
        driver1_data = season_data[season_data['driver'] == driver1]
        driver1_standings = driver1_data[['round', 'points_standings']].rename(columns={'points_standings': 'driver1_standings'})
        
        # Filter data for the second driver
        driver2_data = season_data[season_data['driver'] == driver2]
        driver2_standings = driver2_data[['round', 'points_standings']].rename(columns={'points_standings': 'driver2_standings'})
        
        # Merge the two drivers' standings on 'round'
        combined_standings = pd.merge(driver1_standings, driver2_standings, on='round', how='outer').sort_values('round')
        
        # Fill NaN values (if one driver didn't compete in a specific round)
        combined_standings = combined_standings.fillna(0)
        
        # Convert the DataFrame to a dictionary for JSON serialization
        combined_standings_dict = combined_standings.to_dict(orient='records')
        
        # Return the result as JSON
        return jsonify({
            'driver1': driver1,
            'driver2': driver2,
            'season_year': season_year,
            'combined_standings': combined_standings_dict
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500