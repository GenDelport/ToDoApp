import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,

  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email() {
    return this.signupForm.get('email')!;
  }

  get password() {
    return this.signupForm.get('password')!;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('User signed up:', response);
          // Save the token
          localStorage.setItem('token', response.token);
          // Redirect to todo-list or wherever appropriate
          this.router.navigate(['/todo-list']);
        },
        error: (err) => {
          console.error('Signup failed:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
