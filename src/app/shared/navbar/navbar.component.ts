import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { QueryService } from 'src/app/services/query.service';
import { User } from 'src/app/models/Users.model';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

    user: User;

    constructor(public sidebarservice: SidebarService, private queryService: QueryService) {
        this.loadUserData();
    }

    async loadUserData() {
        this.user = await this.queryService.getAccountInfo();
    }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }

    ngOnInit() {

        /* Search Bar */
        $(document).ready(function () {
            $(".mobile-search-icon").on("click", function () {
                $(".search-bar").addClass("full-search-bar")
            }),
                $(".search-close").on("click", function () {
                    $(".search-bar").removeClass("full-search-bar")
                })
        });

    }
}
