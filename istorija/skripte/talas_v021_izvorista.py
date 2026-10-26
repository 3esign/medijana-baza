import rasterio, json, math
tiles = ["dem/Copernicus_DSM_COG_10_N43_00_E021_00_DEM.tif","dem/Copernicus_DSM_COG_10_N43_00_E022_00_DEM.tif"]
def sample(lon,lat):
    for t in tiles:
        with rasterio.open(t) as s:
            if s.bounds.left<=lon<=s.bounds.right and s.bounds.bottom<=lat<=s.bounds.top:
                v=list(s.sample([(lon,lat)]))[0][0]
                return None if v<-1000 else round(float(v),1)
    return None
# grid preko kontakt zone Suve Planine iznad Niske Banje
grid=[]
for lat in [43.28+0.01*i for i in range(11)]:
    row=[]
    for lon in [21.98+0.01*j for j in range(15)]:
        row.append(sample(lon,lat))
    grid.append(row)
# profil od kontakta (izvorisna zona) do vile: vila ~ (43.3197,21.9905) - koristi v0.20 vrednost
vila=(43.3197,21.9905)
prof=[]
for k in range(21):
    f=k/20
    lon=22.06+(vila[1]-22.06)*f; lat=43.30+(vila[0]-43.30)*f
    prof.append({"f":round(f,2),"lon":round(lon,5),"lat":round(lat,5),"m":sample(lon,lat)})
out={"grid_lat0":43.28,"dlat":0.01,"lon0":21.98,"dlon":0.01,"grid":grid,"profil_kontakt_vila":prof}
json.dump(out,open("dem_izvorista_v021.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
print("grid min/max:",min(v for r in grid for v in r if v),max(v for r in grid for v in r if v))
print("profil:",[p["m"] for p in prof])
