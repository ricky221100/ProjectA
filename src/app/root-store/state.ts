import {FabricObjStoreState} from '@root-store/fabric-obj-store';
import {SlideMenuStoreState} from '@root-store/slide-menu-store';

export interface State {
  fabric_obj: FabricObjStoreState.State;
  slide_menu: SlideMenuStoreState.State;
}
