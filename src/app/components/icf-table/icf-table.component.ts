import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IcfNode } from 'src/app/models/icf.model';
import { IcfService } from 'src/app/services/icf.service';

@Component({
    selector: 'app-icf-table',
    templateUrl: './icf-table.component.html',
    styleUrls: ['./icf-table.component.scss']
})
export class IcfTableComponent implements OnInit {
    @Output()
    public nodeSelected: EventEmitter<IcfNode> = new EventEmitter();

    public table: IcfNode = new IcfNode('Завантаження...', false);
    public selectedNodes: Array<IcfNode> = new Array<IcfNode>();

    constructor(private icf: IcfService) { }

    ngOnInit(): void {
        this.icf.initTable().then(
            () => {
                this.table = <IcfNode>this.icf.table!;
            },
            () => {
                console.error('error loading icf table');
            }
        );
    }

    public select(node: IcfNode) {
        let nodeIndex = this.selectedNodes.indexOf(node);

        if (nodeIndex == -1)
            this.selectedNodes.push(node);
        else
            this.selectedNodes.splice(nodeIndex, 1);

        this.nodeSelected.emit(node);
    }
}