import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Pipe({
    name: 'secure'
})
export class SecurePipe implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    process(val: any): string {
        const sanitized = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)));
        if (sanitized) {
            return sanitized;
        }
        return '';
    }

    transform(url: any): Observable<string> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(val => this.process(val)));
    }

}

@Pipe({
    name: 'secure1'
})
export class SecurePipe1 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    process(val: any): string {
        const sanitized = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)));
        if (sanitized) {
            return sanitized;
        }
        return '';
    }

    transform(url: any): Observable<SafeUrl> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
    }

}

@Pipe({
    name: 'denul'
})
export class DenulPipe implements PipeTransform {

    constructor() { }

    transform(val?: any): string {
        console.log('|denul|',val);
        return val? val : ''
    }

}
