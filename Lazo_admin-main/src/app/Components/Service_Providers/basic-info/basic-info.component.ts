import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../services/app.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent {
  environment = environment.files;
  submitted: boolean = false;
  cover_uploded_img: any = [];
  cover_images: any[] = [];
  image_exist: boolean = false;
  accountType = 'service_provider';
  images: any[] = [];
  uploded_img: any = [];
  imagesUploaded: boolean = false;
  form!: FormGroup;
  tags: any;
  cities: any;
  password: boolean = false;
  confirm_password: boolean = false;
  @Output() basicEvent = new EventEmitter<string>();
  types: any = [
    {
      value: 'service_provider',
      name_en: 'service provider',
      name_ar: 'مقدم الخدمة',
    },
    {
      value: 'packaging_provider',
      name_en: 'packaging provider',
      name_ar: 'مزود التعبئة والتغليف',
    },
  ];
  imageSize: any;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cityList();
    this.tagList();
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      image: [null, Validators.required],
      cover_image: [null, Validators.required],
      name_en: [
        null,
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)],
      ],
      name_ar: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FF\s]+$/)],
      ],
      owner_name: [null, Validators.required],
      city_id: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('^5[0-9]{8}$')]],
      email: [null, Validators.required],
      tags_ids: [null, [Validators.required, Validators.maxLength(6)]],
      account_type: [null, Validators.required],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],
      confirm_password: [null, Validators.required],
      bio_en: [
        null,
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)],
      ],
      bio_ar: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FF\s]+$/)],
      ],
    });

    this.handleAccountTypeChange();
  }
  handleAccountTypeChange(): void {
    this.form.get('account_type')?.valueChanges.subscribe((type) => {
      const bioEn = this.form.get('bio_en');
      const bioAr = this.form.get('bio_ar');
      const tags = this.form.get('tags_ids');

      if (type !== 'service_provider') {
        // Remove validators
        bioEn?.clearValidators();
        bioAr?.clearValidators();
        tags?.clearValidators();
      } else {
        // Restore original validators
        bioEn?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\s]+$/),
        ]);

        bioAr?.setValidators([
          Validators.required,
          Validators.pattern(/^[\u0600-\u06FF\s]+$/),
        ]);

        tags?.setValidators([Validators.required, Validators.maxLength(6)]);
      }

      bioEn?.updateValueAndValidity();
      bioAr?.updateValueAndValidity();
      tags?.updateValueAndValidity();
    });
  }

  get f(): any {
    return this.form.controls;
  }
  onAccountTypeChange(event: any) {
    console.log(event, 'account type');
    this.accountType = event;
  }
  onProfileCoverChange(event: any) {
    if (event.target.files[0]?.size <= 600000) {
      this.cover_uploded_img = [];
      this.cover_uploded_img.push(event.target.files[0]);
      console.log(this.cover_uploded_img);

      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            this.cover_images = [];

            this.cover_images.push(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      }
      this.spinner.show();

      this.service.uploadFiles(this.cover_uploded_img).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('cover_image', res['data'][0]);
          this.cover_images.push(this.environment + res['data'][0]);

          if (res.status == true) {
            this.toastr.success(res.message, 'success');
            this.form.patchValue({
              cover_image: res['data'][0],
            });
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
      this.toastr.error('Image size must be less than 600KB', 'error');
    }
  }
  cityList() {
    this.service.allCities().subscribe((res: any) => {
      this.cities = res['data'];
    });
  }

  tagList() {
    this.service.allTags().subscribe((res: any) => {
      this.tags = res['data'];
    });
  }
  sendBasicForm() {
    this.submitted = true;
    // this.basicEvent.emit(this.form.value);
    if (
      this.form.valid &&
      this.f.confirm_password.value == this.f.password.value
    ) {
      this.basicEvent.emit(this.form.value);
    } else {
      console.log('form', this.form.value);
      return;
    }
  }
  onProfileChange(event: any) {
    this.image_exist = true;
    this.uploded_img = [];
    if (event && event.target.files[0]?.size <= 600000) {
      this.imageSize = Math.round(event.target.files[0].size / 1024) + ' KB';
      this.uploded_img.push(event.target.files[0]);
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          // this.imagePath.push(...event.target.files)     imagePath :File[]= [];
          reader.onload = (event: any) => {
            this.images.push(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      }

      this.spinner.show();
      this.service.uploadFiles(this.uploded_img).subscribe(
        (res: any) => {
          this.images.push(this.environment + res['data'][0]);
          this.spinner.hide();
          if (res.status == true) {
            this.toastr.success(res.message, 'success');
            this.form.patchValue({
              image: res['data'][0],
            });
            console.log(this.images, 'momen');
            this.imagesUploaded = true;
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
    } else if (event.target.files[0]?.size > 600000) {
      this.toastr.error('Image size must be less than 600KB', 'error');
    }
  }
}
