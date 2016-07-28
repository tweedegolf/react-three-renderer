import THREE from 'three';
import THREEElementDescriptor from '../THREEElementDescriptor';
import invariant from 'fbjs/lib/invariant';

import resource from '../decorators/resource';

import ResourceReference from '../../Resources/ResourceReference';

import PropTypes from 'react/lib/ReactPropTypes';
import propTypeInstanceOf from '../../utils/propTypeInstanceOf';

@resource
class MultiMaterialDescriptorBase extends THREEElementDescriptor {
  constructor(react3Instance) {
    super(react3Instance);

    this.hasProp('slot', {
      type: PropTypes.string,
      updateInitial: true,
      update: (threeObject, slot, hasProperty) => {
        if (hasProperty) {
          threeObject.userData._materialSlot = slot;
        } else {
          threeObject.userData._materialSlot = 'material';
        }
      },
      default: 'material',
    });

    this.hasProp('materials', {
      type: PropTypes.array,
      updateInitial: true,
      update: (threeObject, materials) => {
        // console.log('update', materials);
        this._materials = [...materials]
        threeObject.materials = materials;
        threeObject.needsUpdate = true;
      },
      default: [],
    });

    this._materials = [];
  }

  getMaterialDescription(props) {
    const materialDescription = {};

    if (props.hasOwnProperty('materials')) {
      materialDescription.materials = props.materials;
    }

    return materialDescription;
  }


  hasMaterials() {
    this.hasProp('materials', {
      type: PropTypes.array,
      updateInitial: true,
      update: (threeObject, materials) => {
        threeObject.materials = materials;
      },
      default: [],
    });
  }

  construct() {
    return new THREE.Material({});
  }

  applyInitialProps(threeObject, props) {
    threeObject.userData = {
      ...threeObject.userData,
    };

    // console.log(threeObject.userData)

    super.applyInitialProps(threeObject, props);
  }

  setParent(material, parentObject3D) {
    // console.log('parentObject3D', parentObject3D)
    invariant(parentObject3D instanceof THREE.Mesh
      || parentObject3D instanceof THREE.Points
      || parentObject3D instanceof THREE.Sprite
      || parentObject3D instanceof THREE.Line, 'Parent is not a mesh');

    invariant(parentObject3D[material.userData._materialSlot] === undefined
      || parentObject3D[material.userData._materialSlot] === null,
      `Parent already has a ${material.userData._materialSlot} defined`);

    super.setParent(material, parentObject3D);

    // console.log(parentObject3D, material.userData._materialSlot, material)
    parentObject3D[material.userData._materialSlot] = material;
  }

  unmount(multimaterial) {
    const parent = multimaterial.userData.markup.parentMarkup.threeObject;

    // could either be a resource description or an actual material
    if (parent instanceof THREE.Mesh ||
      parent instanceof THREE.Sprite ||
      parent instanceof THREE.Line ||
      parent instanceof THREE.Points) {
      const slot = multimaterial.userData._materialSlot;

      if (parent[slot] === multimaterial) {
        // TODO: set material slot to null rather than undefined

        parent[slot] = undefined;
      }
    }
    multimaterial.materials.forEach(material => {
      // console.log(material);
      material.dispose();
    });
    super.unmount(multimaterial);
  }

  highlight(threeObject) {
    const ownerMesh = threeObject.userData.markup.parentMarkup.threeObject;

    threeObject.userData.events.emit('highlight', {
      uuid: threeObject.uuid,
      boundingBoxFunc: () => {
        const boundingBox = new THREE.Box3();

        if (ownerMesh && ownerMesh.geometry && ownerMesh.geometry.computeBoundingBox) {
          ownerMesh.geometry.computeBoundingBox();
        }

        boundingBox.setFromObject(ownerMesh);

        return [boundingBox];
      },
    });
  }

  getBoundingBoxes(threeObject) {
    const boundingBox = new THREE.Box3();

    const ownerMesh = threeObject.userData.markup.parentMarkup.threeObject;

    if (ownerMesh && ownerMesh.geometry && ownerMesh.geometry.computeBoundingBox) {
      ownerMesh.geometry.computeBoundingBox();
    }

    boundingBox.setFromObject(ownerMesh);

    return [boundingBox];
  }

  hideHighlight(threeObject) {
    threeObject.userData.events.emit('hideHighlight');
  }

  addChildren(threeObject, children) {
    invariant(children.filter(this._invalidChild).length === 0,
      'Material children can only be textures or texture resource references!');
  }

  addChild(threeObject, child) {
    this.addChildren(threeObject, [child]);
  }

  moveChild() {
    // doesn't matter
  }

  removeChild() {
    // doesn't matter since the texture will take care of things on unmount
  }

  invalidChildInternal(child) {
    const invalid = !(child instanceof THREE.Texture
    || child instanceof ResourceReference);

    return invalid;
  }

  _invalidChild = child => this.invalidChildInternal(child);
}

module.exports = MultiMaterialDescriptorBase;
