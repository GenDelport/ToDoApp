import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  //removed depricated HttpClientTestingModule  in imports to provideHttpClientTesting()
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve weather forecasts from the server', () => {
    const mockForecasts = [
      { date: '2021-10-01', temperatureC: 20, temperatureF: 68, summary: 'Mild' },
      { date: '2021-10-02', temperatureC: 25, temperatureF: 77, summary: 'Warm' }
    ];

    //const mockToDoTasks = [
    //  { id: 1, title: 'test', status: "NotStarted", description: "TEst", member: 'Cloete' },
    //  { id: 2, title: 'test1', status: "InProgress", description: "sdawda", member: 'Cloete2' }
    //];
    component.ngOnInit();

    const req2 = httpMock.expectOne('/tasks')
    //const req = httpMock.expectOne('/weatherforecast');
    expect(req2.request.method).toEqual('GET');
    //req2.flush(mockToDoTasks);
    //expect(req.request.method).toEqual('GET');
    //req.flush(mockForecasts);

    expect(component.forecasts).toEqual(mockForecasts);
    //expect(component.tasks).toEqual(mockToDoTasks);
  });
});
