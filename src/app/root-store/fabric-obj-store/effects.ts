import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import * as actions from './actions';
import {FabricObj} from '@models/vo/fabric-obj';
import {FabricObjService} from '@services/fabric-obj.service';
import {createRequestEffect, deleteRequestEffect, editRequestEffect, searchRequestEffect} from 'ngrx-entity-crud';
import {Socket} from 'ngx-socket-io';
import {filter, map, tap} from 'rxjs/operators';


@Injectable()
export class FabricObjStoreEffects {
  constructor(
    private readonly actions$: Actions,
    private socket: Socket,
    private readonly service: FabricObjService) {
  }

  @Effect()
  searchRequestEffect$: Observable<Action> = searchRequestEffect<FabricObj>(this.actions$, actions, this.service);

  @Effect()
  deleteRequestEffect$: Observable<Action> = deleteRequestEffect<FabricObj>(this.actions$, actions, this.service, FabricObj);

  @Effect()
  createRequestEffect$: Observable<Action> = createRequestEffect<FabricObj>(this.actions$, actions, this.service);

  @Effect()
  editRequestEffect$: Observable<Action> = editRequestEffect<FabricObj>(this.actions$, actions, this.service);

  @Effect()
  selectRequestEffect$: Observable<Action> = editRequestEffect<FabricObj>(this.actions$, actions, this.service);

  @Effect({dispatch: false})
  broadcastSenderEffect$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.CreateSuccess, actions.DeleteSuccess, actions.EditSuccess),
      filter((value) => !(value as any).user),
      tap(value => console.log('Action Sender', value)),
      tap(action => {
        console.log('FabricObjStoreEffects.tap()');
        const broadcastAction: BroadcastAction = {
          action,
          user: localUser
        };
        this.socket.emit('action', broadcastAction);
      }),
      filter(value1 => false),
    )
  );

  @Effect({dispatch: true})
  broadcastReciverEffect$: Observable<Action> = this.socket.fromEvent('action').pipe(
    tap(value => console.log('Action recived', value)),
    filter((value: BroadcastAction) => value.user !== localUser),
    tap(value => console.log('Action filter passed', value)),
    map((value: BroadcastAction, i) => {
      console.log('value', value);
      const {action, user} = value;
      return {...action, user};
    }),
  );

}

export class BroadcastAction {
  user: string;
  action: Action;
}

export const localUser = new Date().getTime() + '';
