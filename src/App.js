import React, { createRef } from 'react';
import ReactMapboxGl, { Image, Source, Layer } from 'react-mapbox-gl';
import { GeolocateControl } from 'mapbox-gl';
import config from './config/config';

import './assets/tailwind.generated.css';
import './App.css';
import List from './components/List';

const Map = ReactMapboxGl({
  accessToken: config.mapbox_key,
  minZoom: 11,
  maxZoom: 17
});

const geojson = {
  type: 'geojson',
  data: 'https://nodes.fooapp.mx:6006/api/branches/geojson'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = { features: [], center: [-106.077197,28.6359829], zoom: [15] };
  }

  moveEnd = (map) => {
    const center = map.getCenter();
    this.setState([center.lng, center.lat]);
    const features = map.queryRenderedFeatures({ layers: ['restaurantes-icons'] });
    if (features.length !== this.state.features.length) {
      this.setState({ features });
    }
  }

  zoomEnd = (map) => {
    const zoom = map.getZoom();
    this.setState({ zoom: [zoom] });
  }

  flyTo = (center) => {
    this.setState({ center, zoom: [17] });
    this.mapRef.current.state.map.flyTo({ center, zoom: 17, essential: true });
  }

  styleLoad = (map) => {
    map.addControl(
      new GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      trackUserLocation: true
      })
    );
  }
  render() {
    const { features, center, zoom } = this.state;
    return (
      <div className="App flex flex-row overflow-y-hidden w-full">
        <div class="flex w-2/3 h-screen">
          <Map
            ref={this.mapRef}
            style="mapbox://styles/mapbox/dark-v9"
            containerStyle={{
              height: '100%',
              width: '100%'
            }}
            onStyleLoad={this.styleLoad}
            zoom={zoom}
            onDragEnd={this.moveEnd}
            center={center}
          >
            <Image id={'map-marker'} url='/marker.png' />
            <Source
              id={'restaurantes-source'} tileJsonSource={geojson} />
            <Layer
              id="restaurantes-icons"
              sourceId={'restaurantes-source'}
              type="symbol"
              layout={{ "icon-image": "map-marker", "icon-size": 0.14 }}>
            </Layer>
          </Map>
        </div>
        <div className="flex flex-col bg-dark-bg h-screen w-1/3 justify-center items-center overflow-y-hidden">
          <div className="flex text-2xl text-gray-100 font-bold py-5">
            Restaurantes
          </div>
          <List restaurantes={features} flyTo={this.flyTo}/>
        </div>
      </div>
    );
  }
}

export default App;
