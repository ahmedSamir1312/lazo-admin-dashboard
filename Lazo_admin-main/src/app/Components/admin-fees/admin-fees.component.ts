import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-fees',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './admin-fees.component.html',
  styleUrl: './admin-fees.component.scss'
})

export class AdminFeesComponent implements OnInit {
  form!:FormGroup;
  constructor(private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    this.form= this.formBuilder.group({
      shipping_fee:[null,Validators.required],
      base_fee:[null,Validators.required],
      additional_fee:[null,Validators.required]
    })
  }

  get f():any {
    return this.form.controls;
  }

  save() {

  }
}
