import { DriverService } from './../../services/driver.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  numOfDrivers = 2;
  drivers = [];

  planningInfoGroup: FormGroup;
  DriverFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService
  ) { }

  ngOnInit() {
    this.driverService.getDrivers().then((response) => {
      response.drivers.forEach((driver) => {
        this.drivers.push(driver);
      });
    });

    this.planningInfoGroup = this.formBuilder.group({
      date: new FormControl(null, Validators.required),
      hour: new FormControl(null, Validators.required),
      minute: new FormControl(null, Validators.required),
      method: new FormControl('distance'),
    });
    this.DriverFormGroup = this.formBuilder.group({
      capacity: new FormControl(null, Validators.required)
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onSliderChange(e) {
    this.numOfDrivers = e.value;
  }

  onHourBlur(e) {
    if (e.target.valueAsNumber > 24) {
      this.planningInfoGroup.get('hour').setValue(24);
    }
  }

  onMinuteBlur(e) {
    if (e.target.valueAsNumber > 59) {
      this.planningInfoGroup.get('minute').setValue(59);
    }
  }

  dateFilter(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return date >= currentDate;
  }

  getErrorMessage() {
    if (this.planningInfoGroup.get('date').hasError('matDatepickerFilter')) {
      return 'You must select correct date';
    } else if (
        this.planningInfoGroup.get('date').hasError('required') ||
        this.planningInfoGroup.get('minute').hasError('required') ||
        this.planningInfoGroup.get('method').hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  test() {
    console.log(this.planningInfoGroup.value);
  }

}
