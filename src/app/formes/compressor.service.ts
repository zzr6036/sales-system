import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';


// @Injectable({
//   provide: 'root'
// })

// @Injectable()

export class CompressorService {

  constructor() { }
  compress(file: File, width:number = 500): Observable<any> {
    //const width = 200; // For scaling relative to width
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create(observer => {
      reader.onload = ev => {
        const img = new Image();
        img.src = (ev.target as any).result;
        (img.onload = () => {
          const elem = document.createElement('canvas'); // Use Angular's Renderer2 method
          let width2 = img.width < width ? img.width : width;  
          const scaleFactor = width2 / img.width;
          elem.width = width2;
          elem.height = img.height * scaleFactor;
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width2, img.height * scaleFactor);
          ctx.canvas.toBlob(
            blob => {
              observer.next(
                new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }),
              );
            },
            'image/jpeg',
            1,
          );
        }),
          (reader.onerror = error => observer.error(error));
      };
    });
  }
}