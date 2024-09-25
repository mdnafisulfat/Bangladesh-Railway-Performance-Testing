# Bangladesh-Railway-Performance-Testing
# Bangladesh Railway Performance Test

## Overview
This JMeter test checks the performance of the Bangladesh Railway system by simulating 50 users searching for trains. The test includes:
- Selecting 'From' and 'To' locations
- Choosing 'Date of Journey'
- Selecting travel class
- Searching and selecting trains

## Test Details
- **Number of Users**: 50
- **Duration**: 1 minute
- **Loop Count**: 1

## Test Plan Setup
1. **Thread Group**:
   - Number of Threads (Users): 50
   - Ramp-Up Period: 60 seconds
   - Loop Count: 1
2. **CSV Data Set Config**: 
   - File: `CSVData/railway_search_data.csv`
   - Use values for each iteration of the test.
3. **HTTP Request Steps**:
   - Send requests to the respective endpoints for:
     1. Selecting 'From' and 'To'
     2. Selecting 'Date of Journey'
     3. Choosing 'Class'
     4. Searching for available trains
     5. Selecting a train
 
