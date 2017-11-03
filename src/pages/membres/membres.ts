import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, MenuController, ToastController, ModalController, Events, IonicPage } from 'ionic-angular';
import { PouchdbProvider } from '../../providers/pouchdb-provider';
//import { AjouterMembrePage } from './ajouter-membre/ajouter-membre';
//import { DetailMembrePage } from './detail-membre/detail-membre';
import { Storage } from '@ionic/storage';
//import { ConfLocaliteEnquetePage } from '../configuration/conf-localite-enquete/conf-localite-enquete';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { global } from '../../global-variables/variable';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import JsBarcode from 'jsbarcode';
import * as FileSaver from 'file-saver';
import { Printer, PrintOptions } from '@ionic-native/printer';
declare var cordova: any;

/* 
  Generated class for the Membres page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/ 
@IonicPage()
@Component({
  selector: 'page-membres',
  templateUrl: 'membres.html'
})
export class MembresPage {

  selectedSource: any = 'application';
  membres: any = [];
  membresApplication: any = [];
  membresKobo: any = [];
  allMembres: any = [];
  allMembres1: any = [];
  confLocaliteEnquete: any;
  num_aggrement_op: any;
  selectedStyle: any = 'liste';
  nom_op: any;
  code_op: any;
  aProfile: boolean = true;
  typeRecherche: any = 'matricule';
  selectedLimit: any = 10;
  limits: any = [10, 25, 50, 100, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 'Tous'];
  recherche: any = 'FM-';

  membreForm: any;
  villages: any = [];
  ops: any = [];
  classes: any = [];
  selectedVillage: any;
  selectedOP: any;
  selectedClasse: any;
  membreApplication: any = [];
  membreKobo: any = [];
  allUnion: any = [] ;
  imei: any = '';
  phonenumber: any = '';
  autreVillage: any = {'id':'AUTRE', 'nom':'Autre'};
  autreOP: any = {"data": {'num_aggrement':'AUTRE', 'nom_OP':'Autre', 'code_OP':'AUTRE'}};
  autreClasse: any = {"data": {'id':'AUTRE', 'nom':'Autre'}};
  nom_autre_village: any = '';
  nom_autre_op: any = '';
  nom_autre_classe: any = '';
  matricule: any = '';
  nom:any = '';
  public base64Image: string;
  public showCamera = true;
  estInitierMemebre: boolean = false;
  //instanceID: string;
  imageData: any = '';
  attachments:any;
  photo: any;
  fileName: any;
  imageBlob:any;
  ajoutForm: boolean = false;
  estInitForm: boolean = false;
  today: any;
  rechercher: any = false;

  nom_Membre: string = '';
  surnom_Membre: string = '';
  genre: any;
  modifierForm: boolean = false;
  detailMembre: boolean = false;
  membre: any = {} ;


  pays: any;
  pays_nom: any;
  pays_autre: any;
  region: any;
  region_nom: any;
  region_autre: any;
  departement: any;
  departement_nom: any;
  departement_autre: any;
  commune: any;
  commune_nom: any;
  commune_autre: any;
  village: any;
  village_nom: any;
  village_autre: any;

  membreID: any;
  // profile: any;
  public picture; 
  membreData: any=[];

  grandMembre: any;
  membre1: any;
  selectedVillageID: any;
  selectedOPID: any;
  ancienSelectedOPID: any;
  selectedClasseID: any;
  ancien_matricule: any = '';
  ancien_nom:any = '';
  ancien_surnom:any = '';

  ancien_OP: any;
  ancien_nom_op: any;
  ancien_code_op: any;
  generate: boolean = false;
  photoID: any;
  photoRev: any;

  mes_champs: any = [];
  mes_essais: any = [];

  @ViewChild('barcode') barcode: ElementRef;



  constructor(public navCtrl: NavController,  public viewCtl: ViewController, public platform: Platform, public printer: Printer, public file: File, public imagePicker: ImagePicker, private camera: Camera, public sim: Sim, public device: Device, public toastCtl: ToastController, public formBuilder: FormBuilder, public modelCtl: ModalController, public zone: NgZone, public menuCtl: MenuController, public events: Events, public navParams: NavParams, public storage: Storage, public alertCtl: AlertController, public servicePouchdb: PouchdbProvider, private sanitizer: DomSanitizer) {
    
    this.menuCtl.enable(false, 'options');
    this.menuCtl.enable(false, 'connexion');
    this.menuCtl.enable(false, 'profile');

    events.subscribe('user:login', () => {
      this.servicePouchdb.remoteSaved.getSession((err, response) => {
        if (response.userCtx.name) {
          this.aProfile = true;
        }else{
          this.aProfile = false;
        }
      }, err => console.log(err));
    });
    
    if(this.navParams.data.num_aggrement_op){
      this.num_aggrement_op = this.navParams.data.num_aggrement_op;
      this.nom_op = this.navParams.data.nom_op;
      this.code_op = this.navParams.data.code_op;
      this.nom_autre_op= 'NA';

       this.selectedLimit = 'Tous';
      
      //this.matricule = this.generateId(this.code_op);
      //this.viewCtl.showBackButton(false)
    }

    //this.initForm();
  } 


    onPrint(){
    let options: PrintOptions = {
        //name: 'Rapport',
        //printerId: 'printer007',
        duplex: true,
        landscape: true,
        grayscale: true
    };
    let content = document.getElementById('tableau').innerHTML;
    this.printer.print(content, options);
  }


  exportExcel(){

    let date = new Date();
    //let dateHeure = date.toLocaleDateString()+ date.toLocaleTimeString();// + date.getTime().toLocaleString();
    let nom = date.getDate().toString() +'_'+ (date.getMonth() + 1).toString() +'_'+ date.getFullYear().toString() +'_'+ date.getHours().toString() +'_'+ date.getMinutes().toString() +'_'+ date.getSeconds().toString();

    let blob = new Blob([document.getElementById('tableau').innerHTML], {
      //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      type: "text/plain;charset=utf-8"
      //type: 'application/vnd.ms-excel;charset=utf-8'
      //type: "application/vnd.ms-excel;charset=utf-8"
    });

    if(!this.platform.is('android')){
      FileSaver.saveAs(blob, 'Membres_'+nom+'.xls');
    }else{

      let fileDestiny: string = cordova.file.externalRootDirectory;
      this.file.writeFile(fileDestiny, 'Membres_'+nom+'.xls', blob).then(()=> {
          alert("Fichier créé dans: " + fileDestiny);
      }).catch(()=>{
          alert("Erreur de création du fichier dans: " + fileDestiny);
      })
    }
  }



  chargerConfLocaliter(loc){
    this.pays = loc.pays.id;
    this.pays_nom = loc.pays.nom;
    //this.pays_autre = loc.pays_autre;
    this.region = loc.region.id;
    this.region_nom = loc.region.nom;
    //this.region_autre = loc.region_autre;
    this.departement = loc.departement.id;
    this.departement_nom = loc.departement.nom;
    //this.departement_autre = loc.departement_autre;
    this.commune = loc.commune.id, Validators.required;
    this.commune_nom = loc.commune.nom;
    //this.commune_autre = loc.commune_autre;

    this.chargerVillages(loc.commune.id);
  }

  initForm(){
    //this.confLocaliteEnquete = this.navParams.data.confLocaliteEnquete;
    let maDate = new Date();
    let today = this.createDate(maDate.getDate(), maDate.getMonth(), maDate.getFullYear());

    this.membreForm = this.formBuilder.group({
      //_id:[''],
      type:['membre_op'],
      nom_Membre: ['', Validators.required],
      surnom_Membre: [''],
      matricule_Membre: ['', Validators.required],
      genre: ['', Validators.required],
      //classe: [''],
      //classe_nom: [''],
      //classe_autre: [''],
      pays: [, Validators.required],
      pays_nom: [],
      //pays_autre: [this.confLocaliteEnquete.pays_autre],
      region: [, Validators.required],
      region_nom: [],
      //region_autre: [this.confLocaliteEnquete.region_autre],
      departement: [, Validators.required],
      departement_nom: [],
      //departement_autre: [this.confLocaliteEnquete.departement_autre],
      commune: [, Validators.required],
      commune_nom: [],
      //commune_autre: [this.confLocaliteEnquete.commune_autre],
      village: ['', Validators.required],
      village_nom: [''],
      //village_autre: ['', Validators.required],
      op: ['', Validators.required],
      op_nom: [''],
      //op_autre: ['NA', Validators.required],
      today: [today, Validators.required],
      deviceid: [''],
      imei: [''],
      phonenumber: [''],
      start: [maDate.toJSON()],
      end: ['']
    });
    
    //this.chargerVillages(this.confLocaliteEnquete.commune.id);
  }

  pourCreerForm(){
     
    if(this.navParams.data.num_aggrement_op){
      //this.num_aggrement_op = this.navParams.data.num_aggrement_op;
      //this.nom_op = this.navParams.data.nom_op;
      //this.code_op  = this.navParams.data.code_op;
      this.nom_autre_op= 'NA';
      
      this.matricule = this.generateId(this.code_op);
    }
    
    //this.chargerVillages(this.confLocaliteEnquete.commune.id);
    
   // this.chargerOp();
    
    
  }

  takePhoto() {
    
    let option = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      //destinationType: this.camera.DestinationType.NATIVE_URI,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(option).then((imageData) => {
      // imageData is a base64 encoded string
      //this.photo = this.sanitizer.bypassSecurityTrustUrl(imageData);
      this.imageData = imageData;
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photo = this.base64Image ;
    }, (err) => {
      console.log(err);
    });
  }

 getInfoSimEmei(){
    this.sim.getSimInfo().then(
      (info) => {
        if(info.cards.length > 0){
          info.cards.forEach((infoCard) => {
            if(infoCard.phoneNumber){
              this.phonenumber = infoCard.phoneNumber;
            }
            if(infoCard.deviceId){
              this.imei = infoCard.deviceId;
            }
          })
        }else{
          this.phonenumber = info.phoneNumber;
          this.imei = info.deviceId;
        }

      },
      (err) => console.log('Unable to get sim info: ', err)
    );

    
     /* this.servicePouchdb.getPlageDocs('fuma:union','fuma:union:\uffff').then((uA) => {
         this.servicePouchdb.getPlageDocs('koboSubmission_fuma-union','koboSubmission_fuma-union\uffff').then((uK) => {
          this.allUnion = uA.concat(uK);
      }, err => console.log(err));

      }, err => console.log(err)); */
 }

  chargerVillages(c){
    this.villages = [];
    if(c !== 'AUTRE')
      {this.servicePouchdb.getDocById('village').then((villages) => {
        if(villages){
           villages.data.map((row) => {
          
              if(row.id_commune === c){
              this.villages.push(row);
              
            }
            });
        }
      this.villages.push(this.autreVillage);
      //this.nom_autre_departement = 'NA';
    }, err => console.log(err));
      
    }else{
      this.villages.push(this.autreVillage);
      //this.nom_autre_departement = '';
    }

    //this.selectedVillage = '';
  } 

  chargerAutreNomVillageID(v){
    if(v !== 'AUTRE'){
      this.nom_autre_village = 'NA';
    }else{
      let model = this.modelCtl.create('AjouterVillagePage', {'id_commune':this.membre1.commune, 'nom_commune': this.membre1.commune_nom});
      model.present();
      model.onDidDismiss(() => {
        this.chargerVillages(this.membre1.commune);
        this.selectedVillageID = '';
      })
      this.nom_autre_village = '';
    }
  }


  chargerAutreNomVillage(v){
    if(v !== 'AUTRE'){
      this.nom_autre_village = 'NA';
    }else{
       let model = this.modelCtl.create('AjouterVillagePage', {'id_commune':this.confLocaliteEnquete.commune.id, 'nom_commune': this.confLocaliteEnquete.commune.nom});
        model.present();
        model.onDidDismiss(() => {
          this.chargerVillages(this.confLocaliteEnquete.commune.id);
          this.selectedVillage = '';
      })
      this.nom_autre_village = '';
    }
  }

  chargerAutreNomOPID(op){
    if(op !== this.ancien_OP){
      this.ops.forEach((o, i) => {
        o = o.doc;
        if(o.data.num_aggrement === op){
          this.membre1.op = o.data.num_aggrement;
          this.membre1.op_nom = o.data.nom_OP;
          this.membre1.op_code = o.data.code_OP;
          this.matricule = this.generateMatriculeNouveau(o.data.code_OP);
        }
      });
    }else{
      this.membre1.op = this.ancien_OP;
      this.membre1.op_nom = this.ancien_nom_op;
      this.membre1.op_code = this.ancien_code_op;
      this.matricule = this.ancien_matricule;
    }
    if(op !== 'AUTRE'){
      this.nom_autre_op = 'NA';
    }else{
      let model = this.modelCtl.create('AjouterOpPage', {'confLocaliteEnquete': this.confLocaliteEnquete});
        model.present();
        model.onDidDismiss(() => {
          this.chargerOp();
          this.selectedOPID = '';
      })
      this.nom_autre_op = '';
    }
  }

  generateMatriculeNouveau(code_op/*operation, /*pays, region, departement, commune, village*/){

    var chars='ABCDEFGHIJKLMNPQRSTUVWYZ'
    var numbers='0123456789'
    var randomArray=[]
    for(let i=0;i<3;i++){
      var rand = Math.floor(Math.random()*10)
      randomArray.push(numbers[rand])
    }
    randomArray.push('-')
    var rand = Math.floor(Math.random()*24)
    randomArray.push(chars[rand])
    var randomString=randomArray.join("");
    //var Id= 'FM-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    
    var Id= 'FM-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    //var Id= 'MR-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    
    return Id
  }



  chargerAutreNomOP(op, code_op){
    this.matricule = this.generateId(code_op);
    /*if(op !== 'AUTRE'){
      this.nom_autre_op = 'NA';
      this.matricule = this.generateId(code_op);
    }else{
      let model = this.modelCtl.create('AjouterOpPage', {'confLocaliteEnquete': this.confLocaliteEnquete});
        model.present();
        model.onDidDismiss(() => {
          this.chargerOp();
          this.selectedOP = '';
      })
      this.nom_autre_op = '';
      this.matricule = this.generateId(code_op);
    }*/
  }

   chargerAutreNomClasse(c){
    if(c !== 'AUTRE'){
      this.nom_autre_classe = 'NA';
    }else{
      this.nom_autre_classe = '';
    }
  }


  verifierUniqueMatricule(membre){
    let res = 1;
    this.allMembres1.forEach((mm, index) => {
      if(membre.matricule_Membre === mm.doc.data.matricule_Membre){
        res = 0;
      }
    });
    return res;
  }

   actionForm(){
     if(this.ajoutForm){
       let date = new Date();
        let membre = this.membreForm.value;

        if(this.verifierUniqueMatricule(membre) === 0){
          alert('Le matricule du membre doit être unique!');
        }else{
          membre.village = this.selectedVillage.id;
          membre.village_nom = this.selectedVillage.nom;
          if(!this.num_aggrement_op){
            membre.op = this.selectedOP.data.num_aggrement;
            membre.op_nom = this.selectedOP.data.nom_OP;
            membre.op_code = this.selectedOP.data.code_OP;
          }else{
            membre.op_code = this.code_op;
          }

          if(this.selectedClasse){
            membre.classe = this.selectedClasse.data.id;
            membre.classe_nom = this.selectedClasse.data.nom;
          }
          membre.deviceid = this.device.uuid;
          membre.phonenumber = this.phonenumber;
          membre.imei = this.imei;
          membre.file_name = this.fileName;
          
          let id = 'fuma:op:membre:' +membre.op_code + ':' + this.matricule;//  this.servicePouchdb.generateId('op:membre', membre.pays, membre.region, membre.departement,membre.commune, membre.village);
          //union._id = 'fuma'+ id;
          membre.end = date.toJSON();
    
          let membreFinal: any = {};
          membreFinal._id = id;
        
          let ida = 'fuma:photo:membre:'+ this.matricule;
          if(this.photo){
            membre.photoID = ida; 
          }
          
          //membre.blob = this.imageBlob;
          membreFinal.data = membre;
          this.servicePouchdb.createDocReturn(membreFinal).then((res) => {
            membreFinal._rev = res.rev;
            let m: any = {}
            m.doc = membreFinal;
            if(this.photo){
                var doc = {
                // _id: ida,
                  _attachments: {},
                  photoID: ida,
                  timestamp: new Date().toString()
                }

                //this.imageBlob = this.getBase64Image(document.getElementById("imageid"));

                this.fileName = ida + '.jpeg';
                doc._attachments[this.fileName] = {
                  content_type: 'image/jpeg', 
                  data: this.imageData
                }

                
                //this.servicePouchdb.createDoc(doc)
                this.servicePouchdb.put(doc, ida).then((res) => {
                  m.photo = this.photo;
                  m.photoDocId = ida;
                  m.photoDocRev = res.rev

                  this.membres.push(m);
                  //this.allMembres.push(m);
                  this.allMembres1.push(m);
                  this.ajoutForm = false;
                  this.nom_Membre = '';
                  this.surnom_Membre = '';
                  this.genre = '';
                  this.photo = null;

                  this.detail(m, false)
                  //this.membre = m;
                  //this.detailMembre = true;
                  //this.viewCtrl.dismiss(m)
                })
                
          
              }else{
                m.photo = 'assets/images/no-photo.png';
                this.membres.push(m);
                //this.allMembres.push(m);
                this.allMembres1.push(m);
                this.ajoutForm = false;
                this.nom_Membre = '';
                this.surnom_Membre = '';
                this.genre = '';
                this.photo = null;
                this.detail(m, false)
                //this.detailMembre = true;
                //this.viewCtrl.dismiss(m)
              }
          });
          
        
       
        }

     }else if(this.modifierForm){

        let actu_ch_es: boolean = false;
        let membre = this.membreForm.value;
        this.membre1.nom_Membre = membre.nom_Membre;
        this.membre1.surnom_Membre = membre.surnom_Membre;
        if(this.ancien_matricule !== membre.matricule_Membre){
          this.membre1.ancien_matricule_Membre = this.membre1.matricule_Membre;
          this.membre1.matricule_Membre = membre.matricule_Membre;
        }else{
          this.membre1.matricule_Membre = membre.matricule_Membre;
        }
        this.membre1.genre = membre.genre;
        this.membre1.classe = membre.classe;
        this.membre1.classe_nom = membre.classe_nom;
        this.membre1.classe_autre = membre.classe_autre;
        this.membre1.village = membre.village;
        this.membre1.village_nom = membre.village_nom;
        this.membre1.village_autre = membre.village_autre;
        this.membre1.op = membre.op;
        this.membre1.op_nom = membre.op_nom; 
        this.membre1.op_autre = membre.op_autre;
        let ida: any;
        if(!this.photoID && this.imageData){
          ida = 'fuma:photo:membre:'+ membre.matricule_Membre;
          this.membre1.photoID = ida;
        }

      this.villages.forEach((v, i) => {
        if(v.id === this.selectedVillageID){
          this.membre1.village = v.id;
          this.membre1.village_nom = v.nom;
        }
      });
   
      
      this.grandMembre.doc.data = this.membre1
      this.servicePouchdb.updateDocReturn(this.grandMembre.doc).then((res) => {
        //en cas de changement d'op
        if(this.membre1.op !== this.ancien_OP){
          this.changerOP(this.ancien_matricule, membre.matricule_Membre, membre.nom_Membre, membre.surnom_Membre)
          actu_ch_es = true;
        }else if((this.membre1.nom_Membre !== this.ancien_nom) || this.membre1.surnom_Membre !== this.ancien_surnom){
          //alert('diff')
          this.changerNom(this.ancien_nom, this.membre1.nom_Membre, this.membre1.surnom_Membre);
          actu_ch_es = true;
        }      

        //mise à jour de la photo
        this.grandMembre.doc._rev = res.rev;

        if(this.photoID && this.imageData){
        //mise a jour

          this.servicePouchdb.updateAtachementReturn(this.photoID, this.photoID + '.jpeg', this.photoRev, this.imageData , 'image/jpeg').then((res) => {
            this.grandMembre.photo = this.photo;
            this.grandMembre.photoDocId = this.photoID;
            this.grandMembre.photoDocRev = res.rev
            this.membre = this.grandMembre;

            this.modifierForm = false;
            this.ajoutForm = false;
            //this.detailMembre = true;
             if(actu_ch_es){
              this.detail(this.grandMembre, true);
              actu_ch_es = false;
             }else{
               this.detail(this.grandMembre, false)
             }
           /* this.membre = this.grandMembre;

            var membreID=this.membre.doc.data.matricule_Membre || 'pending';
            JsBarcode(this.barcode.nativeElement, membreID,{
              width: 1,
              height:50
            });*/
           /* let toast = this.toastCtl.create({
            message: 'Membre bien sauvegardé!',
            position: 'top',
            duration: 1000
          });*/

          //this.navCtrl.pop();
          /*this.modifierForm = false;
          this.ajoutForm = false;
          this.detailMembre = true;
          */
          this.membres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.membres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres1.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres1[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.reinitForm();
          //toast.present();
          });

          /*if(actu_ch_es){
            this.chargerMesChamps(this.membre.doc.data.matricule_Membre);
            this.chargerMesEssai(this.membre.doc.data.matricule_Membre);
            actu_ch_es = false;
          }*/
          
         // this.reinitForm();
        }else if(!this.photoID && this.imageData){
          //creation
          //let ida = 'fuma:photo:membre:'+ membre.matricule_Membre;
          this.membre.photoID = ida;
          var doc = {
          // _id: ida,
            _attachments: {},
            photoID: ida,
            timestamp: new Date().toString()
          }

          //this.imageBlob = this.getBase64Image(document.getElementById("imageid"));

        this.fileName = ida + '.jpeg';
          doc._attachments[this.fileName] = {
            content_type: 'image/jpeg', 
            data: this.imageData
          }

          //this.servicePouchdb.createDoc(doc)
        this.servicePouchdb.put(doc, ida).then((res) => {
          this.grandMembre.photo = this.photo;
          this.grandMembre.photoDocId = ida;
          this.grandMembre.photoDocRev = res.rev;
          this.membre = this.grandMembre;

          this.modifierForm = false;
          this.ajoutForm = false;
          //this.detailMembre = true;
          //this.detail(this.grandMembre, this.selectedSource)
           if(actu_ch_es){
              this.detail(this.grandMembre, true);
              actu_ch_es = false;
             }else{
               this.detail(this.grandMembre, false)
             }
          /*this.membre = this.grandMembre;
          
            var membreID=this.membre.doc.data.matricule_Membre || 'pending';
            JsBarcode(this.barcode.nativeElement, membreID,{
              width: 1,
              height:50
            });*/

         /* let toast = this.toastCtl.create({
            message: 'Membre bien sauvegardé!',
            position: 'top',
            duration: 1000
          });*/

          //this.navCtrl.pop();
          /*this.modifierForm = false;
          this.ajoutForm = false;
          this.detailMembre = true;*/
          this.membres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.membres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres1.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres1[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });
          //toast.present();
          this.reinitForm();
        });

         /*if(actu_ch_es){
            this.chargerMesChamps(this.membre.doc.data.matricule_Membre);
            this.chargerMesEssai(this.membre.doc.data.matricule_Membre);
            actu_ch_es = false;
         }*/

        }else{
          this.membre = this.grandMembre;

          this.modifierForm = false;
          this.ajoutForm = false;
          //this.detailMembre = true;
          //this.detail(this.grandMembre, this.selectedSource)
          if(actu_ch_es){
              this.detail(this.grandMembre, true);
              actu_ch_es = false;
             }else{
               this.detail(this.grandMembre, false)
             }
          /*
          var membreID=this.membre.doc.data.matricule_Membre || 'pending';
            JsBarcode(this.barcode.nativeElement, membreID,{
              width: 1,
              height:50
            });*/

          /*let toast = this.toastCtl.create({
            message: 'Membre bien sauvegardé!',
            position: 'top',
            duration: 1000
          });*/

          //this.navCtrl.pop();
          /*this.modifierForm = false;
          this.ajoutForm = false;
          this.detailMembre = true;*/
          this.membres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.membres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

          this.allMembres1.forEach((m, i) => {
            if(m.doc._id === this.membre.doc._id){
              this.allMembres1[i] = this.membre;
              //this.allMembres = this.membres;
            }
          });

         /* if(actu_ch_es){
            this.chargerMesChamps(this.membre.doc.data.matricule_Membre);
            this.chargerMesEssai(this.membre.doc.data.matricule_Membre);
            actu_ch_es = false;
          }*/

          this.reinitForm();

          
          //toast.present();
        }
      
      });

     }


      /* let toast = this.toastCtl.create({
            message: 'Membre OP bien enregistré!',
            position: 'top',
            duration: 1500
          });

          //this.navCtrl.pop();
          toast.present();*/
    
  }

   changerOP(ancienMatricule, nouveauMatricule, nomProducteur, surnomProducteur){
    let nouveauChamps: any = [];
    //let nouveauEssai: any = [];
    let id_champs: any = '';
    let nChamps: any = {};
    this.mes_champs.map((champs) => {
      champs = champs.doc;
      let code_champs = this.generateIdChamps(nouveauMatricule);
      let nouveauChamp: any = {};
      let data = champs.data;
      let id = 'fuma'+':champs:'+ code_champs;
      //nouveauChamp.data = 
      data.ancien_id_champs = champs.data.id_champs;
      data.id_champs = code_champs;
      data.matricule_producteur = nouveauMatricule;
      data.ancien_matricule_producteur = ancienMatricule;
      data.nom_producteur = nomProducteur;
      data.surnom_producteur = surnomProducteur;
      nouveauChamp._id = id;
      nouveauChamp.data = data;
      
      nouveauChamps.push(nouveauChamp);
      this.servicePouchdb.remove(champs._id);
      this.servicePouchdb.createDoc(nouveauChamp);
      nouveauChamp = {};
    });

    if(nouveauChamps.length > 0){
      let nouveauEssai: any = {};
      this.mes_essais.map((essai) => {
        essai = essai.doc;
        let code_essai = this.generateIdEssai(nouveauMatricule);
        let id = 'fuma'+':essai:'+ code_essai;
        //let nouveauEssai: any = {};
        let data = essai.data;
        //let id_champs = data.id_champs;
        data.ancien_code_essai = essai.data.code_essai;
        data.code_essai = code_essai
        
        if(id_champs !== essai.data.id_champs){
          nouveauChamps.map((champs) => {
            //champs = champs;
            if(champs.data.ancien_id_champs === data.id_champs){
              id_champs = champs.data.ancien_id_champs;
              nChamps = champs;
              data.ancien_id_champs = essai.data.id_champs;
              data.id_champs = champs.data.id_champs;
              data.matricule_producteur = nouveauMatricule;
              data.ancien_matricule_producteur = ancienMatricule;
              data.nom_producteur = nomProducteur;
              data.surnom_producteur = surnomProducteur;
              }
            });
        }else{
          data.ancien_id_champs = essai.data.id_champs;
          data.id_champs = nChamps.data.id_champs;
          data.matricule_producteur = nouveauMatricule;
          data.ancien_matricule_producteur = ancienMatricule;
          data.nom_producteur = nomProducteur;
          data.surnom_producteur = surnomProducteur;
        }
        nouveauEssai._id = id;
        nouveauEssai.data = data;
        
        this.servicePouchdb.remove(essai._id);
        this.servicePouchdb.createDoc(nouveauEssai);
        nouveauEssai = {};
      });
      nouveauChamps = [];
    }else{

      let nouveauEssai: any = {};
      this.mes_essais.map((essai) => {
        essai = essai.doc;
        let code_essai = this.generateIdEssai(nouveauMatricule);
        let id = 'fuma'+':essai:'+ code_essai;
        //let nouveauEssai: any = {};
        let data = essai.data;
        //let id_champs = data.id_champs;
        data.ancien_code_essai = essai.data.code_essai;
        data.code_essai = code_essai
        data.matricule_producteur = nouveauMatricule;
        data.ancien_matricule_producteur = ancienMatricule;
        data.nom_producteur = nomProducteur;
        data.surnom_producteur = surnomProducteur;

        nouveauEssai._id = id;
        nouveauEssai.data = data;
        
        this.servicePouchdb.remove(essai._id);
        this.servicePouchdb.createDoc(nouveauEssai);
        nouveauEssai = {};       
      });
      
      alert('Erreur mise à jour des essais, la liste des champs est vide!\n Matricule: '+ancienMatricule+' --> '+nouveauMatricule)
    }
    
  }


  changerNom(ancienNom, nouveauNom, surnouveauNom){
    this.mes_champs.map((champs) => {
      champs = champs.doc
      champs.data.nom_producteur = nouveauNom;
      champs.data.surnom_producteur = surnouveauNom;
      //alert(champs._id + " -> " + champs.data.nom_producteur)
      this.servicePouchdb.updateDoc(champs)
    });   

    this.mes_essais.map((essai) => {
      essai = essai.doc;
      essai.data.nom_producteur = nouveauNom;
      essai.data.surnom_producteur = surnouveauNom;
      this.servicePouchdb.updateDoc(essai);
    });    
  }

   generateIdEssai(matricule){
    var chars='ABCDEFGHIJKLMNPQRSTUVWYZ'
    var numbers='0123456789'
    var randomArray=[]
    for(let i=0;i<3;i++){
      var rand = Math.floor(Math.random()*10)
      randomArray.push(numbers[rand])
    }
    //randomArray.push('-')
    //var rand = Math.floor(Math.random()*24)
    //randomArray.push(chars[rand])
    var randomString=randomArray.join("");
    var Id= matricule+' '+'ES-'+/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    return Id;
  }

    generateIdChamps(matricule){
    var chars='ABCDEFGHIJKLMNPQRSTUVWYZ'
    var numbers='0123456789'
    var randomArray=[]
    for(let i=0;i<3;i++){
      var rand = Math.floor(Math.random()*10)
      randomArray.push(numbers[rand])
    }
    //randomArray.push('-')
    //var rand = Math.floor(Math.random()*24)
    //randomArray.push(chars[rand])
    var randomString=randomArray.join("");
    var Id= matricule+' '+'CH-'+/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    return Id;
  }


   chargerMesChamps(matricule){
    this.servicePouchdb.getPlageDocsRapide('fuma:champs:'+matricule, 'fuma:champs:'+matricule+'\uffff').then((c) => {
      if(c){
        this.mes_champs = c;
      }
      
    })
  }

  chargerMesEssai(matricule){
    this.servicePouchdb.getPlageDocsRapide('fuma:essai:'+matricule, 'fuma:essai:'+matricule+'\uffff').then((e) => {
      if(e){
        this.mes_essais = e;
      }
    });
  }



  annuler(){
    if(this.ajoutForm){
      this.ajoutForm = false;
    }

    if(this.detailMembre){
      this.detailMembre = false;
      this.membre = {};
      this.mes_champs = [];
      this.mes_essais = [];
    }

    if(this.modifierForm){
      this.modifierForm = false;
      this.detailMembre = true;
    }
    
   // this.viewCtrl.dismiss();
    //this.viewCtrl.dismiss();
  }


  chooseImage(){


    let option = {
      maximumImagesCount: 1,
      quality: 50,
      width: 500,
      height: 500,
      outputType: 1
    };

    this.imagePicker.getPictures(option).then((imageData) => {
      //this.photo = this.sanitizer.bypassSecurityTrustUrl(imageData[0]);
      this.imageData = imageData[0];
      this.base64Image = "data:image/jpeg;base64," + imageData[0];
      this.photo = this.base64Image ;
    }, (err) => console.log(err) );
  }

