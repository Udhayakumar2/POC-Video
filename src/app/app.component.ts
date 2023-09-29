import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'video_ui';
  showForm = false;
  closed = true;
  @ViewChild('main_video') video_tag!: ElementRef;
  private unlistener!: () => void;
  public personalDetails!:FormGroup;
  public currentTime: any;

  constructor(
    private renderer2: Renderer2,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.personalDetails = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
   }

  ngAfterViewInit() {
    const timeToStop = 10;
    this.unlistener = this.renderer2.listen(this.video_tag?.nativeElement, "timeupdate", (event) => {
      this.currentTime = this.video_tag?.nativeElement?.currentTime;
      if (this.currentTime >= timeToStop && this.closed) {
        this.showForm = true;
      } else {
        this.showForm = false;
      }
    });
  }

  ngOnDestroy() {
    this.unlistener();
  }

  sendForm() {
    if (this.personalDetails.invalid) {
      this.toastr.error("Fill all the fields")
      return;
    }
    const data = this.personalDetails.value;
    this.appService.sendForm(data).subscribe({
      next: (res) => {
        console.log("Form sent to Backend", res);
        this.personalDetails.reset();
        this.toastr.success("Form submitted successfully");
        this.closeIcon();
      },
      error: (err) => {
        console.log("Error occured while sending the form", err);
        this.toastr.error("Form submition failed");
      }
    })
  }
  openForm(){
    this.showForm = true;
    this.closed = true;
  }

  closeIcon(){
    this.showForm = false;
    this.closed = false;
  }

}
