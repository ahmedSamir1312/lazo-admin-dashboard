import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { MapComponent } from '../map/map.component';
import { largepopup } from '../../../Shared/configration';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-registeration-data',
  standalone: true,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatExpansionModule,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './registeration-data.component.html',
  styleUrl: './registeration-data.component.scss',
  providers: [BsModalService],
})
export class RegisterationDataComponent {
  @Output() timeChanged = new EventEmitter<string>();
  @Output() registerEvent = new EventEmitter<string>();
  form!: FormGroup;
  public bsModalRef!: BsModalRef;
  submitted: boolean = false;
  environment = environment.files;
  iban_img: any = [];
  self_employment_document: any = [];
  commercial_register_image: any = [];
  deliveries: any = [
    { value: 0, name_en: 'no', name_ar: 'لا' },
    { value: 1, name_en: 'yes', name_ar: 'نعم' },
  ];
  businesses: any = [
    { value: 'cooperation', name_en: 'cooperation', name_ar: 'جمعية تعاونية' },
    { value: 'individual', name_en: 'individual', name_ar: 'فردي' },
  ];
  days: any = [
    { value: 7, name: 'Sunday' },
    { value: 1, name: 'Monday' },
    { value: 2, name: 'Tuesday' },
    { value: 3, name: 'Wednesday' },
    { value: 4, name: 'Thursday' },
    { value: 5, name: 'Friday' },
    { value: 6, name: 'Saturday' },
  ];
  stores: any = [
    { value: 0, name_en: 'no', name_ar: 'لا' },
    { value: 1, name_en: 'yes', name_ar: 'نعم' },
  ];

  showUploadFile: boolean = false;
  fileError: boolean = false;
  change_offline_store: boolean = false;
  lang: any = localStorage.getItem('lang');
  constructor(
    private formBuilder: FormBuilder,
    private service: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    // const wdays = this.days.map((control:any) => this.formBuilder.control(false));
    this.form = this.formBuilder.group({
      has_offline_stores: [1, Validators.required],
      offline_stores_number: [1, Validators.required],
      locations: this.formBuilder.array([]),
      provide_delivery: [null, Validators.required],
      business_type: [null, Validators.required],
      commercial_register_image: [null, Validators.required],
      self_employment_document: [null],
      days_hours: this.formBuilder.array([]), //: this.formBuilder.array(wdays),
      bank_name: [null, Validators.required],
      beneficiary_name: [null, Validators.required],
      bank_account_number: [null, Validators.required],
      iban: [null, Validators.required],
      iban_image: [null, Validators.required],
    });
    this.addLocation();

    for (let i = 0; i < 7; i++) {
      this.addWorkHours();
    }
  }

  //////////////days_hours///////////////

  workHours(): any {
    return this.form.get('days_hours') as FormArray;
  }