chargerOp(){
    this.nom_op
     this.servicePouchdb.getPlageDocsRapide('fuma:op','fuma:op:\uffff').then((oA) => {
         this.servicePouchdb.getPlageDocsRapide('koboSubmission_fuma-op','koboSubmission_fuma-op\uffff').then((oK) => {
          this.ops = oA.concat(oK);
          //this.ops.push(this.autreOP);
      }, err => console.log(err));

    }, err => console.log(err)); 
    
}

  createDate(jour: any, moi: any, annee: any){
    let s = annee+'-';
    moi += 1;
    if(moi < 10){
      s += '0'+moi+'-';
    }else{
      s += moi+'-';
    }

    if(jour < 10){
      s += '0'+jour;
    }else{
      s += jour;
    }
    return s;
  }

  getMatricule(){
    let membre = this.membreForm.value;
   
    if(this.nom.length === 2){
      //this.matricule = this.generateId(this.nom.toUpperCase().substr(0, 2),/* membre.pays.toUpperCase().substr(0, 2), membre.region.toUpperCase().substr(0, 2), membre.departement.toUpperCase().substr(0, 2), membre.commune.toUpperCase().substr(0, 2), this.selectedVillage.nom.toUpperCase().substr(0, 2)*/);
    } 
 }
 
  generateId(code_op/*operation, /*pays, region, departement, commune, village*/){

    var chars='ABCDEFGHIJKLMNPQRSTUVWYZ'
    var numbers='0123456789'
    var randomArray=[]
    for(let i=0;i<3;i++){
      var rand = Math.floor(Math.random()*10)
      randomArray.push(numbers[rand])
    }
    randomArray.push('-')
    var rand = Math.floor(Math.random()*24)
    randomArray.push(chars[rand])
    var randomString=randomArray.join("");
    //var Id= 'FM-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    var Id= 'FM-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    //var Id= 'MR-'+ code_op + ' ' + randomString// operation+' '/*+pays+'-'+region+'-'+department+'-'+commune +'-' +village+ */+randomString 
    
    return Id
  }

 


  option(){
    this.menuCtl.enable(true, 'options');
    this.menuCtl.enable(false, 'connexion');
    this.menuCtl.enable(false, 'profile');
    this.menuCtl.toggle()
  }

  profile(){
    this.menuCtl.enable(false, 'options');
    this.menuCtl.enable(false, 'connexion');
    this.menuCtl.enable(true, 'profile');
    this.menuCtl.toggle()
  }

  connexion(){
    this.menuCtl.enable(false, 'options');
    this.menuCtl.enable(true, 'connexion');
    this.menuCtl.enable(false, 'profile');
    this.menuCtl.toggle() 
  }

  sync(){
    this.servicePouchdb.syncAvecToast(this.getInitMemebre());
  }

   choixLimit(){
    this.rechercher = true;
    if(this.selectedLimit !== 'Tous'){
      this.membres = this.allMembres.slice(0, this.selectedLimit);
      this.rechercher = false;
    }else{
      this.membres = this.allMembres;
      this.rechercher = false;
    }
    
  }


  choixLimit1(){
    if(this.selectedSource === 'application'){
      if(this.selectedLimit === 'Tous'){
        this.getMembres('fuma:op:membre', 'fuma:op:membre:\uffff');
        }else{
           this.getMembresAvecLimite('fuma:op:membre', 'fuma:op:membre:\uffff', this.selectedLimit);
        }
      /*this.servicePouchdb.getPlageDocs('fuma:op:membre','fuma:op:membre:\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }else if(this.selectedSource === 'kobo'){
       if(this.selectedLimit === 'Tous'){
        this.getMembres('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff');
       }else{
         this.getMembresAvecLimite('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff', this.selectedLimit);
       }
      /*this.servicePouchdb.getPlageDocs('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }
  }

  ionViewDidLoad(){
    this.initForm();
    /*this.storage.get('confLocaliteEnquete').then((confLocaliteEnquete) => {
      if(confLocaliteEnquete){
        this.confLocaliteEnquete = confLocaliteEnquete;
        //this.initForm();

        //this.chargerConfLocaliter(confLocaliteEnquete)
        
        this.estInitForm = true;
        //this.pourCreerForm();
        //this.getInfoSimEmei();
      }
      //this.chargerVillages(this.confLocaliteEnquete.commune.id);
    }, err => alert('Une erreur c\est produite lors du chergement de la localité de l\'enquette'));*/
  }

  getInitMemebre(){
    //this.rechercher = true;
    if(this.selectedSource === 'application'){
      if(this.selectedLimit === 'Tous'){
        this.getMembres('fuma:op:membre', 'fuma:op:membre:\uffff');
        }else{
           this.getMembresAvecLimite('fuma:op:membre', 'fuma:op:membre:\uffff', this.selectedLimit);
           this.getAllMembres('fuma:op:membre', 'fuma:op:membre:\uffff');
        }
      /*this.servicePouchdb.getPlageDocs('fuma:op:membre','fuma:op:membre:\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }else if(this.selectedSource === 'kobo'){
       if(this.selectedLimit === 'Tous'){
        this.getMembres('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff');
       }else{
         this.getMembresAvecLimite('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff', this.selectedLimit);
         this.getAllMembres('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff');
        }
      /*this.servicePouchdb.getPlageDocs('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }else{
      this.rechercher = true;
      this.servicePouchdb.getPlageDocs('fuma:op:membre','fuma:op:membre:\uffff').then((mbrA) => {
      
         this.servicePouchdb.getPlageDocs('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrK) => {
          this.membres = mbrA.concat(mbrK);
          this.allMembres = this.membres
          this.rechercher = false;

       
      }, err => console.log(err));

      }, err => console.log(err));      
    }

    this.servicePouchdb.getPlageDocsRapide('fuma:op:membre','fuma:op:membre:\uffff').then((mbrsA) => {
         this.servicePouchdb.getPlageDocsRapide('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrsK) => {
          this.allMembres1 = mbrsA.concat(mbrsK);
          //this.rechercher = false;
      }, err => console.log(err));

      }, err => console.log(err));   
    
      this.storage.get('confLocaliteEnquete').then((confLocaliteEnquete) => {
        if(confLocaliteEnquete){
          this.confLocaliteEnquete = confLocaliteEnquete;
        }
    });

    this.chargerOp();

  }

  ionViewDidEnter() {
   
    this.servicePouchdb.remoteSaved.getSession((err, response) => {
        if (response.userCtx.name) {
          this.aProfile = true;
        }else{
          this.aProfile = false;
        }
    }, err => {
      if(global.info_user != null){
        this.aProfile = true; 
      }else{
        this.aProfile = false;
      }
      //console.log(err)
    }); 

    if(!this.estInitierMemebre){
      this.getInitMemebre();
      this.getInfoSimEmei();
      this.estInitierMemebre = true;
    }
    
    if(this.estInitierMemebre){
      this.storage.get('confLocaliteEnquete').then((confLocaliteEnquete) => {
          if(confLocaliteEnquete){
            this.confLocaliteEnquete = confLocaliteEnquete;
          }
      });

      this.chargerOp();
    }
    
    /*if(!this.estInitForm){
      this.storage.get('confLocaliteEnquete').then((confLocaliteEnquete) => {
        if(confLocaliteEnquete){
          this.confLocaliteEnquete = confLocaliteEnquete;
          //this.initForm();
          //this.pourCreerForm();
          //this.getInfoSimEmei();
          this.initForm();
          //this.pourCreerForm();
          this.getInfoSimEmei();
         // this.chargerConfLocaliter(confLocaliteEnquete);
        }
        //this.chargerVillages(this.confLocaliteEnquete.commune.id);
      }, err => alert('Une erreur c\est produite lors du chergement de la localité de l\'enquette'));
    }else{
      this.pourCreerForm();
      this.getInfoSimEmei();
    }*/
    
    
  }

  choixSource(){

     if(this.selectedSource === 'application'){
       if(this.selectedLimit === 'Tous'){
        this.getMembres('fuma:op:membre', 'fuma:op:membre');
       }else{
         this.getMembresAvecLimite('fuma:op:membre', 'fuma:op:membre', this.selectedLimit);
       }
     /* this.servicePouchdb.getPlageDocs('fuma:op:membre','fuma:op:membre:\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }else if(this.selectedSource === 'kobo'){
      if(this.selectedLimit === 'Tous'){
        this.getMembres('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff');
      }else{
        this.getMembresAvecLimite('koboSubmission_fuma-op-membre', 'koboSubmission_fuma-op-membre\uffff', this.selectedLimit);
      }
     /* this.servicePouchdb.getPlageDocs('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrs) => {
        if(mbrs){
          this.membres = mbrs;
          this.allMembres = mbrs;
        }
      });*/
    }else{
      
      this.servicePouchdb.getPlageDocs('fuma:op:membre','fuma:op:membre:\uffff').then((mbrA) => {
       
         this.servicePouchdb.getPlageDocs('koboSubmission_fuma-op-membre','koboSubmission_fuma-op-membre\uffff').then((mbrK) => {
          this.membres = mbrA.concat(mbrK);
          this.alertCtl = this.membres

      }, err => console.log(err));

      }, err => console.log(err));
     
      
    }

  }

  ajouter(){
    this.photo = '';
    this.photoID = '';
    this.photoRev = '';
    this.imageData = '';
    this.imageBlob = '';
    if(this.confLocaliteEnquete){

      this.pourCreerForm();

      let maDate = new Date();
      let today = this.createDate(maDate.getDate(), maDate.getMonth(), maDate.getFullYear());

      this.today = today;


      this.chargerConfLocaliter(this.confLocaliteEnquete)
      if(this.num_aggrement_op){
        this.matricule = this.generateId(this.code_op);
      }

      this.ajoutForm = true;
     /* if(this.num_aggrement_op){
        //this.navCtrl.push('AjouterMembrePage', {'confLocaliteEnquete': confLocaliteEnquete, 'num_aggrement_op': this.num_aggrement_op, 'nom_op': this.nom_op, 'code_op': this.code_op});
        let model = this.modelCtl.create('AjouterMembrePage', {'confLocaliteEnquete': confLocaliteEnquete, 'num_aggrement_op': this.num_aggrement_op, 'nom_op': this.nom_op, 'code_op': this.code_op})
        model.onDidDismiss(membre => {
          if (membre) {
          // this.allEssais.push(essai);
            this.zone.run(() => {
              this.membres.push(membre);
              this.allMembres = this.membres;
              //this.events.publish('ajout-essai', {'essai': essai});
            });
            
            
          }
        });
        model.present();
    }else{
        //this.navCtrl.push('AjouterMembrePage', {'confLocaliteEnquete': confLocaliteEnquete});
        //this.zone
         let model = this.modelCtl.create('AjouterMembrePage', {'confLocaliteEnquete': confLocaliteEnquete})
          model.onDidDismiss(membre => {
            if (membre) {
              //this.allEssais.push(essai);
              this.zone.run(() => {
                this.membres.push(membre);
                this.allMembres = this.membres;
                //this.allEssais.push(essai);
              });
              
            }
          });
          model.present();
     
    }*/
      
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'Vous devez d\'abord définir la configuration de la localité à enquêtée!',
        buttons: [
          {
            text: 'Définir localité',
            handler:  () => {
              let model = this.modelCtl.create('ConfLocaliteEnquetePage');
              model.present();

              model.onDidDismiss((confLocaliteEnquete) => {
                if(confLocaliteEnquete){
                    this.confLocaliteEnquete = confLocaliteEnquete;
                    this.ajouter();
                    //this.ajoutForm = true;
                  }else{
                    this.ajoutForm = false;
                  }
                /*this.storage.get('confLocaliteEnquete').then((confLocaliteEnquete) => {
                  if(confLocaliteEnquete){
                    this.confLocaliteEnquete = confLocaliteEnquete;
                  }
                })*/
              })
              //this.navCtrl.push('ConfLocaliteEnquetePage');
            }        
          },
          {
            text: 'Annuler',
            handler: () => console.log('annuler')
          }
        ]
      });

      alert.present();
    }
    
  }

  detail(membre, selectedSource){
    this.membre = membre;
    var membreID=this.membre.doc.data.matricule_Membre || 'pending'
      JsBarcode(this.barcode.nativeElement, membreID,{
        width: 1,
        height:50
      });

      //alert(membre.doc._id.substr(15, membre.doc._id.length - 14))

    //  alert(membreID.substr(membreID.indexOf(' '), membreID.length - membreID.indexOf(' ')))
    //this.navCtrl.push('DetailMembrePage', {'membre': membre, 'selectedSource': selectedSource});
    this.detailMembre = true;
    if(selectedSource){
      this.chargerMesChamps(membre.doc.data.matricule_Membre);
      this.chargerMesEssai(membre.doc.data.matricule_Membre);
    }
  }

  typeRechercheChange(){
    //this.membres = this.allMembres;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    //this.membres = this.allMembres;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '' && val.trim() != 'FM-' && val.trim() != 'fm-') {
      this.membres = this.allMembres.filter((item) => {
        if(this.typeRecherche === 'nom'){
          return (item.doc.data.nom_Membre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }else if(this.typeRecherche === 'matricule'){
          if(val.trim() > 'FM-' || val.trim() > 'fm-'){
            return (item.doc.data.matricule_Membre.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        }else if(this.typeRecherche === 'site'){
          if(item.doc.data.commune_nom){
            return (item.doc.data.commune_nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        }else if(this.typeRecherche === 'village'){
          if(item.doc.data.village_nom){
            return (item.doc.data.village_nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        }
        
      });
    }else{
      this.choixLimit();
    }
  }

  getItemsByMatricule(ev: any) {
    // Reset items back to all of the items
    this.membres = this.allMembres;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.membres = this.membres.filter((item) => {
        return (item.doc.data.matricule_Membre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } 
  }

  getItemsByNom(ev: any) {
    // Reset items back to all of the items
    this.membres = this.allMembres;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.membres = this.membres.filter((item) => {
        return (item.doc.data.nom_Membre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } 
  }

  getMembres(strk, endk) {
    this.rechercher = true;
    if(this.num_aggrement_op){
      this.servicePouchdb.getAll(
      {
        startkey: strk + ':' + this.code_op,
        endkey: strk + ':' + this.code_op + ':\uffff',
        include_docs: true
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              this.membres = res
              this.allMembres=res
              this.rechercher = false;
           
          }
        )
      }
      );
    
    }else{

      this.servicePouchdb.getAll(
      {
        startkey: strk,
        endkey: strk + ':\uffff',
        include_docs: true
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              this.membres = res
              this.allMembres=res  
              this.rechercher = false;         
          }
        )
      }
      );
    

    }
  /*    this.servicePouchdb.getAll(
      {
        startkey: strk,
        endkey: endk,
        include_docs: true
      },
    ).then(
      res => {
        var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {

            let m: any = res
            if(this.num_aggrement_op){
              let mbrs: any = [];
              m.forEach((mbr, i) => {
                if(mbr.doc.data.op === this.num_aggrement_op){
                  mbrs.push(mbr);
                }
              });

            this.membres = mbrs
            this.allMembres=mbrs
            }else{
              this.membres = res
              this.allMembres=res
            }
           
          }
        )
      }
      );
    */
  }

   getAllMembres(strk, endk) {
    this.rechercher = true;
    if(this.num_aggrement_op){
      this.servicePouchdb.getAll(
      {
        startkey: strk + ':' + this.code_op,
        endkey: strk + ':' + this.code_op + ':\uffff',
        include_docs: true
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              //this.membres = res
              this.allMembres=res
              //this.rechercher = false;
           
          }
        )
      }
      );
    
    }else{

      this.servicePouchdb.getAll(
      {
        startkey: strk,
        endkey: strk + ':\uffff',
        include_docs: true
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              //this.membres = res
              this.allMembres=res  
              //this.rechercher = false;         
          }
        )
      }
      );
    }
  }

  getMembresAvecLimite(strk, endk, limit) {
    this.rechercher = true;
    if(this.num_aggrement_op){
      this.servicePouchdb.getAll(
      {
        startkey: strk+ ':'+this.code_op,
        endkey: strk + ':' +this.code_op + ':\uffff',
        include_docs: true,
        limit: limit,
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              this.membres = res
              this.allMembres=res
              this.rechercher = false;          
          }
        );
      }
      );
    
    }else{
      this.servicePouchdb.getAll(
      {
        startkey: strk,
        endkey: strk + ':\uffff',
        include_docs: true,
        limit: limit,
      },
    ).then(
      res => {
        var membres: any = [];
        res.rows.map((row) => {
          if(!row.doc.data.deleted){
            membres.push(row);
          }
        });
        //var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {
              this.membres = res
              this.allMembres=res
              this.rechercher = false;
          }
        );
      }
      );
    

    }
  /*  this.servicePouchdb.getAll(
      {
        startkey: strk,
        endkey: endk,
        include_docs: true,
        limit: limit,
      },
    ).then(
      res => {
        var membres = res.rows
        var promises = membres.map(function (membre) {
          return this.getPhoto(membre)
        }.bind(this))
        return Promise.all(promises).then(
          res => {

            let m: any = res
            if(this.num_aggrement_op){
              let mbrs: any = [];
              m.forEach((mbr, i) => {
                if(mbr.doc.data.op === this.num_aggrement_op){
                  mbrs.push(mbr);
                }
              });

            this.membres = mbrs
            this.allMembres=mbrs
            }else{
              this.membres = res
              this.allMembres=res
            }
           
          }
        )
      }
      )
    */
  }


  getPhoto(membre) {
    return new Promise((resolve, reject) => {
      //var v = true;
      var photoDocId = '';
      var filename = '';
      if(!membre.doc.data.photoID){
        var profilePhotoId = membre.doc.data["meta/deprecatedID"];
        photoDocId = 'photos_fuma-op-membre/' + profilePhotoId;
        filename = profilePhotoId + '.jpeg';
        //v = false;
      }else{
        photoDocId = membre.doc.data.photoID;
        filename = photoDocId + '.jpeg';
        //v = true;
        //alert(v)
      }

      //var profilePhotoId = membre.doc.data["meta/deprecatedID"]
      // return 'assets/images/no photo.jpg'
      //this.servicePouchdb.getAttachment('photos_fuma-op-membre/' + profilePhotoId, filename).then(url => {
      this.servicePouchdb.getAttachment(photoDocId, filename).then(url => {
         //membre.photo = this.sanitizer.bypassSecurityTrustUrl(url)
         if(url){
           if(!membre.doc.data.photoID){
            membre.photo = this.sanitizer.bypassSecurityTrustUrl(url)
            if (url != "assets/images/no-photo.png") {
              membre.photoDocId = photoDocId;
            } 

            this.servicePouchdb.getDocById(photoDocId).then((doc) => {
              if(doc){
                membre.photoDocRev = doc._rev;
              }
              resolve(membre)
            }, err => resolve(membre)).catch(() => resolve(membre))
            
          }else{
            //var blobURL = blobUtil.createObjectURL(url);
            //URL.createObjectURL()
            membre.photo = this.sanitizer.bypassSecurityTrustUrl(url);
            if (url != "assets/images/no-photo.png") {
              membre.photoDocId = photoDocId;

            } 

            this.servicePouchdb.getDocById(photoDocId).then((doc) => {
              if(doc){
                membre.photoDocRev = doc._rev;
              }
              resolve(membre)
            }, err => resolve(membre)).catch(() => resolve(membre))
            //resolve(membre)
          }
        
         }
      }).catch(err => {
        console.log('err', err)
        // profile.photo = 
        // resolve(profile)
      })
    })
  }


   editer(membre, photo, photoID, photoRev){
    //this.navCtrl.push('ModifierMembrePage', {'membre': membre, 'photo': photo, 'photoID': photoID, 'photoRev': photoRev});
    
    this.grandMembre = membre;
    this.photoID = this.grandMembre.photoDocId;
    this.photoRev = this.grandMembre.photoDocRev;
    this.photo = this.grandMembre.photo;

    //this.classes.push(this.autreClasse);

    this.membre1 = this.grandMembre.doc.data;
    this.selectedClasseID = this.membre1.classe;
    this.selectedOPID = this.membre1.op;
    this.ancienSelectedOPID = this.membre1.op;
    this.selectedVillageID = this.membre1.village;
    this.matricule = this.membre1.matricule_Membre;
    this.ancien_matricule = this.membre1.matricule_Membre;
    this.ancien_OP = this.membre1.op;
    this.ancien_nom_op = this.membre1.op_nom;
    this.ancien_code_op = this.membre1.op_code;
    this.nom = this.membre1.nom_Membre;
    this.ancien_nom = this.membre1.nom_Membre;
    this.ancien_surnom = this.membre1.surnom_Membre;
    if(!this.matricule){
      this.getMatricule();
      this.generate = true;
    }

    this.selectedVillageID = this.membre1.village;
    this.selectedOPID = this.membre1.op;
    this.nom_Membre = this.membre1.nom_Membre;
    this.surnom_Membre = this.membre1.surnom_Membre;
    this.genre = this.membre1.genre;
    this.today = this.membre1.today;

    this.pays = this.membre1.pays;
    this.pays_nom = this.membre1.pays_nom;
    //this.pays_autre = loc.pays_autre;
    this.region = this.membre1.region;
    this.region_nom = this.membre1.region_nom;
    //this.region_autre = loc.region_autre;
    this.departement = this.membre1.departement;
    this.departement_nom = this.membre1.departement_nom;
    //this.departement_autre = loc.departement_autre;
    this.commune = this.membre1.commune;
    this.commune_nom = this.membre1.commune_nom;
    //this.commune_autre = loc.commune_autre;

    this.chargerVillages(this.membre1.commune);
      

    /*if(this.membre1.village_autre){
        this.nom_autre_village = this.membre1.village_autre;
      }else{
        this.nom_autre_village = 'NA';
      }*/

    /*if(this.membre1.op_autre) {
        this.nom_autre_op = this.membre1.op_autre;
    }else{
      this.nom_autre_op = 'NA';
    }*/

    /* if(this.membre1.classe_autre) {
        this.nom_autre_classe = this.membre1.classe_autre;
    }else{
      this.nom_autre_classe = 'NA';
    }*/

    //this.chargerVillages(this.membre1.commune);

    
    this.modifierForm = true;
    this.detailMembre = false;

  }

  reinitForm(){
    this.grandMembre = {};
    this.photoID = '';
    this.photoRev = '';
    this.photo = '';

    //this.classes.push(this.autreClasse);

    this.membre1 = {};
    this.selectedClasseID = '';
    this.selectedOPID = '';
    this.ancienSelectedOPID = '';
    this.selectedVillageID = '';
    this.matricule = '';
    this.ancien_matricule = '';
    this.ancien_OP = '';
    this.ancien_nom_op = '';
    this.ancien_code_op = '';
    this.nom = '';
    this.ancien_nom = '';
    this.ancien_surnom = '';
    /*if(!this.matricule){
      this.getMatricule();
      this.generate = true;
    }*/

    this.selectedVillageID = '';
    this.selectedOPID = '';
    this.nom_Membre = '';
    this.surnom_Membre = '';
    this.genre = '';
    this.today = '';

    this.pays = '';
    this.pays_nom = '';
    //this.pays_autre = loc.pays_autre;
    this.region = '';
    this.region_nom = '';
    //this.region_autre = loc.region_autre;
    this.departement = '';
    this.departement_nom = '';
    //this.departement_autre = loc.departement_autre;
    this.commune = '';
    this.commune_nom = '';
    //this.commune_autre = loc.commune_autre;

  }

  mesChamps(matricule, nom, membre){
    //this.navCtrl.push('ChampsPage', {'matricule_producteur': matricule, 'nom_producteur': nom, 'membre': membre})
    let model = this.modelCtl.create('ChampsPage', {'matricule_producteur': matricule, 'nom_producteur': nom, 'membre': membre});
    model.present();

    model.onDidDismiss((ch) => {
      if(ch){
        this.mes_champs = ch;
      }
    });
  }

  mesEssai(matricule, nom, membre){
    //this.navCtrl.push('EssaiPage', {'matricule_producteur': matricule, 'nom_producteur': nom, 'membre': membre})
    let model = this.modelCtl.create('EssaiPage', {'matricule_producteur': matricule, 'nom_producteur': nom, 'membre': membre});
    model.present();
    model.onDidDismiss((ess) => {
      if(ess){
        this.mes_essais = ess;
      }
    });
  }

  supprimer(membre){
    let alert = this.alertCtl.create({
      title: 'Suppression membre OP',
      message: 'Etes vous sûr de vouloir supprimer ce membre ?',
      buttons:[
        {
          text: 'Annuler',
          handler: () => console.log('suppression annulée')
 
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.servicePouchdb.deleteDocReturn(membre).then((res) => {
               if(membre.data.photoID){
                this.servicePouchdb.getDocById(membre.data.photoID).then((doc) => {
                  if(doc){
                    this.servicePouchdb.deleteDocReturn(doc).then(res => console.log('ok'), err => console.log('err'));
                  }
                }, err => console.log(err))
                
              }

              this.membres.forEach((m, i) => {
                if(m.doc._id === membre._id){
                  this.membres.splice(i, 1);
                  //this.allMembres1.splice(i, 1);
                  //this.allMembres = this.membres;
                }
              })

              this.allMembres1.forEach((m, i) => {
                if(m.doc._id === membre._id){
                  this.allMembres1.splice(i, 1);
                  /*this.detailMembre = false;
                  this.membre = {};*/
                }
              });

              this.detailMembre = false;
              this.membre = {};
            });
           
            /*let toast = this.toastCtl.create({
              message:'Membre OP bien suppriée',
              position: 'top',
              duration: 3000
            });

            toast.present();
            this.navCtrl.pop();*/
          }
        }
      ]
    });

    alert.present();
  }

  
}
