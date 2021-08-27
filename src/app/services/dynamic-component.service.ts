import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  //private compRef: ComponentRef<any>;

  constructor(private injector: Injector,
              private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef) { }


  public injectComponent<T>(component: Type<T>, propertySetter?: (type: T) => void): HTMLDivElement {
    // Remove the Component if it Already Exists
    /*if (this.compRef) {
      this.compRef.destroy();
    }*/

    // Resolve the Component and Create
    const compFactory = this.resolver.resolveComponentFactory(component);
    const compRef = compFactory.create(this.injector);

    // Allow a Property Setter to be Passed in (To Set a Model Property, etc)
    if (propertySetter) {
      propertySetter(compRef.instance);
    }

    // Attach to Application
    this.appRef.attachView(compRef.hostView);

    // Create Wrapper Div and Inject Html
    const div = document.createElement('div');
    //console.log(compRef.location.nativeElement)
    div.appendChild(compRef.location.nativeElement);

    // Return the Rendered DOM Element
    return div;
  }
}
