import {FabricObjStoreState} from '@root-store/fabric-obj-store';
import {CoinStoreState} from '@root-store/coin-store';
import {SlideMenuStoreState} from '@root-store/slide-menu-store';

export interface State {
fabric_obj:FabricObjStoreState.State;
coin:CoinStoreState.State;
  slide_menu: SlideMenuStoreState.State;
}