  newWorkHours(): FormGroup {
    return this.formBuilder.group({
      days: [false, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
    });
  }

  addWorkHours() {
    this.workHours().push(this.newWorkHours());
  }

  ///////////////locations//////////////////
  hasOffileStores(event: any) {
    if (event == 1) {
      //yes has offline stores
      this.f['offline_stores_number'].clearValidators();
      this.f['offline_stores_number'].addValidators(Validators.required);
      this.f['offline_stores_number'].updateValueAndValidity();

      if (this.change_offline_store == true) {
        this.locations().push(this.newLocation());
      }
    } else if (event == 0) {
      this.f['offline_stores_number'].clearValidators();
      this.f['offline_stores_number'].updateValueAndValidity();
      this.change_offline_store = true;

      this.form.patchValue({
        offline_stores_number: 0,
      });
      this.f['locations'] = this.formBuilder.array([]);

      delete this.form.value.locations;
      delete this.form.value.offline_stores_number;
    }
  }
  get locationsFormArray(): FormArray {
    if (!this.form) return this.formBuilder.array([]);
    const locations = this.form.get('locations');
    return locations && locations instanceof FormArray
      ? locations
      : this.formBuilder.array([]);
  }

  locations(): any {
    return this.form.get('locations') as FormArray;
  }

  newLocation(): FormGroup {
    return this.formBuilder.group({
      address: [null, Validators.required],
      lat_lng: [null, Validators.required],
    });
  }

  addLocation() {
    this.locations().push(this.newLocation());
  }

  addLocationLimit(event: any) {
    console.log('event', event.target.value);
    this.f['locations'].clearValidators();
    this.f['locations'].addValidators(Validators.maxLength(event.target.value));
    this.f['locations'].updateValueAndValidity();
  }

  removeLocation(index: number) {
    this.locations().removeAt(index);
  }
  openMap(index: number) {
    // If the location FormGroup at this index doesn't exist, add it
    while (this.locationsFormArray.length <= index) {
      this.addLocation();
    }

    const initialState: any = {
      backdrop: 'static',
      keyboard: false,
      initialState: { index },
    };

    this.bsModalRef = this.modalService.show(MapComponent, initialState);
    this.bsModalRef.setClass('modal-lg');

    this.bsModalRef.onHidden?.subscribe(() => {
      const res = this.bsModalRef.content?.result;
      if (res) {
        const locationControl = this.locationsFormArray.at(index);
        if (locationControl) {
          (locationControl as FormGroup).patchValue({
            address: res.location,
            lat_lng: `${res.long},${res.lat}`,
          });
        }
      }
    });
  }

  // openMap(index:any) {

  //   const initialState: any = {
  //     backdrop : 'static',
  //     keyboard : false ,
  //     initialState: {
  //       data: {title:'Pick Location',index:index}
  //      }
  //    }
  //    this.bsModalRef = this.modalService.show(MapComponent,initialState);
  //    this.bsModalRef.content.closeBtnName = 'Close';
  //    this.bsModalRef.setClass('modal-lg');

  //   this.bsModalRef.content.event.subscribe((res:any) => {
  //     console.log("map",res)

  //     this.f['locations']['controls'][index].patchValue({
  //       address:res?.location,
  //       lat_lng:res?.long+','+res?.lat
  //      })

  //      console.log("map map map map ",this.f['locations']['controls'][index])

  //  })
  // }

  ///////////////Register Type//////////////////

  changeBusinessType(event: any) {
    // console.log("event",event)
    if (event == 'cooperation') {
      this.f['commercial_register_image'].clearValidators();
      this.f['commercial_register_image'].addValidators(Validators.required);
      this.f['commercial_register_image'].updateValueAndValidity();

      this.f['self_employment_document'].clearValidators();
      this.f['self_employment_document'].updateValueAndValidity();

      delete this.form.value.self_employment_document;
    } else if (event == 'individual') {
      this.f['commercial_register_image'].clearValidators();
      this.f['commercial_register_image'].updateValueAndValidity();

      delete this.form.value.commercial_register_image;
    }
  }

  onCommercialRegisterChange(event: any) {
    if (event.target.files[0]?.size <= 600000) {
      if (event.target.files[0].name.split('.').pop() != 'pdf') {
        this.commercial_register_image = [];

        this.commercial_register_image.push(event.target.files[0]);
        this.spinner.show();

        this.service.uploadFiles(this.commercial_register_image).subscribe(
          (res: any) => {
            if (res.status == true) {
              this.toastr.success(res.message, 'success');
              this.form.patchValue({
                commercial_register_image: res['data'][0],
              });
              // console.log("commercial_register_image",  this.form.value.registeration_data)
            } else {
              this.spinner.hide();
              this.toastr.error(res?.errors[0], 'error');
            }
          },
          (err: any) => {
            this.spinner.hide();
            this.toastr.error(err.error.errors[0], 'error');
          }
        );
      } else {
        this.spinner.hide();
        this.toastr.error('you should upload image', 'error');
      }
    } else {
      this.spinner.hide();
      this.toastr.error('File size must be less than 600KB', 'error');
    }
  }

  onSelfEmpDocChange(event: any) {
    if (event.target.files[0]?.size <= 600000) {
      if (event.target.files[0].name.split('.').pop() != 'pdf') {
        this.self_employment_document = [];
        this.self_employment_document.push(event.target.files[0]);
        this.spinner.show();

        this.service.uploadFiles(this.self_employment_document).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status == true) {
              this.toastr.success(res.message, 'success');
              this.form.patchValue({
                self_employment_document: res['data'][0],
              });
              // console.log(" self_employment_document",  this.form.value.registeration_data)
            } else {
              this.spinner.hide();
              this.toastr.error(res?.errors[0], 'error');
            }
          },
          (err: any) => {
            this.spinner.hide();
            this.toastr.error(err.error.errors[0], 'error');
          }
        );
      } else {
        this.spinner.hide();
        this.toastr.error('you should upload image', 'error');
      }
    } else {
      this.spinner.hide();
      this.toastr.error('File size must be less than 600KB', 'error');
    }
  }

  ///////////////Bank Details//////////////////

  iban_image_type: any;
  onIbanChange(event: any) {
    if (event.target.files[0]?.size <= 600000) {
      this.iban_image_type = event.target.files[0].name.split('.').pop();
      // console.log("name",event.target.files[0].name.split('.').pop())
      this.iban_img = [];
      this.iban_img.push(event.target.files[0]);
      this.spinner.show();

      this.service.uploadFiles(this.iban_img).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.status == true) {
            this.toastr.success(res.message, 'success');
            this.form.patchValue({
              iban_image: res['data'][0],
            });
            // console.log(" iban_image",  this.form.value.registeration_data)
          } else {
            this.spinner.hide();
            this.toastr.error(res?.errors[0], 'error');
          }
        },
        (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.errors[0], 'error');
        }
      );
    } else {
      this.spinner.hide();
      this.toastr.error('File size must be less than 600KB', 'error');
    }
  }

  /////////////////////////////////////////

  get f(): any {
    return this.form.controls;
  }

  selected: any = [];

  sendRegisterationForm() {
    this.submitted = true;
    console.log('form value', this.form.value);

    this.selected = this.form.value.days_hours.filter(
      (element: any, index: any) => {
        if (
          element?.days != false &&
          element?.start_time != null &&
          element?.end_time != null
        ) {
          element.days = this.days[index].value;
          return element;
        }
      }
    );

    this.form.value.working_days_indices = this.selected.map(
      (element: any, index: any) => {
        return element.days == 7 ? 0 : element.days;
      }
    );

    this.form.value.working_hours = this.selected.map(
      (element: any, index: any) => {
        return element.start_time + ',' + element.end_time;
      }
    );

    console.log('selected', this.selected);
    if (this.selected.length != 0) {
      console.log('register form ', this.form.value);
      this.registerEvent.emit(this.form.value);
    }
  }

  startTimeChanges(event: any, index: any) {
    timer(1000).subscribe((res: any) => {
      let beginningTime = moment(
        this.f['days_hours']['controls'][index]['controls']['start_time'].value,
        'HH:mm a'
      ); //h:mma
      let endTime = moment(
        this.f['days_hours']['controls'][index]['controls']['end_time'].value,
        'HH:mm a'
      );

      if (
        beginningTime.isBefore(endTime) == true &&
        this.f['days_hours']['controls'][index]['controls']['end_time'].value !=
          null
      ) {
        //&& (this.f['days_hours']['controls'][index]['controls']['end_time'].value!=null)
        let child = <HTMLElement>document.getElementById('h' + index);
        child.innerHTML = '';
        let parent: any = <HTMLElement>(
          document.getElementById('parent' + index)
        );
        parent.classList.remove('days_error');
        //  console.log("1",this.f['days_hours']['controls'][index]['controls']['start_time'].value , this.f['days_hours']['controls'][index]['controls']['end_time'].value,beginningTime.isBefore(endTime))
      } else {
        //  console.log("2" ,this.f['days_hours']['controls'][index]['controls']['start_time'].value,this.f['days_hours']['controls'][index]['controls']['end_time'].value,beginningTime.isBefore(endTime))
        if (
          this.f['days_hours']['controls'][index]['controls']['start_time']
            .value != null &&
          this.f['days_hours']['controls'][index]['controls']['end_time']
            .value != null
        ) {
          let child = <HTMLElement>document.getElementById('h' + index);
          child.innerHTML = '*Start time must be less than end time';
          let parent: any = <HTMLElement>(
            document.getElementById('parent' + index)
          );
          parent.classList.add('days_error');
        }
      }
    });
  }
}
