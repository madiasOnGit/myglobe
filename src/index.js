import Globe from 'globe.gl';



let inputShowCablesLabel = document.createElement('label');
inputShowCablesLabel.innerHTML = "  Submarine Cables";
let inputShowCables = document.createElement('input');
inputShowCables.type = "checkbox";
inputShowCables.checked = true;
inputShowCables.addEventListener("click", e => {
    if(e.currentTarget.checked){
        globe.pathsData().forEach((a)=>{
          a.__threeObj.visible = true;
        });
      }else{
        globe.pathsData().forEach((a)=>{
          a.__threeObj.visible = false;
        });
      }
}, false);
document.body.appendChild(inputShowCablesLabel);
document.body.appendChild(inputShowCables);


let inputShowRegionsLabel = document.createElement('label');
inputShowRegionsLabel.innerHTML = "  AWS Regions";
let inputShowRegions = document.createElement('input');
inputShowRegions.type = "checkbox";
inputShowRegions.checked = true;
inputShowRegions.addEventListener("click", e => {
    if(e.currentTarget.checked){
        globe.ringsData().forEach((a)=>{
          a.__threeObj.visible = true;
        });
        globe.labelsData().forEach((a)=>{
            a.__threeObj.visible = true;
        });
      }else{
        globe.ringsData().forEach((a)=>{
          a.__threeObj.visible = false;
        });
        globe.labelsData().forEach((a)=>{
            a.__threeObj.visible = false;
          });
      }

}, false);
document.body.appendChild(inputShowRegionsLabel);
document.body.appendChild(inputShowRegions);

let inputShowRegionConnectionsLabel = document.createElement('label');
inputShowRegionConnectionsLabel.innerHTML = "  AWS Region Connections";
let inputShowRegionConnections = document.createElement('input');
inputShowRegionConnections.type = "checkbox";
inputShowRegionConnections.checked = true;
inputShowRegionConnections.addEventListener("click", e => {
    if(e.currentTarget.checked){
        globe.arcsData().forEach((a)=>{
          a.__threeObj.visible = true;
        });
      }else{
        globe.arcsData().forEach((a)=>{
          a.__threeObj.visible = false;
        });
      }

}, false);
document.body.appendChild(inputShowRegionConnectionsLabel);
document.body.appendChild(inputShowRegionConnections);




let globeViz = document.createElement('div');
document.body.appendChild(globeViz);
const globe = Globe()
.globeImageUrl('img/earth-dark.jpg')
.globeImageUrl('img/earth-night.jpg')
.bumpImageUrl('img/earth-topology.png')
(globeViz);

//submarinecables
fetch('https://raw.githubusercontent.com/telegeography/www.submarinecablemap.com/master/web/public/api/v3/cable/cable-geo.json')
.then(r =>r.json())
.then(cablesGeo => {
let cablePaths = [];
let cables = ["2Africa", "MAREA", "Apple", "Mango"];
cablesGeo.features.forEach(({ geometry, properties }) => {
    if(cables.includes(properties.name)){
    geometry.coordinates.forEach(coords => cablePaths.push({ coords, properties }));
    }
    });

globe
    .pathsData(cablePaths)
    .pathPoints('coords')
    .pathPointLat(p => p[1])
    .pathPointLng(p => p[0])
    .pathColor(path => path.properties.color)
    .pathLabel(path => path.properties.name)
    .pathDashLength(0.1)
    .pathDashGap(0.008)
    .pathDashAnimateTime(12000)
    .pathStroke(1);
});



//AWS Regions
//fetch('https://raw.githubusercontent.com/pedroduartecosta/aws-globe/main/src/files/regions-data.json')
fetch('data/regions-data.json')
  .then(r =>r.json())
  .then(regionsData => {
    let activeRegions = [];
    let regionConnections = [];
    let regions = [];
    regionsData.regions.forEach((region) => {
      if (region.ga){
        activeRegions.push(region);
      }
      regions.push(region)
    });
    activeRegions.forEach((region) => {
      region.connections.forEach((conn) =>{
        let i = activeRegions.findIndex(x => x.code === conn)
        if(i>=0){
          let color = [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
          regionConnections.push({'conn':region.code + '->' + activeRegions[i].code, 'startLat':region.lat,'startLng':region.lng,'endLat':activeRegions[i].lat,'endLng': activeRegions[i].lng, 'color':color})
        }
      });
    });

    if(regions){
      globe
      //.ringsData(activeRegions)
      //.ringAltitude(0)
      //.ringMaxRadius(2)
      //.ringColor((e) => {if (e.public){return "#2db83d";} else{return "#c871d2";}})
      //.ringRepeatPeriod(1000)
      .labelsData(regions)
      .labelColor((e) => {if (!e.ga){return "#ff6633";}else if(e.public){return "#2db83d";}else{return "#c871d2";};})
      .labelDotRadius(1)
      .labelSize(1.2)
      .labelText('name')
      .labelLabel(d => `
      <div style="padding:5px;background-color: rgba(0, 0, 0, 0.7)">
            <b>${d.full_name}</b> <br>
            Code:${d.code}<br>
            Availability Zones: ${d.zones}<br>
            Connections:${d.connections}<br>
            Public Region:${d.public}<br>
            GA:${d.ga}
      </div>
          `)
      .labelResolution(6)
      .labelAltitude(0.02)
      .labelDotOrientation(() => 'right')
      .onLabelClick((e)=>{globe.pointOfView({ lat: e.lat, lng: e.lng, altitude: 0.9 }, 4000);})
      .arcsData(regionConnections)
      .arcLabel('conn')
      //.arcColor('color')
      .arcDashLength(1)
      .arcDashInitialGap(0.02)
      .arcDashGap(0.05)
      .arcDashAnimateTime(100)
      .arcAltitude(0.4)
      .arcStroke(0.1)
    }
});

