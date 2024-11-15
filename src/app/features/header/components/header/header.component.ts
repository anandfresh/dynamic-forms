import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import {
  debounceTime,
  filter,
  map,
  takeUntil,
  tap,
  windowWhen,
} from 'rxjs/operators';
import { LanguageService } from 'src/app/features/language/language-data.service';
import { HeaderDesktopComponent } from '../header-desktop/header-desktop.component';
import { HeaderMobileComponent } from '../header-mobile/header-mobile.component';
import { LayoutService } from 'src/app/core/services/layout.service';
import { Subject, fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderDesktopComponent, HeaderMobileComponent],
  template: `
    <div
      [ngClass]="[
        'header-container',
        'p-3 px-7 lg:p-4 lg:pb-2',
        'duration-200',
        showBackground ? 'show-background' : '',
        openSettings ? 'full-background' : ''
      ]"
    >
      <ng-container *ngIf="links$ | async as links">
        <app-header-desktop [links]="links"></app-header-desktop>
        <app-header-mobile
          [links]="links"
          [openSettings]="openSettings"
          (settingsOpened)="openSettings = $event"
        ></app-header-mobile>
      </ng-container>
    </div>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private _el = inject(ElementRef);
  private _languageDataService = inject(LanguageService);
  private _layoutService = inject(LayoutService);
  private readonly _onDestroy$ = new Subject<void>();

  showBackground = false;
  openSettings = false;

  links$ = this._languageDataService.i18nContent$.pipe(
    filter((x) => Object.values(x).length > 0),
    map((x) => [
       {
        route: 'playground',
        label: `${x['MENU']['PLAYGROUND']}`,
      },
      {
        route: 'docs',
        label: `${x['MENU']['DOCS']}`,
      },
  
    ])
  );

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (typeof window === 'undefined') return;
    this.showBackground = window.scrollY > 0;
  }

  constructor() {
    this._layoutService.windowSize$
      .pipe(
        filter((x) => x.x >= 1024),
        tap(() => (this.openSettings = false))
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this._updateHeaderHeight();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  private _updateHeaderHeight(): void {
    const host = this._el.nativeElement as HTMLElement;
    if (!host) return;

    fromEvent(host, 'transitionend', { passive: true })
      .pipe(
        debounceTime(0),
        tap(() => this._layoutService.updateHeaderHeight()),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }
}
