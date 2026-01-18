import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchValue: string): any {
    if (!searchValue) return value;
    return value.filter(
      (v: any) =>
        v?.name?.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        v?.owner_name?.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        v?.sender?.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        v?.number?.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    );
  }
}
