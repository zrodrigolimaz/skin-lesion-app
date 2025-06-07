import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  imports: [CommonModule],
  styleUrls: ['./image-upload.component.css'],
  standalone: true
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<{ thumbnail: string; class: string; confidence: number }>();

  selectedFile!: File;
  result: { class: string; confidence: number } | null = null;
  isDragOver = false;
  isUploading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
      }
    }
  }

  removeFile() {
    this.selectedFile = null as any;
    this.result = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadImage() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('https://skin-lesion-api-production.up.railway.app/predict', formData).subscribe({
      next: (res) => {
        this.result = res;
        this.isUploading = false;
        const thumbnail = URL.createObjectURL(this.selectedFile);
        this.imageUploaded.emit({ thumbnail, class: res.class, confidence: res.confidence });
      },
      error: (err) => {
        alert("Erro ao enviar imagem: " + err.message);
        this.isUploading = false;
      }
    });
  }
}
