import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    readonly stringToParse: string;
    text: string;
    error: string;
    editorOptions = { theme: 'vs-dark', language: 'javascript' };
    code = '';
    worker: Worker;
    runBinding: any;
    files: CachedFile[];

    constructor(private filecache: FileCacheService, private cd: ChangeDetectorRef) {}

    ionViewDidEnter() {
        this.files = this.filecache.getAll();
    }

    ngOnInit() {
    }

}
