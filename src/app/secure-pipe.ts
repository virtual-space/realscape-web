import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { from, map, Observable, of, switchMap } from 'rxjs';

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
    name: 'secure2'
})
export class SecurePipe2 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    /*
    transform(url: any): Observable<SafeUrl> {
        return this.http.get(url, {responseType: 'blob'}).pipe(
            switchMap(response => response.text()),
            map(response => this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + response)));
    }
    */

    process(type: string | null, blob: Blob | null): Observable<string> {
        if (type && blob) {
            return from(blob.text()).pipe(
                map(res => 'data:' + type + ';base64,' + res)
            );
        } else {
            return of('');
        }
    }

    transform(url: any): Observable<SafeUrl> {
        return this.http.get(url, {responseType: 'blob', observe: 'response'}).pipe(
            switchMap(response => this.process(response.headers.get('Content-Type'), response.body)),
            map(response => this.sanitizer.bypassSecurityTrustUrl(response)));
    }

}

@Pipe({
    name: 'secure3'
})
export class SecurePipe3 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    process(val: Blob): Observable<ArrayBuffer> {
        return from(val.text()).pipe(
            map(res => {
                const binary_string = window.atob(res);
                const len = binary_string.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
            })
        )
        
        //return from(val.text()arrayBuffer());
    }

    transform(url: any): Observable<ArrayBuffer> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            switchMap(val => this.process(val)));
    }

}

@Pipe({
    name: 'secure4'
})
export class SecurePipe4 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    process(val: Blob): Observable<string> {
        return from(val.text()).pipe(
            map(res => {
                //return window.atob(res).replace(/\n/g, "<br />");
                return res.replace(/\n/g, "<br />");
            })
        )
        
        //return from(val.text()arrayBuffer());
    }

    transform(url: any): Observable<string> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            switchMap(val => this.process(val)));
    }

}

@Pipe({
    name: 'secure5'
})
export class SecurePipe5 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    process(val: Blob): Observable<string> {
        return from(val.text()).pipe(
            map(res => {
                return res;
            })
        )
        
        //return from(val.text()arrayBuffer());
    }

    transform(url: any): Observable<string> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            switchMap(val => this.process(val)));
    }

}

@Pipe({
    name: 'secure6'
})
export class SecurePipe6 implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    /*
    transform(url: any): Observable<SafeUrl> {
        return this.http.get(url, {responseType: 'blob'}).pipe(
            switchMap(response => response.text()),
            map(response => this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + response)));
    }
    */

    process(val: Blob): Observable<ArrayBuffer> {
        //console.log(val);
        return from(val.text()).pipe(
            map((res:string) => {
                const res_decoded = atob(res);
                var buf = new ArrayBuffer(res_decoded.length); // 2 bytes for each char
                var bufView = new Uint8Array(buf);
                for (var i=0, strLen=res_decoded.length; i < strLen; i++) {
                    bufView[i] = res_decoded.charCodeAt(i);
                }
                return buf;
            })
        );
    }

    transform(url: any): Observable<ArrayBuffer> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            switchMap(val => this.process(val)));
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
