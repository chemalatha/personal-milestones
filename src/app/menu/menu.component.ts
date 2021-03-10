import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  @Output() menuclick = new EventEmitter<string>();

  constructor() { }

  onMenuClick(option?: string): void {
    this.menuclick.emit(option);
  }

}
