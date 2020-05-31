import {Injectable} from '@angular/core';
import {FabricObj} from '@models/vo/fabric-obj';
import {environment} from '../../../environments/environment';
import {BaseCrudService} from 'ngrx-entity-crud';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class FabricObjService extends BaseCrudService<FabricObj> {
	protected service = environment.webServiceUri + 'fabric-obj';

  constructor(http: HttpClient) {
    super(http);
    this.debugMode();
  }


}
