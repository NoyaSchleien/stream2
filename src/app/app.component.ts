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
  sourceBuffer: SourceBuffer;
  errorMessage: string;
  mediaSource: MediaSource;

  @ViewChild("myVideo") myVideo: HTMLVideoElement;
  constructor(private _appService: AppService) { }
 
  onChange(e) {
    if (e.target.checked) {
      this.checked = true;

      this.mediaSource = new MediaSource();
      console.log("media source = " + this.mediaSource);
      console.log("media source ready state = " + this.mediaSource.readyState);
      // this.myVideo['nativeElement'].src = URL.createObjectURL(this.mediaSource);
      this.mediaSource.addEventListener('sourceOpen', this.sourceOpen);

    } else {
    this.checked = false;
    this.myVideo['nativeElement'].pause();
  }
}
  sourceOpen(){
    console.log("mediaSource should be open now, ready state = " + this.mediaSource.readyState )
    console.log("media source after open event = " + this.mediaSource);
    try {
      this.sourceBuffer = this.mediaSource.addSourceBuffer('application/octet-stream');
    }
    catch (e) {
      console.log('Exception calling addSourceBuffer for video', e);
      return;
    }
    this.getStream();
  }
  getStream(){
  // console.log("URL = " + this.myVideo['nativeElement'].src)

  this._appService.getStream()
  .subscribe(stream => {
    this.stream = new Blob([stream.blob], { type: 'application/octet-stream' });
    console.log(this.stream);
    this.sourceBuffer.addEventListener('updateEnd', this.updateEnd);
    try {
      this.sourceBuffer.appendBuffer(new Uint8Array(this.stream));
      // this.sourceBuffer= this.mediaSource.addSourceBuffer(new Uint8Array());       
      // this.sourceBuffer=this.stream;
      // this.sourceBuffer = this.myVideo['nativeElement'].addSourceBuffer('Uint8Array');
      // this.sourceBuffer.appendBuffer(new Uint8Array(this.stream));
    } catch (e) {
      console.log('Exception while appending', e);
    }
  },
  error => this.errorMessage = <any>error
);
}  

updateEnd(){
  this.mediaSource.endOfStream();
  console.log("mediasource state should be ended = " + this.mediaSource.readyState);
  this.myVideo['nativeElement'].play();
  }

}