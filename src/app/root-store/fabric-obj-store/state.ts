import {createCrudEntityAdapter, EntityCrudAdapter, EntityCrudState} from 'ngrx-entity-crud';
import {FabricObj} from '@models/vo/fabric-obj';

export const adapter: EntityCrudAdapter<FabricObj> = createCrudEntityAdapter<FabricObj>({
	selectId: model => FabricObj.selectId(model),
});

export interface State extends EntityCrudState<FabricObj> {
};

export const initialState: State = adapter.getInitialCrudState();
