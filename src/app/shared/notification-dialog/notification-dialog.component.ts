import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Cerrar automáticamente después de 3 segundos
    setTimeout(() => {
      this.close.emit();
    }, 3000);
  }

  onClose() {
    this.close.emit();
  }
}
