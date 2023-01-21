import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IcfNode, IcfAssessment } from '../models/icf.model';
import { Record } from '../models/record.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IcfService {
    private fileLines?: Array<string>;
    public table?: IcfNode;

    constructor(private http: HttpClient) { }


    private async getLines() {
        let data = await lastValueFrom(this.http.get('assets/icf-ukr.txt', { responseType: 'text' }));

        let lines = data!.split('\n');
        lines.forEach(element => {
            element = element.replace('\r', '');
        });

        return lines;
    }

    private initNode(line: number, parent: IcfNode): [Array<IcfNode>, number] {
        let arr = new Array<IcfNode>();
        let curLine = this.fileLines![line].replace('\r', '');

        while (curLine != '}' && line < this.fileLines!.length - 1) {
            let name = curLine;
            let ratable = true;
            let childs = new Array<IcfNode>();

            if (this.fileLines![line + 1].replace('\r', '') == '{') {
                ratable = false;
                if (curLine[0] == '1' || curLine[0] == '2' || curLine[0] == '3')
                    name = name.substring(1);
            }

            let n = new IcfNode(name, ratable, parent);

            if (this.fileLines![line + 1].replace('\r', '') == '{') {
                let result = this.initNode(line + 2, n);
                childs = result[0];
                line = result[1];
            }
            n.nodes = childs;
            arr.push(n);
            if (line < this.fileLines!.length - 1)
                curLine = this.fileLines![++line].replace('\r', '');
        }

        return [arr, line];
    }

    public async initTable() {
        this.fileLines = await this.getLines();

        this.table = new IcfNode('main', false, undefined);

        this.table.nodes = this.initNode(0, this.table)[0];
    }

    public toIcfString(rating: Array<IcfAssessment>) {
        let string = '';
        rating.forEach(element => {
            //select code(first word)
            let code = element.code.split(' ')[0];

            string += code + '=' + element.value + ';';
        });
        return string;
    }

    public async initFromRecord(record: Record) {
        let ratings = new Array<IcfAssessment>();
        let lines = await this.getLines();
        let str = record.icfString!;
        let parts = str.split(';');
        parts.pop();

        parts.forEach(rating => {
            let code = rating.slice(0, str.indexOf('='))
            let value = Number.parseInt(rating.slice(str.indexOf('=') + 1));

            lines.forEach(line => {
                if (line.split(' ')[0] == code) {
                    ratings.push(new IcfAssessment(value, line.replace("\r", ""), record));
                    return;
                }
            });
        });

        return ratings;
    }
}

