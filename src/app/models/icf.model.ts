import { Record } from "./record.model";

class NodeParent {
    constructor(
        public name: string,
    ) { }
}
export class IcfAssessment {
    constructor(
        public value: number,
        public code: string,
        public record: Record
    ) { }
}
export class IcfNode extends NodeParent {
    constructor(
        name: string,
        public ratable: boolean,
        public parent?: IcfNode,
        public nodes = new Array<IcfNode>()
    ) {
        super(name);
    }
    public compareName(assessment: IcfAssessment) {
        console.log(assessment.code.split(' ')[0], this.name.split(' ')[0], assessment.code.split(' ')[0] == this.name.split(' ')[0])
        return assessment.code.split(' ')[0] == this.name.split(' ')[0];
    }
}