import { computed, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  breakpointObserver = inject(BreakpointObserver);

  sideNavOpened = signal(true);
  mode = signal<'mobile' | 'desktop'>('desktop');
  sidenavMode = computed(() => this.mode() === 'mobile' ? 'over' : 'side');
  sidenavContent = signal([
    {
      title: 'Flight Tracker',
      children: [
        {
          title: 'Dashboard',
          icon: 'home',
          link: '/dashboard'
        },
        {
          title: 'Tickets',
          icon: 'airplane_ticket',
          link: '/dashboard/tickets'
        }
      ]
    }
  ])

  toggleSideNav() {
    this.sideNavOpened.set(!this.sideNavOpened());
  }

  setSidenav(value: boolean) {
    this.sideNavOpened.set(value);
  }

  constructor() {
    // detect screen size changes
    this.breakpointObserver.observe([
      '(max-width: 768px)'
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.mode.set('mobile');
      } else {
        this.mode.set('desktop');
      }
    });
  }


}
