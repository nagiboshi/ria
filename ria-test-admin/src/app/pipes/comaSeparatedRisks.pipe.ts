import { Pipe, PipeTransform } from '@angular/core';
import { IRiskGroup } from '../models/riskgroup.model';

@Pipe({name: 'comaSeparatedRisks'})
export class ComaSeparatedRisks implements PipeTransform {
    transform(risks: IRiskGroup[]) {
        return risks.map((risk) => risk.name).join(', ');
    }
}
