import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromDate = control.get('from_date')?.value;
    const toDate = control.get('to_date')?.value;

    if (!fromDate || !toDate) {
      return null; // Don't validate if either date is missing
    }

    // Convert date strings to Date objects
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    return fromDateObj > toDateObj ? { dateRangeInvalid: true } : null;
  };
}
