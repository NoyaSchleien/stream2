import { Component, ViewChild } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  checked: boolean = false;
  stream: any;
  videoSource:SourceBuffer;
  errorMessage: string;
  mediaSource:MediaSource;

  @ViewChild("myVideo") myVideo: HTMLVideoElement;
// @ViewChild("mediaSource") mediaSource:MediaSource;
  constructor(private _appService: AppService) { }
  ngOnInit(){
this.mediaSource=new MediaSource();
this.videoSource = this.mediaSource.addSourceBuffer('application/octet-stream');
  }
  onChange(e) {
    if (e.target.checked) {
      this.checked = true;
      this._appService.getStream()
      .subscribe(stream => {
        this.stream = stream;
        console.log(this.stream);
        try {
        // this.videoSource = this.myVideo['nativeElement'].addSourceBuffer('Uint8Array');
          this.videoSource.appendBuffer(new Uint8Array(this.stream));
          this.myVideo['nativeElement'].play();
      } catch (e) {
          console.log('Exception while appending', e);
      }
      },
      error => this.errorMessage = <any>error
    );
  } else {
    this.checked = false;
    this.myVideo['nativeElement'].pause();
    }
}
}