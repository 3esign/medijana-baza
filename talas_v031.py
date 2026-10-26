# -*- coding: utf-8 -*-
import json, urllib.request, urllib.parse, time

OV="https://overpass-api.de/api/interpreter"

def ov(q):
    data=urllib.parse.urlencode({"data":q}).encode()
    for _ in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(OV,data=data,headers={"User-Agent":"medijana-baza/0.31"}),timeout=60)
            return json.load(r)
        except Exception as e:
            print("retry:",e); time.sleep(5)
    return None

bbox="(43.32,21.87,43.38,21.97)"

# 1) ulica Gornjomatejevacka - puna geometrija (way)
q1=f'[out:json][timeout:60];way["name"~"Gornjomatejev"|"Горњоматејев"]{bbox};out geom;'
# 2) zeleznicka pruga Niš-Zajecar + nadvožnjaci u Panteleju
q2=f'[out:json][timeout:60];(way["railway"="rail"]{bbox}["usage"="main"];);out geom tags;'
# 3) Somborski bulevar / kasarna okolina
q3=f'[out:json][timeout:60];(way["highway"]["name"~"Somborski"]{bbox};way["railway"]["name"~"Zajčar|Zajecar"]{bbox};);out geom tags;'

out={}
for key,q in [("ulica",q1),("pruga",q2),("somborski",q3)]:
    d=ov(q)
    out[key]=d
    print(key, len(d["elements"]) if d else "FAIL", time.strftime("%H:%M:%S"))

json.dump(out,open("overpass_v031_raw.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
