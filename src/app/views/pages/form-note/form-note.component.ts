import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css']
})
export class FormNoteComponent implements OnInit {

  title = "FIAP NOTES"
  logoImage = "/assets/logo.png"
  checkoutForm: FormGroup;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder, private noteService: NoteService) {
    this.subscription = this.noteService.editNoteProvider.subscribe(
      (note: Note) => {
        this.checkoutForm = this.formBuilder.group({
          id: note.id,
          textNote: [note.text, [Validators.required, Validators.minLength(5)]],
          isEditing: true,
        })
      }
    );

    this.checkoutForm = this.formBuilder.group({
        textNote: ['', [Validators.required, Validators.minLength(5)]],
    })

  }

  ngOnInit(): void {  
  }

  sendNote(){
    if(this.checkoutForm.valid){
      if(!this.checkoutForm.value.isEditing) {
        this.noteService.postNotes(this.checkoutForm.value.textNote)
        .subscribe((note) => 
          {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          }
        );
      }
      else{
        this.noteService.editNote(this.checkoutForm.value.id, this.checkoutForm.value.textNote)
        .subscribe((note) => 
          {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          }
        );
      }
    }
  }

  get textNote(){
    return this.checkoutForm.get('textNote');
  }

}
