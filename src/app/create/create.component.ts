import { CustomerService } from './../services/customer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../shared/customer';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  customerForm: FormGroup;
  @ViewChild('cform') customerFormDirective;
  customer: Customer;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': ''
  };

  validationMessages = {
      'firstname': {
      'required':      'First Name is required.'
    },
    'lastname': {
      'required':      'Last Name is required.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  constructor(private fb: FormBuilder, private customerService: CustomerService,
    public dialogRef: MatDialogRef <CreateComponent>, private snackBar: MatSnackBar) {
    this.createForm();
  }
  createForm() {
    this.customerForm = this.fb.group({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      gender: new FormControl('male'),
      email: new FormControl('', [Validators.email, Validators.required]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      ordertotal: new FormControl('')
    });
    this.customerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.customerForm) { return; }
    const form = this.customerForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.customer = this.customerForm.value;
    this.customerService.postCustomer(this.customer)
      .subscribe(data => {
        this.customer = data; });
    console.log(this.customer);
    this.customerFormDirective.resetForm();
    this.customerForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      gender: 'male',
      address: '',
      state: '',
      city: '',
      ordertotal: ''
    });
    this.snackBar.open('New customer has been added successfully', '', {
      duration: 2000,
   });
  }
  ngOnInit() {
  }
  onClear() {
    this.customerFormDirective.resetForm();
    this.customerForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      gender: 'male',
      address: '',
      state: '',
      city: '',
      ordertotal: ''
    });
  }
  onClose() {
    this.customerFormDirective.resetForm();
    this.customerForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      gender: 'male',
      address: '',
      state: '',
      city: '',
      ordertotal: ''
    });
    this.dialogRef.close();
  }
}
