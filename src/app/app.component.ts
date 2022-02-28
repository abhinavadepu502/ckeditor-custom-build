import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import * as Editor from '../ckCustomBuild/build/ckeditor';
import * as Editor from './../ckCustomBuild/build/ckeditor'
import { CropperPosition, ImageCroppedEvent } from 'ngx-image-cropper';
import { customAdapterPlugin } from './ckB64Adapter';
import { PublishService } from './services/publish.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  metaForm!: FormGroup;
  imageForm!: FormGroup;
  Editor = Editor;//ClassicEditor;
  imgChangeEvt: any = '';
  finalPayload: any = {};
  imageBase64: any;
  imageList = [
    {
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF7oiJMqjJUHyLvZLqbLkq0k6c1tuDhW8t4g&usqp=CAU',
      label: 'Image 1'
    },
    {
      imageUrl: 'https://thumbs.dreamstime.com/b/floral-wallpaper-style-composition-imaginary-exotic-flowers-leafs-linked-together-90066839.jpg',
      label: 'Image 2'
    },
    {
      imageUrl: 'https://thumbs.dreamstime.com/b/vintage-floral-wallpaper-patterns-102883736.jpg',
      label: 'Image 3'
    }
  ]
  config = {
    toolbar: {
      items: [
        'heading', '|',
        'fontfamily', 'fontsize',
        'alignment',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
        'link', '|',
        'outdent', 'indent', '|',
        'bulletedList', '-', 'numberedList', 'todoList', '|',
        'code', 'codeBlock', '|',
        'insertTable', '|',
        'imageUpload', 'blockQuote', '|',
        'todoList'
        ,
        'undo', 'redo',
      ],
      shouldNotGroupWhenFull: true,

    },
    image: {
      styles: [
        'alignLeft', 'alignCenter', 'alignRight'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:50',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        '|',
        'ImageResize',
        // '|',
        'imageTextAlternative',
        // 'imageStyle:wrapText',
        // // Custom drop-down
        // {
        //   name: 'imageStyle:customDropdown',
        //   title: 'customImageAlign',
        //   items: ['imageStyle:alignLeft', 'imageStyle:alignRight'],
        //   defaultItem: 'imageStyle:alignLeft'
        // }
      ]
    },
    extraPlugins  : [customAdapterPlugin],
    language: 'en'
  };
  cropper: CropperPosition = {
    x1: 0,
    y1: 0,
    x2: 240,
    y2: 240
  }
  // currentImageLimit =
  onReady(editor: any) {
    if (editor.model.schema.isRegistered('image')) {
      editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
    }
  }
  constructor(private _formBuilder: FormBuilder, private _publishService: PublishService) {
  }

  ngOnInit() {
    this.metaForm = this._formBuilder.group({
      firstDropdown: ['', Validators.required],
      secondDropdown: ['', Validators.required],
      description: ['', Validators.required],
      publishDate: ['', Validators.required],
      template: ['<p>Your Content Here!</p>', Validators.required]
    });
    this.imageForm = this._formBuilder.group({
      image: ['', Validators.required],
    });
  }

  onFileChange(event: any): void {
    this.imgChangeEvt = { target: { files: [event.target.files[0]] } };

    // this.blobToBase64(event.target.files[0])
  }

  cropImg(e: ImageCroppedEvent) {
    this.imageForm.controls["image"].setValue(e.base64)
  }

  complete() {
    let payload = this.finalPayload = Object.assign({}, this.metaForm.value, this.imageForm.value);
    this._publishService.submitMeta(payload).subscribe(resp => {
      console.log(resp);
    })
  }

  // onReady(initEditor : any) {
  //   console.log('Editor Init Event',initEditor);
  //   initEditor.ui.view.editable.element.style.height = '400px';
  // }

  blobToBase64(blobFile: Blob) {
    let reader = new FileReader();
    reader.onload = (e) => {
      this.imageBase64 = reader.result;
    }
    reader.readAsDataURL(blobFile)
  }

  async imageSelected(imageObject: any) {
    let response = await fetch(imageObject.imageUrl)
    let responseBlob = await response.blob()

    // x.onload = (e) => {
    //     fetch(x.result as string).then(response => response.blob()).then(b => {
    //         this.imageChangedEvent = { target : {files : [b]}};

    //     })

    // }
    // x.readAsDataURL(event.target.files[0])
    // this.blobToBase64(responseBlob)
    this.imgChangeEvt = { target: { files: [responseBlob] } };
  }
  setWidthHeight(width: number, height: number) {
    this.cropper = {
      x1: 0,
      y1: 0,
      x2: width,
      y2: height
    }
  }

}
