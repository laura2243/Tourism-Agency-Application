import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(dateString: string): string {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      return 'Invalid date';
    }
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const day = parseInt(parts[0], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString(); // Change format if needed
  }
}
