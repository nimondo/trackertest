import { Component } from '@angular/core';

import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
    // User Status
    isLoggedIn!: boolean;
    role!: string;
    constructor(private authService : AuthService){

    }

    ngOnInit(): void {
      this.isLoggedIn = !!this.authService.getToken();
      this.role = this.authService.getRole();
      this.setupMobileNav();
    }

  //Method to
  getUserName() {
    return this.authService.getUser();
  }
    //Method to logout
    signOut() {
      this.authService.signOut();
    }
    setupMobileNav(): void {
      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle') as HTMLElement;
  
      const mobileNavToogle = () => {
        document.querySelector('body')!.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      };
  
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  
      // Hide mobile nav on same-page/hash links
      // document.querySelectorAll('#navmenu a').forEach(navmenu => {
      //   navmenu.addEventListener('click', () => {
          
      //     if (document.querySelector('body')!.classList.contains('mobile-nav-active')) {
      //       console.log("je suis ici")
      //       document.querySelector('body')!.classList.remove('mobile-nav-active');
      //       mobileNavToggleBtn.classList.add('bi-list');
      //       mobileNavToggleBtn.classList.remove('bi-x');
      //     }
      //   });
      // });
      document.querySelectorAll('#navmenu a').forEach(navLink => {
        navLink.addEventListener('click', () => {
          const bodyElement = document.querySelector('body');
          console.log("here")
          const isMobileNavActive = bodyElement?.classList.contains('mobile-nav-active');
          
          if (isMobileNavActive) {
            mobileNavToogle();
          }
        });
      });
  
      // Toggle mobile nav dropdowns
      document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', (e) => {
          e.preventDefault();
          
          const parentElement = (e.target as HTMLElement).parentNode as HTMLElement;
          parentElement.classList.toggle('active');
          
          const siblingElement = parentElement.nextElementSibling as HTMLElement;
          siblingElement.classList.toggle('dropdown-active');
          
          e.stopImmediatePropagation();
        });
      });
    }
    hideMenu(){
      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle') as HTMLElement;
      document.querySelector('body')!.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
    }
}
