import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UslugeService } from '../usluge.service';

@Component({
  selector: 'app-usluge-modal',
  templateUrl: './usluge-modal.component.html',
  styleUrls: ['./usluge-modal.component.scss'],
})
export class UslugeModalComponent implements OnInit {
  @Input()
  title!: string;
  selectedImageFile?: File;
  selectedImagePreview?: string;
  isUploading = false;

  constructor(private modalCtrl: ModalController, private uslugeService: UslugeService) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onAddUsluga(forma: NgForm) {
  if (!forma.valid) {
    return;
  }

  if (this.selectedImageFile) {
    this.uslugeService.uploadImageToSupabase(this.selectedImageFile)
      .then((imageUrl) => {
        this.modalCtrl.dismiss({
          usluga: {
            naziv: forma.value['naziv'],
            opis: forma.value['opis'],
            slikaUrl: imageUrl
          }
        }, 'confirm');
      })
      .catch(error => {
        console.error('Upload greška:', error);
      });
  } else {
    this.modalCtrl.dismiss({
      usluga: {
        naziv: forma.value['naziv'],
        opis: forma.value['opis'],
        slikaUrl: '' // ili neka default vrednost
      }
    }, 'confirm');
  }

  
}
 onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
