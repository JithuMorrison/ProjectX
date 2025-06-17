import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  pure: false,
})
export class StatusPipe implements PipeTransform {
  transform(names: string): string {
    return names.toLowerCase();
  }
}
