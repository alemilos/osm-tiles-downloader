import math
import sys 

def deg2num(lat_deg, lon_deg, zoom):
  lat_rad = math.radians(lat_deg)
  n = 1 << zoom
  xtile = int((lon_deg + 180.0) / 360.0 * n)
  ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
  return [xtile, ytile]

# Read input from command-line arguments
input_data = sys.argv[0]
bbox = sys.argv[1]
zoom = sys.argv[2]

#Convert str inputs to values
zoom_int = int(zoom)
bbox_float_list = [float(value) for value in bbox.split(',')]

#extract data to genereate tiles number
lat_start, lng_start, lat_end, lng_end = bbox_float_list

NW = deg2num(lat_start, lng_start, zoom_int)
NE = deg2num(lat_start, lng_end, zoom_int)
SW = deg2num(lat_end, lng_start, zoom_int)
SE = deg2num(lat_end, lng_end, zoom_int)

# This is the OUTPUT that Node will extract, dont'remove it 
print(NW, NE, SW, SE)





