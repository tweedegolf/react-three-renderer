import THREE from 'three';
import MultiMaterialDescriptorBase from './MultiMaterialDescriptorBase';

class MultiMaterialDescriptor extends MultiMaterialDescriptorBase {

  constructor(react3RendererInstance) {
    super(react3RendererInstance);
    // this.hasMaterials();
  }

  construct(props) {
    const materialsDescription = this.getMaterialDescription(props);

    if (props.hasOwnProperty('materials')) {
      materialsDescription.materials = props.materials;
    }
    // console.log('construct', materialsDescription);
    return new THREE.MultiMaterial(materialsDescription.materials);
  }
}

module.exports = MultiMaterialDescriptor;
