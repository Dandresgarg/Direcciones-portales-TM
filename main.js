window.onload= init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([-74.1217, 4.6999]), // Coordenadas de Bogotá
            zoom: 11.5,
            rotation: Math.PI/2
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'
    })
//Mapas base
    const openStreetMapStandard= new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMStandard'
    })

    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        title:'OSMHumanitarian'
    })

//Agrupar los layers

const baseLayerGroup = new ol.layer.Group({
    layers:[
        openStreetMapStandard, openStreetMapHumanitarian
    ]
})
    //map.addLayer(openStreetMapHumanitarian);
    map.addLayer(baseLayerGroup);

//Controlador Layers

const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');

for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change',function(){
        let baseLayerElementValue=this.value;
        baseLayerGroup.getLayers().forEach(function(element, index, array){
            let baseLayerTitle=(element.get('title'));
            element.setVisible(baseLayerTitle===baseLayerElementValue);
            //console.log('baseLayerTitle'+baseLayerTitle,'baseLayerElementValue: '+baseLayerElementValue)

        });

    });
}
//Vector Layers
const fillStyle = new ol.style.Fill({
    color: [255, 255, 255, 1]
})

const strokeStyle = new ol.style.Stroke({
    color: [0, 0, 0, 1],
})

const circleStyle = new ol.style.Circle({
    fill: new ol.style.Fill({
        color: [255, 0, 0, 0.7]
    }),
    radius: 7,
    stroke: strokeStyle
    
})

const TmGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
        url: './libs/datos/datos-vectoriales/tm.geojson',
        format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'PortalesTm',
    style: new ol.style.Style({
        fill: fillStyle, 
        stroke: strokeStyle,
        image: circleStyle
    })
})
map.addLayer(TmGeoJSON);

//Interacción con la capa vectorial
const overlayContainerElement = document.querySelector('.overlay-container');
const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
})
map.addOverlay(overlayLayer)
const overlayFeatureName = document.getElementById('feature-name');
const overlayFeatureDireccion = document.getElementById('feature-direccion');

map.on('click',function(e){
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
        let clickedCoordinate = e.coordinate;
        let clickedFeatureName = feature.get('Nombre');
        let clickedFeatureDireccion = feature.get('Dirección');
        overlayLayer.setPosition(clickedCoordinate);
        overlayFeatureName.innerHTML = clickedFeatureName;
        overlayFeatureDireccion.innerHTML = clickedFeatureDireccion;
    },
    {
        layerFilter: function(layerCandidate){
            return layerCandidate.get('title')==='PortalesTm'
        }
    })
})

}

