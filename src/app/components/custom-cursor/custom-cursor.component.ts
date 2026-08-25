import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor" [style.left.px]="cursorX" [style.top.px]="cursorY" [class.mouse-hovered]="isHovered"></div>
    <div class="cursor-follower" [style.left.px]="followerX" [style.top.px]="followerY" [class.mouse-hovered]="isHovered"></div>
  `,
  styles: [`
    :host { display: block; }
    .cursor {
      position: fixed;
      background-color: var(--primary, #EC1C24);
      width: 8px;
      height: 8px;
      border-radius: 100%;
      z-index: 10000;
      transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform,
                  0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity;
      user-select: none;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(1);
    }
    .cursor.mouse-hovered {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0);
    }
    .cursor-follower {
      position: fixed;
      border: 0.5px solid #C57642;
      width: 35px;
      height: 35px;
      border-radius: 100%;
      z-index: 10000;
      transition: 0.6s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform,
                  0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity,
                  0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) background;
      user-select: none;
      pointer-events: none;
      transform: translate(-50%, -50%);
    }
    .cursor-follower.mouse-hovered {
      opacity: 1;
      transform: translate(-50%, -50%) scale(2);
      border: 0.5px solid rgba(236, 28, 36, 0.25);
      background-color: rgba(236, 28, 36, 0.05);
    }
    @media (max-width: 1199px) {
      .cursor, .cursor-follower { display: none; }
    }
  `]
})
export class CustomCursorComponent implements OnInit {
  cursorX = 0;
  cursorY = 0;
  followerX = 0;
  followerY = 0;
  isHovered = false;
  private targetX = 0;
  private targetY = 0;
  private animFrameId = 0;

  ngOnInit() {
    this.animate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
    this.targetX = e.clientX;
    this.targetY = e.clientY;
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
      this.isHovered = true;
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(e: MouseEvent) {
    this.isHovered = false;
  }

  private animate() {
    this.followerX += (this.targetX - this.followerX) * 0.15;
    this.followerY += (this.targetY - this.followerY) * 0.15;
    this.animFrameId = requestAnimationFrame(() => this.animate());
  }
}
