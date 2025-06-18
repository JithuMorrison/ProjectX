import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'status',
  pure: false,
})
export class StatusPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(status: string): SafeHtml {
    let coloredStatus = '';

    switch (status.toLowerCase()) {
      case 'started':
        coloredStatus = `<span style="color: green;">${status}</span>`;
        break;
      case 'working':
        coloredStatus = `<span style="color: orange;">${status}</span>`;
        break;
      case 'pending':
        coloredStatus = `<span style="color: red;">${status}</span>`;
        break;
      default:
        coloredStatus = `<span style="color: gray;">${status}</span>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(coloredStatus);
  }
}
