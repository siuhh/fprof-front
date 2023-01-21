import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IcfNode } from 'src/app/models/icf.model';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
    @Input()
    public exclude: Array<IcfNode> = new Array<IcfNode>;

    @Input()
    public node!: IcfNode;

    @Output()
    public nodeSelected: EventEmitter<IcfNode> = new EventEmitter();

    public childHovered: boolean = false;
    public expanded: boolean = false;

    ngOnInit(): void {
        if (this.node.parent == undefined) {
            this.expanded = true;
        }
    }

    public select() {
        if (this.node.ratable) {
            this.nodeSelected.emit(this.node);
        }
        else {
            this.expanded = !this.expanded;
        }
    }

    public childSelected(n: IcfNode) {
        this.nodeSelected.emit(n);
    }

    public isExcluded() {
        let excluded = false;
        this.exclude.forEach(element => {
            if (element.name == this.node.name) {
                excluded = true;
            }
        });
        return excluded;
    }
}
