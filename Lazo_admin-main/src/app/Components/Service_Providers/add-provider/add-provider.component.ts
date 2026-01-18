import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SocialInfoComponent } from '../social-info/social-info.component';
import { RegisterationDataComponent } from '../registeration-data/registeration-data.component';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    BasicInfoComponent,
    CommonModule,
    MatIconModule,
    SocialInfoComponent,
    RegisterationDataComponent,
  ],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.scss',
})
export class AddProviderComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  form!: FormGroup;
  stepIndex = 0;
  submitted: boolean = false;
  isLinear: boolean = false;
  baiscInfo: any = {};
  registerInfo: any = {};
  socialInfo: any = {};
  constructor(
    private provider: AppService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) {}
  getIndex() {
    this.stepIndex = this.stepper.selectedIndex + 1;
  }
  receiveBasicEvent(baiscInfo: any) {
    this.baiscInfo = baiscInfo;
    console.log('baiscInfo', this.baiscInfo);
    this.stepper.next();
  }

  receiveSocialEvent(socialInfo: any) {
    this.socialInfo = socialInfo;
    console.log('socialInfo', this.socialInfo);
    this.stepper.next();
  }
  receiveRegisterationEvent(registerInfo: any) {
    this.registerInfo = registerInfo;
    let form = {
      ...this.baiscInfo,
      ...this.socialInfo,
      ...this.registerInfo,
    };
    console.log('form', this.baiscInfo);
    this.provider.add(form).subscribe(
      (res: any) => {
        console.log('res', res);
        if (res.status) {
          this.toastr.success('', res.message, {
            closeButton: true,
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
          this.location.back();
        } else {
        }
      },
      (err: any) => {
        console.log('err', err);
        this.toastr.error('', err.error.message, {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
}
