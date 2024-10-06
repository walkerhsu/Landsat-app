import { FillLayerSpecification } from 'mapbox-gl';
import type { FillLayer } from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer: FillLayerSpecification = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': ['get', 'color', ['get', 'SR_data']],
    'fill-opacity': 1
  },
  source: ''
};