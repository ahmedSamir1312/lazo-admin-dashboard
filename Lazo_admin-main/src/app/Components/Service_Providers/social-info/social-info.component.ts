import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-social-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './social-info.component.html',
  styleUrl: './social-info.component.scss',
})
export class SocialInfoComponent {
  @Output() socialEvent = new EventEmitter<string>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      instagram_link: [
        null,
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ],
      snapchat_link: [null],
      tiktok_link: [
        null,
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ],
      x_link: [
        null,
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ],
    });
  }

  get f(): any {
    return this.form.controls;
  }

  sendSocialForm() {
    console.log('form', this.form.value);
    if (this.form.valid) {
      this.socialEvent.emit(this.form.value);
    } else {
      console.log('social form invalid');
      return;
    }
  }
}
