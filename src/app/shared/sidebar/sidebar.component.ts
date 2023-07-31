import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "./sidebar.service";

import * as $ from 'jquery';
import { QueryService } from 'src/app/services/query.service';
import { User } from 'src/app/models/Users.model';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {

    public menuItems: any[];


    constructor(public sidebarservice: SidebarService, private queryService: QueryService, private router: Router) {

        router.events.subscribe((event: Event) => {

            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd && $(window).width() < 1025 && (document.readyState == 'complete' || false)) {

                this.toggleSidebar();
                // Hide loading indicator

            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });

    }


    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());

        if ($(".wrapper").hasClass("nav-collapsed")) {
            // unpin sidebar when hovered
            $(".wrapper").removeClass("nav-collapsed");
            $(".sidebar-wrapper").unbind("hover");
        } else {
            $(".wrapper").addClass("nav-collapsed");
            $(".sidebar-wrapper").hover(
                function () {
                    $(".wrapper").addClass("sidebar-hovered");
                },
                function () {
                    $(".wrapper").removeClass("sidebar-hovered");
                }
            )

        }

    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }


    ngOnInit() {
        this.queryService.onUpdateUserData().subscribe(resp => {
            this.initMenu();
        })
        this.initMenu();
        $.getScript('./assets/js/app-sidebar.js');
    }

    private async initMenu() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        let patients = (await this.queryService.getAccountInfo())?.patients;
        if (!patients) {
            return;
        }
        this.menuItems = this.menuItems.map(item => {
            if (item.title == 'Dashboard') {
                item.submenu = [];
                if (patients.length) {
                    patients.forEach((p:User) => {
                        let path = { path: `/dashboard/user-data/${p.id}`, title: `${p.name} ${p.last_name}`, icon: 'bx bx-right-arrow-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] };
                        item.submenu.push(path);
                    })
                }
                // { path: '/dashboard/user-data', title: 'Daniel Perez', icon: 'bx bx-right-arrow-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            }
            return item;
        });
        this.menuItems = [...this.menuItems];
    }

    closeSession(){
        this.queryService.closeSession();
    }

}
