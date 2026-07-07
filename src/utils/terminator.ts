function getDeclinationAndEqOfTime(date: Date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // days since J2000
  
  const g = (357.529 + 0.98560028 * d) % 360;
  const gRad = g * Math.PI / 180;
  
  const q = (280.459 + 0.98564736 * d) % 360;
  
  const l = (q + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad)) % 360;
  const lRad = l * Math.PI / 180;
  
  const e = 23.439 - 0.00000036 * d;
  const eRad = e * Math.PI / 180;
  
  const dRad = Math.asin(Math.sin(eRad) * Math.sin(lRad));
  
  let raRad = Math.atan2(Math.cos(eRad) * Math.sin(lRad), Math.cos(lRad));
  let ra = (raRad * 180 / Math.PI) % 360;
  if (ra < 0) ra += 360;
  
  const rq = q % 360;
  let eot = (rq - ra) * 4;
  if (eot > 20) eot -= 1440;
  if (eot < -20) eot += 1440;
  
  return { declination: dRad * 180 / Math.PI, eqOfTime: eot };
}

import type { Feature, Polygon, FeatureCollection, LineString } from 'geojson';

export function getTerminatorGeoJSON(date: Date, resolution: number = 2): Feature<Polygon> {
  const { declination, eqOfTime } = getDeclinationAndEqOfTime(date);
  
  let sunLng = 180 - (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + eqOfTime / 60) * 15;
  sunLng = ((sunLng + 180) % 360) - 180; // Normalize between -180 and 180
  
  const latLngs: [number, number][] = [];
  
  for (let lng = -180; lng <= 180; lng += resolution) {
      const ha = (lng - sunLng) * Math.PI / 180;
      const decRad = declination * Math.PI / 180;
      const latRad = Math.atan(-Math.cos(ha) / Math.tan(decRad));
      const lat = latRad * 180 / Math.PI;
      
      latLngs.push([lng, lat]);
  }
  
  const isNorthSummer = declination > 0;
  const wrapLat = isNorthSummer ? -90 : 90;
  
  const polygon = [...latLngs];
  polygon.push([180, wrapLat]);
  polygon.push([-180, wrapLat]);
  polygon.push(latLngs[0]);
  
  return {
      type: 'Feature',
      geometry: {
          type: 'Polygon',
          coordinates: [polygon]
      },
      properties: {}
  };
}

export function getTimezoneGridGeoJSON(): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = [];
  for (let lng = -180; lng <= 180; lng += 15) {
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[lng, -85], [lng, 85]] },
      properties: { offset: lng / 15 }
    });
  }
  return { type: 'FeatureCollection', features };
}
