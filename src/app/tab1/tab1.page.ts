import { ViewChild, ElementRef, Component, signal } from '@angular/core';

/* Importe el pipe */
import { PercentPipe } from '@angular/common';

import { /* Importe los componentes de la UI */
  IonCardContent, IonList, IonItem,
  IonGrid, IonCol, IonRow,
  IonLabel, IonButton, IonInput, IonIcon,
  IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/angular/standalone';

/* Importe el servicio */
import { TeachablemachineService } from '../services/teachablemachine.service';



import { ExploreContainerComponent } from '../explore-container/explore-container.component';

/* Importe la función y el ícono */
import { addIcons } from 'ionicons';
import { clipboardOutline, cloudUpload } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [/* Registre los componentes de la UI */
    IonCardContent, IonButton, IonList, IonItem, IonLabel,
    /* Registre el pipe */
    PercentPipe,
    IonGrid, IonCol, IonRow,
    IonLabel, IonButton, IonInput, IonIcon,
    IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})


export class Tab1Page {

  /* Declare la referencia al elemento con el id image */
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;


  imageReady = signal(false)
  imageUrl = signal("")

  /* Declare los atributos para almacenar el modelo y la lista de clases */
  modelLoaded = signal(false);
  classLabels: string[] = [];

  constructor(private teachablemachine: TeachablemachineService) {
    addIcons({ clipboardOutline, cloudUpload });
  }

  /* Método ngOnInit para cargar el modelo y las clases */
  async ngOnInit() {
    await this.teachablemachine.loadModel()
    this.classLabels = this.teachablemachine.getClassLabels()
    this.modelLoaded.set(true)
  }

  /* El método onSubmit para enviar los datos del formulario mediante el servicio */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();

      // Convertir el archivo a una URL base64 para mostrarlo en el html
      reader.onload = () => {
        this.imageUrl.set(reader.result as string)
        this.imageReady.set(true)
      };

      reader.readAsDataURL(file); // Leer el archivo como base64
    }
  }

  /* Lista de predicciones */
  predictions: any[] = [];


  /* Método para obtener la predicción a partir de la imagen */
  async predict() {
    try {
      const image = this.imageElement.nativeElement;
      this.predictions = await this.teachablemachine.predict(image);
    } catch (error) {
      console.error(error);
      alert('Error al realizar la predicción.');
    }
  }

}
