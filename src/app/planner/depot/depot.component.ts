import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DepotService } from '../../services/depot.service';


@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent implements OnInit {

  rows = [];
  temp = [];

  constructor(private depotService: DepotService, private router: Router) { }

  ngOnInit() {
    this.depotService.getAllDepots().then((response) => {
      this.rows = response;
      this.temp = [...this.rows];
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((data) => {
      return data.companyName.toLowerCase().indexOf(val) !== -1 || !val;
    });

   // update the rows
   this.rows = temp;

   }
  
   onEdit(clientId) {
    this.router.navigate(['/planner/client/create'], { queryParams: { companyId: clientId } });
  }
   
}
