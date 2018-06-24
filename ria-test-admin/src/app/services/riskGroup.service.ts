import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { IRiskGroup } from '../models/riskgroup.model';

@Injectable()
export class RiskGroupService {

    constructor( private _apiService: ApiService) {}

    getAll(): Promise<IRiskGroup[]> { 
       return this._apiService.get('riskGroups');
    }
    
}
