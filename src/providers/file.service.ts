import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import  * as FileSaver  from 'file-saver';
import { File } from '@ionic-native/file';
//var cordova

@Injectable()

export class FileService {

    constructor(public platform: Platform, public file: File) {

    }   

    public save(fileDestiny, fileName, fileMimeType, fileData) {
        let blob = new Blob([fileData], {type: fileMimeType});

        if (!this.platform.is('android')) {
            FileSaver.saveAs(blob, fileName); 
        } else {
            this.file.writeFile(fileDestiny, fileName, blob, true).then(()=> {
                alert("Fichier créé dans: " + fileDestiny);
            }).catch(()=>{
            alert("Erreur de création du fichier dans:" + fileDestiny);
        })
    }
}

    public getStorageDirectory():string {
        let src:string = "";

        if (this.platform.is('android')) {
        // src = cordova.file.externalDataDirectory;
        }   

        return src;          
    }
}