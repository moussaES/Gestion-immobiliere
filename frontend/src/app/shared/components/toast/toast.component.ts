import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastSvc.toasts$ | async" 
           class="toast-message" 
           [ngClass]="toast.type">
        <i class="fas" [ngClass]="{
          'fa-check-circle': toast.type === 'success',
          'fa-exclamation-circle': toast.type === 'error',
          'fa-info-circle': toast.type === 'info'
        }"></i>
        <span class="message-text">{{ toast.message }}</span>
        <button class="close-btn" (click)="toastSvc.remove(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      color: #fff;
      font-size: 14px;
      min-width: 250px;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    }
    .toast-message i { font-size: 18px; }
    .message-text { flex: 1; }
    .close-btn { 
      background: none; border: none; color: white; 
      font-size: 20px; cursor: pointer; opacity: 0.8;
      padding: 0; margin-left: 10px;
    }
    .close-btn:hover { opacity: 1; }
    
    .success { background: #2e7d32; }
    .error { background: #d32f2f; }
    .info { background: #1976d2; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastSvc: ToastService) {}
}
