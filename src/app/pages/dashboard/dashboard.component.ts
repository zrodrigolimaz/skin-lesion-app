import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from '../../components/image-upload/image-upload.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ImageUploadComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  imagesUploadedCount = 0;
  imageHistory: { thumbnail: string; class: string; confidence: number }[] = [];
  uvIndex: number | null = null;
  uvRiskLevel: string | null = null;
  menuOpen = false;

  constructor(private http: HttpClient) {
    this.fetchUVIndex();
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  incrementImageCount(thumbnail: string, classification: string, confidence: number) {
    this.imagesUploadedCount++;
    this.imageHistory.unshift({ thumbnail, class: classification, confidence });
    if (this.imageHistory.length > 5) {
      this.imageHistory.pop();
    }
    this.saveToLocalStorage();

    const analyzeSection = document.querySelector('.analyze-section');
    if (analyzeSection) {
      analyzeSection.scrollIntoView({ behavior: 'smooth' });
    }

    const downloadSection = document.querySelector('.download-section');
    if (analyzeSection && downloadSection) {
      analyzeSection.insertAdjacentElement('afterend', downloadSection);
    }
  }

  fetchUVIndex() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.http
          .get<any>(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&uv_index=true`
          )
          .subscribe(
            (data) => {
              this.uvIndex = data.current_weather.uv_index;
              this.uvRiskLevel = this.uvIndex !== null ? this.getUVRiskLevel(this.uvIndex) : 'Indisponível';
            },
            (error) => {
              this.uvRiskLevel = 'Erro ao obter dados';
            }
          );
      },
      (error) => {
        this.uvRiskLevel = 'Erro ao obter localização';
      }
    );
  }

  getUVRiskLevel(uvIndex: number): string {
    if (uvIndex < 3) return 'Baixo';
    if (uvIndex < 6) return 'Moderado';
    if (uvIndex < 8) return 'Alto';
    if (uvIndex < 11) return 'Muito Alto';
    return 'Extremo';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  saveToLocalStorage() {
    localStorage.setItem('imagesUploadedCount', JSON.stringify(this.imagesUploadedCount));
    localStorage.setItem('imageHistory', JSON.stringify(this.imageHistory));
  }

  loadFromLocalStorage() {
    const savedCount = localStorage.getItem('imagesUploadedCount');
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedCount) {
      this.imagesUploadedCount = JSON.parse(savedCount);
    }
    if (savedHistory) {
      this.imageHistory = JSON.parse(savedHistory);
    }
  }
}
