import { Directive, OnInit, ElementRef, HostListener, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective implements OnInit {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostBinding('style.backgroundColor') backgroundColor = '#EEEEEE';
  @HostBinding('style.borderRadius') borderRadius = '5px';
  // @HostBinding('style.border') border = 'none';

  ngOnInit(): void { }

  @HostListener('mouseenter') onRowHover(eventData?: Event) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#000');
    this.backgroundColor = '#DACFA1';
    // this.border = '1px solid #7C6600';
  }

  @HostListener('mouseleave') onRowLeave(eventData?: Event) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#000');
    this.backgroundColor = '#EEEEEE';
    // this.border = 'none';
  }

}
